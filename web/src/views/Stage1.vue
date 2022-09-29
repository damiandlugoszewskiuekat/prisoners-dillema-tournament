<template>
  <Page>
    <template #title>
      Na początku podaj swoje imię i nazwisko!
    </template>
    <div class="content">
      <Input v-model="nick" placeholder="Imię i nazwisko*"/>
      <Button :disabled="!nick.length" @click="handleClick">Dołącz</Button>
    </div>
  </Page>
</template>

<script setup>
import { ref } from 'vue';
import {metadata, setNick} from "../../composition-api/app";
import Page from "./Page.vue";
import Button from "../components/global/Button.vue";
import Input from "../components/global/Input.vue";
const nick = ref(metadata.value?.nick || '')

const handleClick = () => {
  setNick(nick.value)
}
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

</style>
