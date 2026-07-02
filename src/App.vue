<template>
  <div class="munchkin-app">
    <div :class="{ dragging: backgroundStore.dragging }" :style="backgroundStore.backgroundStyle" class="background"/>

    <div class="meta">
      {{ stateStore.version }}
      <div class="author">
        by
        <mdi-icon :icon="mdiGithub" class="icon" size="1rem"/>
        <a href="https://github.com/wulthan" target="_blank">Wulthan</a>
      </div>
    </div>

    <mdi-icon v-if="!stateStore.isMenu" :icon="mdiChevronLeft" class="back" clickable no-background size="2rem"
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
  </div>
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
import { mdiChevronLeft, mdiGithub } from '@mdi/js'
import MdiIcon from '@/components/basics/MdiIcon.vue'

const backgroundStore = useBackgroundStore()
const stateStore = useStateStore()
</script>

<style lang="scss" scoped>
.munchkin-app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  .background {
    position: fixed;
    z-index: -1;
    overflow: hidden;
    display: flex;
    background-image: url(/wall.png);
    width: 100%;
    height: 100%;
    transition: background-position 0.25s ease-out;
    filter: brightness(50%);
    
    &.dragging {
      transition: none;
    }
  }

  .meta {
    position: absolute;
    bottom: $gap-small;
    left: $gap-small;
    opacity: 0.4;
    z-index: 1;

    .author .icon {
      margin-right: 0.25rem;
    }
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
}
</style>
