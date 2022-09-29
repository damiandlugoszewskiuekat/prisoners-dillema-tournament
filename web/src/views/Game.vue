<template>
  <div v-if="!isLoading">
    <Stage0 v-if="stage === 0"/>
    <Stage1 v-if="stage === 1"/>
    <Stage2 v-if="stage === 2"/>
    <Stage3 v-if="stage === 3"/>
    <Stage4 v-if="stage === 4"/>
    <Stage5 v-if="stage === 5"/>
    <Stage6 v-if="stage === 6"/>
    <Stage7 v-if="stage === 7"/>
  </div>

</template>

<script setup>
import {isLoading, stage, initWS} from "../../composition-api/app";
import {onMounted} from "@vue/runtime-core";
import Stage0 from "./Stage0.vue";
import Stage1 from "./Stage1.vue";
import Stage2 from "./Stage2.vue";
import Stage3 from "./Stage3.vue";
import Stage4 from "./Stage4.vue";
import Stage5 from "./Stage5.vue";
import Stage6 from "./Stage6.vue";
import Stage7 from "./Stage7.vue";

onMounted(async () => {
  await initWS()
})
</script>

<style lang="scss" scoped>
  div {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
</style>