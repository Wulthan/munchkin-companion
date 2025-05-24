<template>
  <div class="label">{{ msg }}</div>
</template>

<script setup>
defineProps({
  msg: String,
})
</script>

<style lang="scss" scoped>
.label {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: white;
  font-size: 1rem;
  font-family: $font-header;
}
</style>
