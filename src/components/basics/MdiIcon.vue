<template>
  <svg :class="{'disabled': disabled, 'clickable': clickable, 'no-background': noBackground}" :height="size"
       :width="size" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  clickable: {
    type: Boolean
  },
  noBackground: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.disabled {
  fill: color.adjust($black, $alpha: -0.7);
}

.clickable {
  cursor: pointer;
  transition: fill 0.2s ease;

  @media (hover: hover) {
    &:not(.no-background):hover {
      background-color: color.adjust($primary, $lightness: -5%);
    }

    &.no-background:hover {
      fill: color.adjust($white, $lightness: -50%);
    }
  }
}
</style>
