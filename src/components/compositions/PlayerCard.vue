<template>
  <div class="player-card">
    <div class="card">
      <div class="name">
        {{ player.name }}
      </div>

      <div class="details">
        <div class="stat strength">
          <div class="label">Strength</div>
          <div class="value">{{ player.level + player.gear }}</div>
        </div>

        <div class="stat gender">
          <mdi-icon :clickable="!disableControls" :icon="player.gender === 'male' ? mdiGenderMale : mdiGenderFemale"
                    size="2rem" @click="!disableControls && playerStore.swapGender(player.id)"/>
        </div>

        <div class="subdetails">
          <div class="stat level">
            <div class="label">Level</div>
            <div class="value">{{ player.level }}</div>
            <div v-if="!disableControls" class="controls">
              <mdi-icon :icon="mdiArrowUpDropCircleOutline" clickable size="1.75rem"
                        @click="playerStore.incrementLevel(player.id)"/>
              <mdi-icon :clickable="player.level > 1" :disabled="player.level <= 1"
                        :icon="mdiArrowDownDropCircleOutline" size="1.75rem"
                        @click="player.level > 1 && playerStore.decrementLevel(player.id)"/>
            </div>
          </div>

          <div class="stat gear">
            <div class="label">Gear</div>
            <div class="value">{{ player.gear }}</div>
            <div v-if="!disableControls" class="controls">
              <mdi-icon :icon="mdiArrowUpDropCircleOutline" clickable size="1.75rem"
                        @click="playerStore.incrementGear(player.id)"/>
              <mdi-icon :icon="mdiArrowDownDropCircleOutline" clickable size="1.75rem"
                        @click="playerStore.decrementGear(player.id)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mdiArrowDownDropCircleOutline, mdiArrowUpDropCircleOutline, mdiGenderFemale, mdiGenderMale } from '@mdi/js'
import { usePlayerStore } from '@/stores/player.js'
import MdiIcon from '@/components/basics/MdiIcon.vue'

const playerStore = usePlayerStore()

defineProps({
  player: Object,
  disableControls: Boolean
})
</script>

<style lang="scss" scoped>
.player-card {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  scroll-behavior: smooth;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .card {
    display: flex;
    flex-direction: column;

    height: 3.5in;
    width: 2.5in;

    color: $secondary;
    background-color: $primary;
    border: 0.3rem solid $secondary;
    border-radius: $radius-2;
    font-family: $font-header;
    box-shadow: 5px 8px 12px 1px $black;
  }

  .name {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 1.25rem;
    padding: 0.75rem 0.25rem 0.25rem 0.25rem;
    display: block;
  }

  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;

    .label {
      text-decoration: underline;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $gap-normal;
      font-size: 1.25rem;

      .value {
        font-size: 2rem;
      }

      &.strength {
        gap: 1.5rem;

        .value {
          font-size: 3rem;
        }
      }

      .controls {
        display: flex;
        gap: $gap-small;
      }
    }

    .subdetails {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
