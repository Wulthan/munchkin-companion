<template>
  <div :class="{ animating }" class="game-container">
    <div ref="viewport" class="viewport">
      <div class="stage">
        <PlayerCard v-for="pos in SLOTS" :key="pos" :hide-controls="pos !== 0 || animating"
                    :player="playerAt(pos)" :style="cardStyle(pos)"/>
      </div>
    </div>

    <div class="controls">
      <Button :disabled="animating" :icon="mdiArrowLeft" @click="commit('prev')"/>
      <Button :disabled="animating" :icon="mdiSwordCross" @click="stateStore.setPhase(phase.battle)"/>
      <Button :disabled="animating" :icon="mdiArrowRight" @click="commit('next')"/>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useBackgroundStore } from '@/stores/background.js'
import { phase, useStateStore } from '@/stores/state.js'
import { usePlayerStore } from '@/stores/player.js'
import { mdiArrowLeft, mdiArrowRight, mdiSwordCross } from '@mdi/js'
import PlayerCard from '@/components/compositions/PlayerCard.vue'
import Button from '@/components/basics/Button.vue'

// Stores
const stateStore = useStateStore()
const backgroundStore = useBackgroundStore()
const playerStore = usePlayerStore()

// Refs
const viewport = useTemplateRef('viewport')
const animating = ref(false)
const offset = ref(0)
const instant = ref(false)

const SLOTS = [-2, -1, 0, 1, 2]

// Tuning
const DURATION = 250        // ms, must match the per-card CSS transition
const SLOP = 8              // px of movement before a touch/click becomes a drag
const VELOCITY = 0.5        // px/ms flick speed that commits a swipe regardless of distance
const SPACING = 250         // px between card centers
const COMMIT_DISTANCE = SPACING * 0.5 // px of travel that commits a swipe
const SIDE_SCALE = 0.8      // scale of an immediate neighbor card
const DROP = 24             // px an immediate neighbor card is nudged downward
const SIDE_BRIGHT = 0.6     // brightness of an immediate neighbor card

// Gesture state
let pointerActive = false
let isDragging = false
let startX = 0
let startY = 0
let lastX = 0
let lastT = 0
let velocity = 0

const lerp = (from, to, t) => from + (to - from) * t

/**
 * Retrieves a player relative to the currently active player index.
 * If there are no players in the store, the function returns `undefined`.
 *
 * @param {number} rel - The relative offset from the active player's index.
 * @returns {Object|undefined} The player object at the calculated position, or `undefined` if no players exist.
 */
const playerAt = (rel) => {
  const players = playerStore.players
  const n = players.length
  if (n === 0) {
    return undefined
  }
  return players[((playerStore.activePlayerIndex + rel) % n + n) % n]
}

/**
 * Generates a dynamic card style based on its relative position.
 *
 * This function calculates the style properties of a card based on its position within a stack.
 * It uses mathematical interpolation to determine the translation, scale, brightness, and stacking
 * order of the card, making it suitable for animations and transitions in UI elements like carousels.
 *
 * @param {number} pos - The relative offset from the active player's card index.
 * @returns {Object} Card styling properties
 */
