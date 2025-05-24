<template>
  <div class="setup">
    <div class="content">
      <div class="form">
        <div class="player-info">
          <input v-model="playerName" placeholder="Player Name" type="text"/>
          <Button :icon="playerGender === 'male' ? mdiGenderMale : mdiGenderFemale"
                  @click="playerGender = playerGender === 'male' ? 'female' : 'male'"/>
        </div>
        <Button :disabled="!playerName" label="Add Player" @click="addPlayer"/>
      </div>

      <div class="player-list">
        <Label :msg="`Players (${playerStore.players.length})`"/>
        <div class="list">
          <div v-for="player in playerStore.players" :key="player.id" class="item">
            {{ player.name }}
            <div class="actions">
              <Button :icon="player.gender === 'male' ? mdiGenderMale : mdiGenderFemale" small
                      @click="playerStore.swapGender(player.id)"/>
              <Button :icon="mdiClose" small @click="playerStore.removePlayer(player.id)"/>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <Button :disabled="playerStore.players.length < 1" label="Start Game"
                @click="stateStore.setPhase(phase.running)"/>
        <Button label="Main Menu" @click="stateStore.setPhase(phase.menu)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { phase, useStateStore } from '@/stores/state.js'
import { usePlayerStore } from '@/stores/player.js'
import { ref } from 'vue'
import { mdiClose, mdiGenderFemale, mdiGenderMale } from '@mdi/js'
import Button from '@/components/basics/Button.vue'
import Label from '@/components/basics/Label.vue'

const stateStore = useStateStore()
const playerStore = usePlayerStore()

const playerName = ref('')
const playerGender = ref('male')

const addPlayer = () => {
  playerStore.addPlayer(playerName.value, playerGender.value)
  playerName.value = ''
}
</script>

<style lang="scss" scoped>
.setup {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $gap-normal;
  overflow-x: hidden;
  padding: 12px 0;
  width: 80%;
  max-width: 500px;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: $gap-normal;
    width: 100%;
    overflow: scroll;

    .form {
      display: flex;
      flex-direction: column;
      gap: $gap-small;

      .player-info {
        flex: 1;
        display: flex;
        gap: $gap-small;
        align-items: center;
      }
    }

    .player-list {
      display: flex;
      flex-direction: column;
      gap: $gap-small;
      overflow: scroll;
      padding: 6px 0;

      .list {
        display: flex;
        flex-direction: column;
        gap: $gap-small;
        height: 250px;
        width: calc(100% - 24px); // 24px for padding
        margin: auto;
        padding: 0 12px;
        overflow: scroll;

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-break: anywhere;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: $radius-1;
          padding: 6px;

          .actions {
            display: flex;
            flex-direction: row;
            gap: $gap-small;
          }
        }
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: $gap-small;
    }

    @media (max-height: 600px) {
      .actions, .form {
        flex-direction: row;
      }

      .actions .button {
        flex: 1;
      }
    }
  }
}
</style>
