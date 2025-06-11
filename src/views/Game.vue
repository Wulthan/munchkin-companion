<template>
  <div :class="{ 'transitioning': blockInteraction }" class="game-container">
    <div ref="list" class="player-list">
      <PlayerCard ref="previous" :player="playerStore.previousPlayer" class="previous"/>
      <PlayerCard :player="playerStore.currentPlayer"/>
      <PlayerCard ref="next" :player="playerStore.nextPlayer" class="next"/>
    </div>

    <div class="controls">
      <Button :disabled="blockInteraction" :icon="mdiArrowLeft" @click="scrollToPrevious"/>
      <Button :disabled="blockInteraction" :icon="mdiSwordCross" @click="stateStore.setPhase(phase.battle)"/>
      <Button :disabled="blockInteraction" :icon="mdiArrowRight" @click="scrollToNext"/>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
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
const list = useTemplateRef('list')
const previous = useTemplateRef('previous')
const next = useTemplateRef('next')

// Functions
const scrollToPrevious = () => {
  previous.value.$el.scrollIntoView({ behavior: 'smooth' })
}

const scrollToNext = () => {
  next.value.$el.scrollIntoView({ behavior: 'smooth' })
}

let scrollTimeout = null
let isTransitioning = false
let lastDirection = null
let isUserHolding = false

let blockInteraction = ref(false)

const onInputStart = () => {
  isUserHolding = true
}

const onInputEnd = () => {
  isUserHolding = false
}

const onScroll = () => {
  blockInteraction.value = !(isTransitioning && !isUserHolding)

  if (isTransitioning || isUserHolding) {
    return
  }

  const el = list.value
  const center = (el.scrollWidth - el.clientWidth) / 2
  const delta = el.scrollLeft - center
  const threshold = el.clientWidth * 0.5

  const direction = delta > 0 ? 'right' : 'left'

  if (!isUserHolding && Math.abs(delta) > threshold && direction !== lastDirection) {
    backgroundStore.shift(direction)
    lastDirection = direction
  }

  // Debounce final player update
  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    triggerPlayerChange(direction, Math.abs(delta) > threshold)
  }, 100)
}

const triggerPlayerChange = (direction, thresholdMet) => {
  if (!thresholdMet) {
    lastDirection = null
    blockInteraction.value = false
    return
  }

  isTransitioning = true

  if (direction === 'left') {
    playerStore.setPreviousPlayer()
  } else {
    playerStore.setNextPlayer()
  }

  blockInteraction.value = false

  // Reset scroll position after DOM updates
  requestAnimationFrame(() => {
    const el = list.value
    list.value.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    setTimeout(() => {
      isTransitioning = false
      lastDirection = null
    }, 100)
  })
}

const addListeners = () => {
  list.value.addEventListener('scroll', onScroll, { passive: true })
  list.value.addEventListener('touchstart', onInputStart, { passive: true })
  list.value.addEventListener('touchend', onInputEnd)
  list.value.addEventListener('mousedown', onInputStart)
  window.addEventListener('mouseup', onInputEnd)
}

const removeListeners = () => {
  list.value.removeEventListener('scroll', onScroll)
  list.value.removeEventListener('touchstart', onInputStart)
  list.value.removeEventListener('touchend', onInputEnd)
  list.value.removeEventListener('mousedown', onInputStart)
  window.removeEventListener('mouseup', onInputEnd)
  clearTimeout(scrollTimeout)
}

onMounted(() => {
  list.value.scrollLeft = (list.value.scrollWidth - list.value.clientWidth) / 2
  requestAnimationFrame(() => addListeners())
})

onBeforeUnmount(() => {
  removeListeners()
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

  &.transitioning {
    pointer-events: none;
  }

  .player-list {
    flex-grow: 1;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
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
