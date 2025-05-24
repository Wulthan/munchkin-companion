import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBackgroundStore = defineStore('background', () => {
  const shiftAmount = ref(100)
  const positionX = ref(0)

  const backgroundStyle = computed(() => {
    return {
      backgroundPosition: `${positionX.value}px center`,
    }
  })

  function shift(direction) {
    const delta = direction === 'right' ? -shiftAmount.value : shiftAmount.value
    positionX.value += delta
  }

  return { shiftAmount, positionX, backgroundStyle, shift }
})
