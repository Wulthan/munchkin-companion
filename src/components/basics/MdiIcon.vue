<template>
  <svg :class="{'disabled': disabled}" :height="size" :width="size" aria-hidden="true" fill="currentColor"
       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path :d="icon"/>
  </svg>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '24'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.disabled {
  fill: color.adjust($black, $alpha: -0.7);
}
</style>
