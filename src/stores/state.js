// Store for game state
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePlayerStore } from '@/stores/player.js'
import { useBattleStore } from '@/stores/battle.js'

const phase = {
  menu: 'menu',
  setup: 'setup',
  running: 'running',
  battle: 'battle',
}

export { phase }

export const useStateStore = defineStore('state', () => {
  const playerStore = usePlayerStore()
  const battleStore = useBattleStore()

  const gamePhase = ref(phase.menu)

  const isMenu = computed(() => gamePhase.value === phase.menu)
  const isSetup = computed(() => gamePhase.value === phase.setup)
  const isRunning = computed(() => gamePhase.value === phase.running)
  const isBattle = computed(() => gamePhase.value === phase.battle)

  function newGame() {
    playerStore.$reset()
    battleStore.$reset()
    setPhase(phase.setup)
  }

  function setPhase(newPhase) {
    if (Object.values(phase).includes(newPhase) === false) {
      console.error('invalid game phase: ' + newPhase)
      return
    }

    gamePhase.value = newPhase
  }

  function back() {
    switch (gamePhase.value) {
      case phase.menu:
        break
      case phase.setup:
        setPhase(phase.menu)
        break
      case phase.running:
        setPhase(phase.setup)
        break
      case phase.battle:
        setPhase(phase.running)
        break
      default:
        console.error('invalid game phase: ' + gamePhase.value)
        break
    }
  }

  return { gamePhase, isMenu, isSetup, isRunning, isBattle, newGame, setPhase, back }
})

