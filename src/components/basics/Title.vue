<template>
  <div class="title">{{ msg }}</div>
</template>

<script setup>
defineProps({
  msg: String,
})
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 3.75rem;
  font-family: $font-header;

  color: $tertiary;
  text-shadow: 0 0 3px $primary, 6px 8px 7px $black;
}

// Small phones
@media (max-width: 480px) {
  .title {
    font-size: 3.75rem;
  }
}

// Large phones
@media (min-width: 481px) and (max-width: 767px) {
  .title {
    font-size: 3.75rem;
  }
}

// Tablet (portrait)
@media (min-width: 768px) and (max-width: 991px) {
  .title {
    font-size: 3.75rem;
  }
}

// Tablet (landscape)
@media (min-width: 992px) and (max-width: 1199px) {
  .title {
    font-size: 5rem;
  }
}

// Desktop (standard)
@media (min-width: 1200px) {
  .title {
    font-size: 5rem;
  }
}

// Desktop (large)
@media (min-width: 1600px) {
  .title {
    font-size: 5rem;
  }
}
</style>
