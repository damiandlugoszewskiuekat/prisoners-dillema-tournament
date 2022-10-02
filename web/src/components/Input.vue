<template>
  <input
      :value="modelValue"
      :placeholder="placeholder"
      @blur="handleBlur"
      @input="handleInput"
  >
</template>

<script setup>

const emit = defineEmits(['update:modelValue', 'blur']);

defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '',
  },
});

const handleBlur = (event) => {
  emit('blur', event);
};

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
input {
  width: 240px;
  height: 40px;
  font-family: Montserrat, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  border: 2px solid black;
  border-radius: 12px;
  color: black;
  padding: 0 16px;
}
</style>