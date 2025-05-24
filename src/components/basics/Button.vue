<template>
  <button :class="{'icon': !label, 'disabled': disabled, 'small': small}" :disabled="disabled" class="button">
    <template v-if="label">{{ label }}</template>
    <mdi-icon v-else :icon="icon" size="1.5rem"/>
  </button>
</template>

<script setup>
import MdiIcon from '@/components/basics/MdiIcon.vue'

defineProps({
  label: String,
  icon: String,
  disabled: Boolean,
  small: Boolean,
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.button {
  background-color: $primary;
  border: 0.3rem solid $secondary;
  border-radius: $radius-2;
  color: $secondary;
  font-size: 1rem;
  height: 3rem;
  min-height: 3rem;
  width: auto;
  font-family: $font-header;

  &.small {
    border-width: 0.2rem;
    border-radius: $radius-1;
    height: 2rem;
    min-height: 2rem;

    &.icon {
      width: 2rem;
      min-width: 2rem;
    }
  }

  &.icon {
    padding: 0;
    width: 3rem;
    min-width: 3rem;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    @media (hover: hover) {
      &:hover {
        cursor: not-allowed;
      }
    }
  }

  @media (hover: hover) {
    &:hover {
      background-color: color.adjust($primary, $lightness: -5%);
      border-color: color.adjust($secondary, $lightness: -5%);
      cursor: pointer;
    }
  }

  &:active {
    background-color: color.adjust($primary, $lightness: -10%);
    border-color: color.adjust($secondary, $lightness: -10%);
  }

  &:focus {
    outline: none;
  }
}
</style>
