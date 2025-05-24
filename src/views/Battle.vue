<template>
  <div class="battle-container">
    <div class="player-list">
      <template v-for="(player, id) in battleStore.players">
        <BattleCard :id="player.id" :removable="playerStore.currentPlayer.id !== player.id" is-player/>
      </template>
    </div>

    <div class="comparison">
      <div class="strength-list">
        <div class="player-strength">{{ battleStore.totalPlayerStrength }}</div>
        <div class="bar">/</div>
        <div class="monster-strength">{{ battleStore.totalMonsterStrength }}</div>
      </div>
      <div :class="{ 'positive': battleStore.totalStrengthDiff > 0, 'negative': battleStore.totalStrengthDiff < 0 }"
           class="diff">
        ({{ battleStore.totalStrengthDiff }})
      </div>
    </div>

    <div class="monster-list">
      <template v-for="(monster, id) in battleStore.monsters">
        <BattleCard :id="monster.id" :removable="battleStore.monsters.length > 1"/>
      </template>
    </div>

    <div class="actions top">
      <Button :icon="mdiFlagCheckered" @click="stateStore.setPhase(phase.running)"/>
    </div>

    <div class="actions bottom">
      <Button :disabled="battleStore.players.length > 1" :icon="mdiAccountPlus" @click="showPlayerSelector = true"/>
      <Button :icon="mdiEmoticonDevil" @click="battleStore.addMonsterToBattle"/>
    </div>

    <div v-if="showPlayerSelector" class="player-helper">
      <mdi-icon :icon="mdiClose" class="clickable remove" size="2rem" @click="showPlayerSelector = false"/>
      <div class="scroller">
        <div v-for="(player, id) in battleStore.playersNotInBattle">
          <PlayerCard :player="player" disable-controls @click="addHelper(player.id)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { phase, useStateStore } from '@/stores/state.js'
import { usePlayerStore } from '@/stores/player.js'
import { useBattleStore } from '@/stores/battle.js'
import BattleCard from '@/components/compositions/BattleCard.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import Button from '@/components/basics/Button.vue'
import { mdiAccountPlus, mdiClose, mdiEmoticonDevil, mdiFlagCheckered } from '@mdi/js'
import PlayerCard from '@/components/compositions/PlayerCard.vue'
import MdiIcon from '@/components/basics/MdiIcon.vue'

// Lifecycle hooks
onMounted(() => {
  if (battleStore.players.length === 0) {
    battleStore.addPlayerToBattle(playerStore.currentPlayer.id)
  }

  if (battleStore.monsters.length === 0) {
    battleStore.addMonsterToBattle()
  }
})

onUnmounted(() => {
  battleStore.$reset()
})

// Stores
const stateStore = useStateStore()
const playerStore = usePlayerStore()
const battleStore = useBattleStore()

// Data
const showPlayerSelector = ref(false)

// Methods
const addHelper = (id) => {
  battleStore.addPlayerToBattle(id)
  showPlayerSelector.value = false
}
</script>

<style lang="scss" scoped>
.battle-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $gap-normal;

  .comparison {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-family: $font-header;
    letter-spacing: 0.2rem;

    .diff {
      font-size: 1.5rem;
      color: #ff9d3f;

      &.positive {
        color: #63da63;
      }

      &.negative {
        color: #ff6060;
      }
    }

    .strength-list {
      display: block;
      letter-spacing: normal;

      .player-strength {
        display: inline-block;
        min-width: 60px;
        text-align: right;
        vertical-align: super;
      }

      .bar {
        display: inline;
        margin: 0 $gap-small;
      }

      .monster-strength {
        display: inline-block;
        min-width: 60px;
        text-align: left;
        vertical-align: sub;
      }
    }
  }

  .player-list, .monster-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-normal;

    scroll-snap-type: both mandatory;
    scroll-behavior: smooth;

    max-width: 100%;
    max-height: 100%;
    overflow: scroll;
    padding: 1.5rem;
  }

  .player-list {
    align-items: end;
  }

  .monster-list {
    align-items: start;
  }

  .actions {
    position: absolute;
    right: $gap-small;
    display: flex;
    gap: $gap-small;

    &.top {
      top: $gap-small;
    }

    &.bottom {
      bottom: $gap-small;
    }
  }

  .player-helper {
    z-index: 2;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    height: 100%;
    width: 100%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .remove {
      position: absolute;
      top: $gap-small;
      right: $gap-small;
    }

    .scroller {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
      overflow: scroll;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
    }

    .player-card {
      width: unset;
      scroll-snap-align: center;

      :deep(.card) {
        &:hover {
          cursor: pointer;
          box-shadow: 0 0 16px 2px $primary;
        }
      }
    }
  }
}

// Tablet (portrait)
@media (orientation: portrait) {
  .battle-container {
    flex-direction: column;

    .comparison {
      flex-direction: row;
    }

    .player-list, .monster-list {
      flex-direction: row;
    }
  }
}
</style>
