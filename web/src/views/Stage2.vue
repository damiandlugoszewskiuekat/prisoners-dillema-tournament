<template>
  <Page>
    <template #title>
      Pokoje z graczami
    </template>
    <div class="content">
      <p>Możesz utworzyć własny pokój, a następnie podać jego kod znajomym, dzięki któremu będą oni mogli do Ciebie dołączyć.</p>
      <Button @click="createRoom">Nowy pokój</Button>
      <p>Jednakże, jeśli posiadasz kod pokoju od znajomego, wpisz go poniżej aby do niego dołączyć.</p>
      <Input v-model="room" placeholder="Kod pokoju"/>
      <Button :disabled="!room.length" @click="handleJoin">Dołącz do istniejącego pokoju</Button>
    </div>
  </Page>
</template>

<script setup>
import Page from "./Page.vue";
import { ref } from 'vue'
import { createRoom, joinToRoom } from "../../composition-api/app";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";

const room = ref('')

const handleJoin = () => {
  joinToRoom(room.value)
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

  p {
    text-align: center;
  }

  strong {
    font-weight: bold;
  }
}
</style>
