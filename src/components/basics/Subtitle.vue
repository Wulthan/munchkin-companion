<template>
  <div class="subtitle">{{ msg }}</div>
</template>

<script setup>
defineProps({
  msg: String,
})
</script>

<style lang="scss" scoped>
.subtitle {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1.5rem;
  font-family: $font-header;

  color: $white;
  text-shadow: 6px 8px 7px $black;
}

// Small phones
@media (max-width: 480px) {
  .subtitle {
    font-size: 1.75rem;
  }
}

// Large phones
@media (min-width: 481px) and (max-width: 767px) {
  .subtitle {
    font-size: 1.75rem;
  }
}

// Tablet (portrait)
@media (min-width: 768px) and (max-width: 991px) {
  .subtitle {
    font-size: 1.75rem;
  }
}

// Tablet (landscape)
@media (min-width: 992px) and (max-width: 1199px) {
  .subtitle {
    font-size: 2.5rem;
  }
}

// Desktop (standard)
@media (min-width: 1200px) {
  .subtitle {
    font-size: 2.5rem;
  }
}

// Desktop (large)
@media (min-width: 1600px) {
  .subtitle {
    font-size: 2.5rem;
  }
}
</style>
