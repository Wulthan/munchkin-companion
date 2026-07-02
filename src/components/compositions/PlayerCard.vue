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
          <mdi-icon :clickable="!hideControls && !disableControls"
                    :icon="player.gender === 'male' ? mdiGenderMale : mdiGenderFemale"
                    size="2rem" @click="!hideControls && !disableControls && playerStore.swapGender(player.id)"/>
        </div>

        <div class="subdetails">
          <div class="stat level">
            <div class="label">Level</div>
            <div class="value">{{ player.level }}</div>
            <div class="controls">
              <mdi-icon :clickable="player.level > 1" :disabled="player.level <= 1" :hidden="hideControls"
                        :icon="mdiMinusCircleOutline" size="1.75rem"
                        @click="!hideControls && player.level > 1 && playerStore.decrementLevel(player.id)"/>
              <mdi-icon :clickable="!hideControls" :hidden="hideControls" :icon="mdiPlusCircleOutline" size="1.75rem"
                        @click="!hideControls && playerStore.incrementLevel(player.id)"/>
            </div>
          </div>

          <div class="stat gear">
            <div class="label">Gear</div>
            <div class="value">{{ player.gear }}</div>
            <div class="controls">
              <mdi-icon :clickable="!hideControls" :hidden="hideControls" :icon="mdiMinusCircleOutline" size="1.75rem"
                        @click="!hideControls && playerStore.decrementGear(player.id)"/>
              <mdi-icon :clickable="!hideControls" :hidden="hideControls" :icon="mdiPlusCircleOutline" size="1.75rem"
                        @click="!hideControls && playerStore.incrementGear(player.id)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mdiGenderFemale, mdiGenderMale, mdiMinusCircleOutline, mdiPlusCircleOutline } from '@mdi/js'
import { usePlayerStore } from '@/stores/player.js'
import MdiIcon from '@/components/basics/MdiIcon.vue'

const playerStore = usePlayerStore()

defineProps({
  player: Object,
  disableControls: Boolean,
  hideControls: Boolean,
})
</script>

<style lang="scss" scoped>
.player-card {
  width: fit-content;
  height: fit-content;
  will-change: transform, filter;

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
