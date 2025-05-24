<template>
  <div class="battle-card">
    <div :class="{ 'player': isPlayer }" class="card">
      <mdi-icon v-if="entity.gender" :icon="entity.gender === 'male' ? mdiGenderMale : mdiGenderFemale"
                class="clickable gender" size="2rem" @click="swapGender"/>

      <mdi-icon v-if="removable" :icon="mdiClose" class="clickable remove" size="2rem" @click="remove"/>

      <div class="name">{{ entity.name }}</div>

      <div class="subdetails">
        <div class="stat level">
          <div class="label">Level</div>
          <div class="value">{{ entity.level }}</div>
          <div class="controls">
            <mdi-icon :icon="mdiArrowUpDropCircleOutline" class="clickable" size="1.75rem" @click="incrementLevel"/>
            <mdi-icon :class="{'clickable': entity.level > 1}" :disabled="entity.level <= 1"
                      :icon="mdiArrowDownDropCircleOutline" size="1.75rem"
                      @click="entity.level > 1 && decrementLevel()"/>
          </div>
        </div>

        <div v-if="typeof entity.gear !== 'undefined'" class="stat gear">
          <div class="label">Gear</div>
          <div class="value">{{ entity.gear }}</div>
          <div class="controls">
            <mdi-icon :icon="mdiArrowUpDropCircleOutline" class="clickable" size="1.75rem" @click="incrementGear"/>
            <mdi-icon :icon="mdiArrowDownDropCircleOutline" class="clickable" size="1.75rem" @click="decrementGear"/>
          </div>
        </div>

        <div class="stat modifier">
          <div class="label">Modifier</div>
          <div class="value">{{ entity.modifier }}</div>
          <div class="controls">
            <mdi-icon :icon="mdiArrowUpDropCircleOutline" class="clickable" size="1.75rem" @click="incrementModifier"/>
            <mdi-icon :icon="mdiArrowDownDropCircleOutline" class="clickable" size="1.75rem"
                      @click="decrementModifier"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  mdiArrowDownDropCircleOutline,
  mdiArrowUpDropCircleOutline,
  mdiClose,
  mdiGenderFemale,
  mdiGenderMale
} from '@mdi/js'
import { usePlayerStore } from '@/stores/player.js'
import { useBattleStore } from '@/stores/battle.js'
import MdiIcon from '@/components/basics/MdiIcon.vue'
import { computed, onUnmounted } from 'vue'

// Store
const playerStore = usePlayerStore()
const battleStore = useBattleStore()

// Props
const props = defineProps({
  isPlayer: Boolean,
  id: Number,
  removable: {
    type: Boolean,
    default: true
  },
})

// Computed
const entity = computed(() => {
  return props.isPlayer ? playerStore.playerById(props.id) : battleStore.monsterById(props.id)
})

// Functions
const remove = () => {
  if (props.isPlayer) {
    battleStore.removePlayerFromBattle(entity.value.id)
  } else {
    battleStore.removeMonsterFromBattle(entity.value.id)
  }
}

const swapGender = () => {
  if (props.isPlayer) {
    playerStore.swapGender(entity.value.id)
  }
}

const incrementLevel = () => {
  if (props.isPlayer) {
    playerStore.incrementLevel(entity.value.id)
  } else {
    battleStore.incrementMonsterLevel(entity.value.id)
  }
}

const decrementLevel = () => {
  if (props.isPlayer) {
    playerStore.decrementLevel(entity.value.id)
  } else {
    battleStore.decrementMonsterLevel(entity.value.id)
  }
}

const incrementGear = () => {
  if (props.isPlayer) {
    playerStore.incrementGear(entity.value.id)
  }
}

const decrementGear = () => {
  if (props.isPlayer) {
    playerStore.decrementGear(entity.value.id)
  }
}

const incrementModifier = () => {
  if (props.isPlayer) {
    playerStore.incrementModifier(entity.value.id)
  } else {
    battleStore.incrementMonsterModifier(entity.value.id)
  }
}

const decrementModifier = () => {
  if (props.isPlayer) {
    playerStore.decrementModifier(entity.value.id)
  } else {
    battleStore.decrementMonsterModifier(entity.value.id)
  }
}

onUnmounted(() => {
  if (props.isPlayer) {
    entity.value.modifier = 0
  }
})
</script>

<style lang="scss" scoped>
.battle-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $gap-normal;
    height: 1.7in;
    width: 2.5in;
    color: $secondary;
    background-color: $primary;
    border: 0.3rem solid $secondary;
    border-radius: $radius-2;
    font-family: $font-header;
    box-shadow: 5px 8px 12px 1px $black;

    &.player {
      width: 3.5in;
    }
  }

  .gender {
    position: absolute;
    margin: 0.25rem 0 0 0.25rem;
  }

  .remove {
    position: absolute;
    right: 0;
    margin: 0.25rem 0.25rem 0 0;
  }

  .name {
    height: 1.5rem;
    padding: 0.75rem 2.5rem 0 2.5rem;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 1.25rem;
    display: block;
  }

  .label {
    text-decoration: underline;
  }

  .stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: $gap-small;
    font-size: 1.25rem;

    .value {
      font-size: 2rem;
    }

    .controls {
      display: flex;
      gap: $gap-small;
    }
  }

  .subdetails {
    flex: 1;
    display: flex;
    justify-content: space-around;
  }
}
</style>
