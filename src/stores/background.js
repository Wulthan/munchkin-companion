import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBackgroundStore = defineStore('background', () => {
  const shiftAmount = ref(100)
  const positionX = ref(0)
  const dragOffset = ref(0)
  const dragging = ref(false)

  const backgroundStyle = computed(() => {
    return {
      backgroundPosition: `${positionX.value + dragOffset.value}px center`,
    }
  })

  function setDragOffset(px) {
    dragOffset.value = px
    dragging.value = true
  }

  function commitShift(direction) {
    const delta = direction === 'right' ? -shiftAmount.value : shiftAmount.value
    positionX.value += delta
    dragOffset.value = 0
    dragging.value = false
  }

  function cancelDrag() {
    dragOffset.value = 0
    dragging.value = false
  }

  return { shiftAmount, positionX, dragOffset, dragging, backgroundStyle, setDragOffset, commitShift, cancelDrag }
})