const cardStyle = (pos) => {
  const d = pos * SPACING + offset.value
  const t = Math.abs(d) / SPACING
  const near = Math.min(t, 1)                 // 0..1 across the visible tuck range
  const far = Math.max(0, Math.min(t - 1, 1)) // 0..1 as the buffer recedes past the tuck
  const scale = far > 0 ? lerp(SIDE_SCALE, 0, far) : lerp(1, SIDE_SCALE, near)
  const brightness = far > 0 ? lerp(SIDE_BRIGHT, 0.05, far) : lerp(1, SIDE_BRIGHT, near)
  const dropY = lerp(0, DROP, near)
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(calc(-50% + ${d}px), calc(-50% + ${dropY}px)) scale(${scale})`,
    filter: `brightness(${brightness})`,
    zIndex: 100 - Math.round(Math.min(t, 2) * 10),
    transition: instant.value ? 'none' : `transform ${DURATION}ms ease-out, filter ${DURATION}ms ease-out`,
  }
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Shared commit path used by both swipes and the arrow buttons: slide the stage
// one slot so the neighbor animates into the center, swap the store's active
// player, then snap the offset back to 0 with transitions disabled. The reset is
// invisible because every visible slot holds the same player at the same place
// before and after the swap (only the off-screen buffers re-key).
const commit = async (direction) => {
  if (animating.value) {
    return
  }
  animating.value = true
  instant.value = false

  // Settle the background onto its stepped position concurrently with the cards.
  backgroundStore.commitShift(direction === 'next' ? 'right' : 'left')

  offset.value = direction === 'next' ? -SPACING : SPACING
  await wait(DURATION)

  if (direction === 'next') {
    playerStore.setNextPlayer()
  } else {
    playerStore.setPreviousPlayer()
  }

  // Batched with the store swap into a single patch → one invisible paint.
  instant.value = true
  offset.value = 0
  await nextTick()
  void viewport.value.offsetWidth // force reflow so the next transition starts cleanly
  instant.value = false

  animating.value = false
}

const cancel = async () => {
  animating.value = true
  instant.value = false
  backgroundStore.cancelDrag()
  offset.value = 0
  await wait(DURATION)
  animating.value = false
}

const onPointerDown = (e) => {
  if (animating.value) {
    return
  }
  pointerActive = true
  isDragging = false
  startX = e.clientX
  startY = e.clientY
  lastX = e.clientX
  lastT = e.timeStamp
  velocity = 0
}

const onPointerMove = (e) => {
  if (!pointerActive) {
    return
  }

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  // Only treat this as a horizontal drag once it clears the slop and is more
  // horizontal than vertical. Below the slop it stays a tap so the centered
  // card's controls (level/gear/gender) still receive their click.
  if (!isDragging) {
    if (Math.abs(dx) < SLOP || Math.abs(dx) <= Math.abs(dy)) {
      return
    }
    isDragging = true
    instant.value = true
  }

  offset.value = Math.max(-SPACING, Math.min(SPACING, dx))
  // Background follows the same normalized progress so a full-slot drag equals
  // exactly one committed step (keeps the parallax continuous through commit).
  backgroundStore.setDragOffset(offset.value / SPACING * backgroundStore.shiftAmount)

  const dt = e.timeStamp - lastT
  if (dt > 0) {
    velocity = (e.clientX - lastX) / dt
  }
  lastX = e.clientX
  lastT = e.timeStamp
}

const onPointerUp = (e) => {
  if (!pointerActive) {
    return
  }
  pointerActive = false

  if (!isDragging) {
    return // it was a tap; let the click reach the underlying control
  }
  isDragging = false

  const dx = e.clientX - startX
  const committed = Math.abs(dx) > COMMIT_DISTANCE || Math.abs(velocity) > VELOCITY

  if (committed) {
    // Prefer velocity direction on a fast flick, otherwise use travel direction.
    const signal = Math.abs(velocity) > VELOCITY ? velocity : dx
    commit(signal < 0 ? 'next' : 'prev')
  } else {
    cancel()
  }
}

onMounted(() => {
  viewport.value.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
})

onBeforeUnmount(() => {
  viewport.value?.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
})
</script>

<style lang="scss" scoped>
.game-container {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.animating {
    pointer-events: none;
  }

  .viewport {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // Own all gestures on the carousel so the browser never scrolls/zooms it.
    touch-action: none;

    .stage {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  .controls {
    // Since the card is always in the center with the same size, absolute positioning is used
    // to center the controls below the card
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 200px);

    display: flex;
    justify-content: center;
    gap: calc(2.5in - 188px);
  }
}
</style>
