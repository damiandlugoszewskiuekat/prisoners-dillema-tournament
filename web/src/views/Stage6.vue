<template>
  <Page>
    <template #title>
      Wyniki rozgrywek
    </template>
    <div class="content">
      <div class="scoreboard">
        <div
            class="scoreboard__position"
            v-for="(player, index) in players_scores"
            :key="index"
        >
          <p><strong>{{index + 1}}. {{player.player}}</strong></p>
          <p><strong>{{player.score}}</strong></p>
        </div>
      </div>
      <p><strong>Gratulacje!</strong></p>
      <p>Nie jestem w stanie przewidzieć wyboru Waszych strategii, jednakże warto nadmienić, że osoby, które wybrały <strong>strategie altruistyczne</strong> - grając ze sobą, są w stanie uzyskać <strong>lepsze</strong> wyniki od osób, które wybrały <strong>strategie egoistyczne</strong>.</p>
      <p>Dlaczego nie wspomniałem o tym na początku rozgrywki?</p>
      <p>Ano dlatego, że ta informacja mogłaby mieć wpływ na <strong>Wasze wybory</strong> strategii.</p>
      <p>Został Wam już tylko <strong>Test Thomasa - Kilmanna!</strong></p>
      <Button @click="stage += 1">Test</Button>
    </div>
  </Page>
</template>

<script setup>
import {ref} from 'vue';
import Page from "./Page.vue";
import Button from "../components/Button.vue";
import { stage, game } from "../../composition-api/app";

const players = ref(null);
const players_scores = ref([]);
players.value = game.value.players;
Object.entries(players.value).forEach(([player_id, games]) => {
  const nick = game.value.users_data.find(player => player.id === player_id).nick;
  const last_game_index = games.length - 1;
  const points = games[last_game_index].points_global_sum;
  players_scores.value.push({player: nick, score: points});
});
players_scores.value.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
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

.scoreboard {
  width: 32%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 24px;
  margin-bottom: 24px;

  &__position {
    display: flex;
    justify-content: space-between;
    align-items: center;
   }
}
</style>
