<template>
  <Page>
    <template #title>
      Kod pokoju: {{ code }}
    </template>
    <div class="content">
      <p><strong>Od teraz traktujmy grę poważnie.</strong></p>
      <p>Będziesz grał przeciwko graczom znajdującym się z Tobą w pokoju.</p>
      <p>Z każdym przeciwnikiem rozegrasz od <strong>6</strong> do <strong>10</strong> rund, ich liczba będzie każdorazowo losowana.</p>
      <p>Nie będziesz wiedział przeciwko komu grasz, jaki jest łączny wynik przeciwnika oraz ile rund jeszcze zostało do końca rozgrywki.</p>
      <p>Twoim zadaniem jest dobranie odpowiedniej według Ciebie <strong>strategii</strong> rozgrywającej iterowany dylemat więźnia przeciwko każdemu graczowi.</p>
      <p>Strategie już znasz, ale ich opisy znajdziesz również po rozpoczęciu rozgrywki przez właściciela pokoju.</p>
      <div class="players">
        <div class="players__player" v-for="player in players" :key="player.id">
          <img class="players__avatar" :src="Player" alt="avatar" />
          {{player.nick}}
        </div>
      </div>
      <p v-if="code !== metadata.my_room" class="loader_text">Zaczekaj, aż właściciel pokoju rozpocznie grę.</p>
      <Loader v-if="code !== metadata.my_room"/>
      <Button v-if="code === metadata.my_room" :disabled="players.length % 2 !== 0" @click="startGame">Start</Button>
      <p v-if="code === metadata.my_room">Przycisk startu pozostanie nieaktywny dopóki w pokoju nie będzie parzystej liczby graczy.</p>
    </div>
  </Page>
</template>

<script setup>
import Page from "./Page.vue";
import Button from "../components/Button.vue";
import Loader from "../components/Loader.vue";
import { code, players, metadata, startGame } from "../../composition-api/app";
import Player from "../static/Player.png";
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

.players {
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px 40px;
  flex-wrap: wrap;

  &__player {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  &__avatar {
    width: 40px;
  }
}
</style>
