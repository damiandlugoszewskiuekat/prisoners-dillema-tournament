<template>
  <Page>
    <template #title>
      <div class="content">
        <p>Przeciwnik {{ game.game_index }} z {{ game.game_count}}</p>
        <p>Twój łączny wynik: {{player_general_score}}</p>
      </div>
    </template>
    <div class="content">

      <div class="score">
        <p class="score__text"><strong>{{player_left_score}}</strong></p>
        -
        <p class="score__text"><strong>{{player_right_score}}</strong></p>
      </div>
      <div class="animation">
        <img class="animation__single" :src="player_left" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="player_right" alt="right person"/>
      </div>
    </div>

  </Page>
</template>

<script setup>
import Page from "./Page.vue";
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import { stage, game } from "../../composition-api/app";
import Me from "../static/Me.png";
import Enemy from "../static/Enemy.png";
import MeCC from "../static/animations/MeCC.gif";
import MeCT from "../static/animations/MeCT.gif";
import MeTC from "../static/animations/MeTC.gif";
import MeTT from "../static/animations/MeTT.gif";
import EnemyCC from "../static/animations/EnemyCC.gif";
import EnemyCT from "../static/animations/EnemyCT.gif";
import EnemyTC from "../static/animations/EnemyTC.gif";
import EnemyTT from "../static/animations/EnemyTT.gif";
import Building from "../static/Building.png";

const animation_timeout = ref(null);
const current_iteration = ref(0);

const player_left = ref(Me);
const player_right = ref(Enemy);

const player_left_score = ref(0);
const player_right_score = ref(0);
const player_general_score = ref(0);
const player_score_timeout = ref(null);

const machine_animation = ref(null);
const machine_animation_timeout = ref(null)

const resetMachineAnimation = () => {
  machine_animation_timeout.value = setTimeout(() => {
    machine_animation.value = null;
    clearTimeout(machine_animation_timeout.value);
  }, 1500)
}

const changeSrc = async (src_left, src_right) => {
  player_left.value = Me;
  player_right.value = Enemy;
  await nextTick();
  player_left.value = src_left;
  player_right.value = src_right;
}

const updateScore = (i) => {
  player_score_timeout.value = setTimeout(() => {
    player_left_score.value += game.value.points[i];
    player_right_score.value += game.value.enemy_points[i];
    player_general_score.value += game.value.points[i];
    clearTimeout(player_score_timeout.value);
  }, 1500)
}

onMounted(() => {
  player_general_score.value = game.value.points_global_sum - game.value.points_sum;
  animation_timeout.value = setInterval(() => {
    if (current_iteration.value >= (game.value.move.length)) {
      clearInterval(animation_timeout.value);
    }
    else {
      const my_result = game.value.move[current_iteration.value];
      const enemy_result = game.value.move_enemy[current_iteration.value];
      if(my_result && enemy_result) {
        machine_animation.value = 'win';
        changeSrc(MeCC, EnemyCC);
      } else if (my_result && !enemy_result) {
        machine_animation.value = 'one-win';
        changeSrc(MeCT, EnemyCT);
      } else if (!my_result && enemy_result) {
        machine_animation.value = 'one-win';
        changeSrc(MeTC, EnemyTC);
      } else {
        machine_animation.value = 'lose';
        changeSrc(MeTT, EnemyTT);
      }
      updateScore(current_iteration.value);
      resetMachineAnimation();
      current_iteration.value += 1;
    }
  }, 2000)
})

onUnmounted(() => {
  clearInterval(animation_timeout.value);
  clearTimeout(machine_animation_timeout.value);
  clearTimeout(player_score_timeout.value);
})
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

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 24px;

  &__text {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px black;
    border-radius: 4px;
  }
}

.animation {
  display: flex;
  justify-content: center;
  align-items: end;

  &__single {
    width: 200px;
    margin: 0 -72px;
    position: relative;
    z-index: 1;
  }

  &__machine {
    height: 240px;
    position: relative;
    z-index: 2;
    filter: grayscale(1) hue-rotate(0deg);
    transition: 0.4s;
    transition-delay: 1s;

    &.win {
      filter: grayscale(0) hue-rotate(0deg);
    }

    &.one-win {
      filter: grayscale(0) hue-rotate(320deg);
    }

    &.lose {
      filter: grayscale(0) hue-rotate(250deg);
    }
  }
}
</style>