<template>
  <button
      class="button"
      :disabled="disabled"
  >
    <div class="button__wrapper">
      <slot />
    </div>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.button {
  width: fit-content;
  height: 40px;
  background-color: white;
  font-family: Montserrat, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  border: 2px solid black;
  border-radius: 12px;
  color: black;
  padding: 0 16px;
  transition: 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;

  &__wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 100px;
  }

  &:hover {
    filter: brightness(1.3);
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
}
</style>