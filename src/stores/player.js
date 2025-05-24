// Store for game state
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const players = reactive([])
  const activePlayerIndex = ref(0)

  const previousPlayer = computed(() => {
    if (activePlayerIndex.value === 0) {
      return players[players.length - 1]
    }

    return players[activePlayerIndex.value - 1]
  })

  const currentPlayer = computed(() => players[activePlayerIndex.value])

  const nextPlayer = computed(() => {
    if (activePlayerIndex.value === players.length - 1) {
      return players[0]
    }

    return players[activePlayerIndex.value + 1]
  })

  const playerById = computed(() => {
    return (id) => {
      const player = players.find(player => player.id === id)
      if (typeof player === 'undefined') {
        console.error('invalid player id: ' + id)
        return undefined
      }

      return player
    }
  })

  function $reset() {
    players.splice(0)
    activePlayerIndex.value = 0
  }

  function setNextPlayer() {
    activePlayerIndex.value = (activePlayerIndex.value + 1) % players.length
  }

  function setPreviousPlayer() {
    activePlayerIndex.value = (activePlayerIndex.value - 1 + players.length) % players.length
  }

  function addPlayer(name, gender) {
    if (name === '') {
      console.error('invalid player name: ' + name)
      return
    }

    if (['male', 'female'].includes(gender) === false) {
      console.error('unsupported player gender: ' + gender)
      return
    }

    let id = 1
    players.forEach(player => {
      if (player.id >= id) {
        id = player.id + 1
      }
    })

    players.push({ id, name, gender, level: 1, gear: 0, modifier: 0 })
  }

  function removePlayer(id) {
    const index = players.findIndex(player => player.id === id)
    if (index !== -1) {
      players.splice(index, 1)
    }
  }

  function incrementLevel(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.level++
    }
  }

  function incrementGear(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.gear++
    }
  }

  function incrementModifier(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.modifier++
    }
  }

  function decrementLevel(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.level--
    }
  }

  function decrementGear(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.gear--
    }
  }

  function decrementModifier(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.modifier--
    }
  }

  function swapGender(id) {
    const player = this.playerById(id)
    if (typeof player !== 'undefined') {
      player.gender = player.gender === 'male' ? 'female' : 'male'
    }
  }

  return {
    players,
    activePlayerIndex,
    previousPlayer,
    currentPlayer,
    nextPlayer,
    playerById,
    $reset,
    setNextPlayer,
    setPreviousPlayer,
    addPlayer,
    removePlayer,
    incrementLevel,
    incrementGear,
    incrementModifier,
    decrementLevel,
    decrementGear,
    decrementModifier,
    swapGender
  }
})
