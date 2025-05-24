<template>
  <div class="game-container">
    <div ref="list" class="player-list">
      <PlayerCard ref="previous" :player="playerStore.previousPlayer" class="previous"/>
      <PlayerCard :player="playerStore.currentPlayer"/>
      <PlayerCard ref="next" :player="playerStore.nextPlayer" class="next"/>
    </div>

    <div class="controls">
      <Button :icon="mdiArrowLeft" @click="scrollToPrevious"/>
      <Button :icon="mdiSwordCross" @click="stateStore.setPhase(phase.battle)"/>
      <Button :icon="mdiArrowRight" @click="scrollToNext"/>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
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

const onInputStart = () => {
  isUserHolding = true
}

const onInputEnd = () => {
  isUserHolding = false
}

const onScroll = () => {
  if (isTransitioning) return

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
    detectScrollDirection()
  }, 100)
}

const detectScrollDirection = () => {
  const el = list.value
  const center = (el.scrollWidth - el.clientWidth) / 2
  const delta = el.scrollLeft - center
  const threshold = el.clientWidth * 0.5

  if (Math.abs(delta) < threshold) {
    lastDirection = null
    return
  }

  isTransitioning = true

  const direction = delta > 0 ? 'right' : 'left'
  if (direction === 'left') {
    playerStore.setPreviousPlayer()
  } else {
    playerStore.setNextPlayer()
  }

  // Reset scroll position after DOM updates
  requestAnimationFrame(() => {
    list.value.scrollLeft = center
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
