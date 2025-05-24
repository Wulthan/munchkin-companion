<template>
  <div class="menu">
    <div class="content">
      <Button v-if="playerStore.players.length > 0" label="Continue" @click="stateStore.setPhase(phase.setup)"/>
      <Button label="New Game" @click="stateStore.newGame"/>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/basics/Button.vue'
import { phase, useStateStore } from '@/stores/state.js'
import { usePlayerStore } from '@/stores/player.js'

const stateStore = useStateStore()
const playerStore = usePlayerStore()
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $gap-large;

  min-width: 2.5in;
  max-width: 500px;
  margin: 0 100px;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: $gap-small;
  }
}
</style>
