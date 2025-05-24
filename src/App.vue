<template>
  <div :style="backgroundStore.backgroundStyle" class="background"/>

  <mdi-icon v-if="!stateStore.isMenu" :icon="mdiChevronLeft" class="clickable back" size="2rem"
            @click="stateStore.back"/>

  <div :class="{ 'in-menu': stateStore.isMenu, 'in-setup': stateStore.isSetup, 'in-battle': stateStore.isBattle }"
       class="header">
    <Title class="title" msg="Munchkin"/>
    <Subtitle class="subtitle" msg="Companion"/>
  </div>

  <MainMenu v-if="stateStore.isMenu"/>
  <Setup v-else-if="stateStore.isSetup"/>
  <Game v-else-if="stateStore.isRunning"/>
  <Battle v-else-if="stateStore.isBattle"/>
</template>

<script setup>
import { useBackgroundStore } from '@/stores/background.js'
import { useStateStore } from '@/stores/state.js'
import MainMenu from '@/views/MainMenu.vue'
import Setup from '@/views/Setup.vue'
import Game from '@/views/Game.vue'
import Subtitle from '@/components/basics/Subtitle.vue'
import Title from '@/components/basics/Title.vue'
import Battle from '@/views/Battle.vue'
import { mdiChevronLeft } from '@mdi/js'
import MdiIcon from '@/components/basics/MdiIcon.vue'

const backgroundStore = useBackgroundStore()
const stateStore = useStateStore()
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  z-index: -1;
  overflow: hidden;
  display: flex;
  background-image: url(/wall.png);
  width: 100%;
  height: 100%;
  transition: background-position 0.5s ease;
  filter: brightness(50%);
}

.back {
  position: absolute;
  top: $gap-small;
  left: $gap-small;
  z-index: 1;
}

.header {
  position: absolute;
  top: 1.5rem;

  &.in-setup, &.in-menu, &.in-battle {
    position: relative;
    margin-top: 1.5rem;
    top: unset;
  }
}

@media (max-height: 576px) and (max-width: 991px),
(max-height: 630px) and (min-width: 992px) {
  .header:not(.in-setup):not(.in-menu) {
    display: none;
  }
}

@media (max-height: 400px) {
  .header.in-setup {
    display: none;
  }
}

@media (max-height: 225px) {
  .header.in-menu {
    display: none;
  }
}
</style>
