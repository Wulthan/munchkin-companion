// Store for game state
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { usePlayerStore } from '@/stores/player.js'

export const useBattleStore = defineStore('battle', () => {
  const playerStore = usePlayerStore()

  const players = reactive([])
  const monsters = reactive([])

  const totalPlayerStrength = computed(() => {
    let total = 0
    players.forEach(player => {
      total += player.level + player.gear + player.modifier
    })
    return total
  })

  const totalMonsterStrength = computed(() => {
    let total = 0
    monsters.forEach(monster => {
      total += monster.level + monster.modifier
    })
    return total
  })

  const totalStrengthDiff = computed(() => {
    const diff = totalPlayerStrength.value - totalMonsterStrength.value
    if (diff > 0) {
      return `+${diff}`
    } else {
      return diff
    }
  })

  const monsterById = computed(() => {
    return (id) => {
      const monster = monsters.find(monster => monster.id === id)
      if (typeof monster === 'undefined') {
        console.error('invalid monster id: ' + id)
        return undefined
      }

      return monster
    }
  })

  const playersNotInBattle = computed(() => {
    return playerStore.players.filter(player => !players.find(p => p.id === player.id))
  })

  function $reset() {
    players.splice(0)
    monsters.splice(0)
  }

  function addPlayerToBattle(id) {
    const player = playerStore.playerById(id)
    if (typeof player !== 'undefined' && players.length < 2 && !players.find(p => p.id === player.id)) {
      players.push(player)
    }
  }

  function addMonsterToBattle() {
    let id = 1
    monsters.forEach(monster => {
      if (monster.id >= id) {
        id = monster.id + 1
      }
    })
    monsters.push({ id, name: 'Monster', level: 1, modifier: 0 })
  }

  function removePlayerFromBattle(id) {
    const index = players.findIndex(player => player.id === id)
    if (index !== -1) {
      if (id === playerStore.currentPlayer.id) {
        console.error('cannot remove current player')
        return
      }
      players.splice(index, 1)
    }
  }

  function removeMonsterFromBattle(id) {
    const index = monsters.findIndex(monster => monster.id === id)
    if (index !== -1) {
      monsters.splice(index, 1)
    }
  }

  function incrementMonsterLevel(id) {
    const monster = this.monsterById(id)
    if (typeof monster !== 'undefined') {
      monster.level++
    }
  }

  function incrementMonsterModifier(id) {
    const monster = this.monsterById(id)
    if (typeof monster !== 'undefined') {
      monster.modifier++
    }
  }

  function decrementMonsterLevel(id) {
    const monster = this.monsterById(id)
    if (typeof monster !== 'undefined') {
      monster.level--
    }
  }

  function decrementMonsterModifier(id) {
    const monster = this.monsterById(id)
    if (typeof monster !== 'undefined') {
      monster.modifier--
    }
  }

  return {
    players,
    monsters,
    totalPlayerStrength,
    totalMonsterStrength,
    totalStrengthDiff,
    monsterById,
    playersNotInBattle,
    $reset,
    addPlayerToBattle,
    addMonsterToBattle,
    removePlayerFromBattle,
    removeMonsterFromBattle,
    incrementMonsterLevel,
    incrementMonsterModifier,
    decrementMonsterLevel,
    decrementMonsterModifier,
  }
})
