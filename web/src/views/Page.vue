<template>
  <div class="page-wrapper">
    <div class="page">
      <div class="title">
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import {stage} from "../../composition-api/app";

</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 72%;
  height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: white;
  position: relative;
}

.title {
  font-size: 20px;
  margin-bottom: 32px;
  font-weight: bold;
}

</style>