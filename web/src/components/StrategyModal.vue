<template>
  <div class="modal" v-if="is_open">
    <Page class="modal__wrapper">
      <img :src="x" alt="x" class="modal__close" @click="handleClose"/>
      <template #title>
        <div class="content">
          <p>Strategia {{strategy.label}}</p>
        </div>
      </template>
      <div class="content">
        <p class="content__strategy-description">{{strategy.description}}</p>
        <div class="score">
          <p class="score__text"><strong>{{me_score}}</strong></p>
          -
          <p class="score__text"><strong>{{enemy_score}}</strong></p>
        </div>
        <div class="animation">
          <img class="animation__single" :src="me" alt="left person"/>
          <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
          <img class="animation__single" :src="enemy" alt="right person"/>
        </div>
        <div class="choices-button">
          <Button :disabled="block_move" @click="makeMove(true, strategy.name)">Współpracuj</Button>
          <Button :disabled="block_move" @click="makeMove(false, strategy.name)">Oszukuj</Button>
        </div>
        <Button class="modal__reset" @click="reset">Resetuj</Button>
      </div>
    </Page>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onUnmounted, ref } from 'vue';
import x from '../static/X.svg';
import Button from '../components/Button.vue'
import Page from '../views/Page.vue'
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

const emit = defineEmits(['close']);

defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },
  strategy: {
    type: Object,
    default: {},
  }
});

const handleClose = () => {
  emit('close');
};

const me = ref(Me);
const enemy = ref(Enemy);

const animation_timeout = ref(null);
const iteration = ref(0);

const me_moves = ref([]);
const enemy_moves = ref([]);
const me_score = ref(0);
const enemy_score = ref(0);
const player_score_timeout = ref(null);

const machine_animation = ref(null);
const machine_animation_timeout = ref(null);

const block_move = ref(false);

const getLastOf = (array) => {
  return array[array.length - 1];
};
const getSecondLastOf = (array) => array[array.length - 2];

const strategies = {
  WET: [
    () => true,
    (me, enemy) => getLastOf(enemy),
  ],
  IDIOT: [
    () => true,
  ],
  CHEAT: [
    () => false,
  ],
  AVENGER: [
    () => true,
    (me, enemy) => enemy.includes(false) ? false : true,
  ],
  HOLMES: [
    () => true,
    () => false,
    () => true,
    () => true,
    (me, enemy) => ([enemy[0], enemy[1], enemy[2], enemy[3]].includes(false) ? getLastOf(enemy) : false),
  ],
  WET_FOR_TWO: [
    () => true,
    () => true,
    (me, enemy) => getLastOf(enemy) === false && getSecondLastOf(enemy) === false ? false : true,
  ],
  LUG: [
    () => true,
    (me, enemy) => getLastOf(me) === getLastOf(enemy) ? true : false,
  ],
  BRUTAL: [
    () => true,
    (me, enemy) => {
      if (enemy.includes(false)) {
        return false;
      }
      return getLastOf(me) ? false : true;
    },
  ],
  TESTER: [
    () => false,
    (me, enemy) => getLastOf(enemy) === false ? false : true,
    (me, enemy) => getLastOf(me),
  ],
  RANDOM: [
    () => Math.random() > 0.5,
  ],
};

const getStrategyByRoundOrLast = (strategy, index) => strategy[index] || strategy[strategy.length - 1];

const changeSrc = (i) => {
  const me_move = me_moves.value[i];
  const enemy_move = enemy_moves.value[i];
  if(me_move && enemy_move) {
    me.value = MeCC;
    enemy.value = EnemyCC;
  } else if (me_move && !enemy_move) {
    me.value = MeCT;
    enemy.value = EnemyCT;
  } else if (!me_move && enemy_move) {
    me.value = MeTC;
    enemy.value = EnemyTC;
  } else {
    me.value = MeTT;
    enemy.value = EnemyTT;
  }
  animation_timeout.value = setTimeout(defaultSrc, 2000);
}

const changeMachineSrc = (me_move, enemy_move) => {
  if(me_move && enemy_move) {
    machine_animation.value = 'win';
  } else if (me_move && !enemy_move) {
    machine_animation.value = 'one-win';
  } else if (!me_move && enemy_move) {
    machine_animation.value = 'one-win';
  } else {
    machine_animation.value = 'lose';
  }
  resetMachineAnimation();
}

const defaultSrc = () => {
  me.value = Me;
  enemy.value = Enemy;
  clearTimeout(animation_timeout.value);
  block_move.value = false;
}

const updateScore = (i) => {
  player_score_timeout.value = setTimeout(() => {
    if (me_moves.value[i] && me_moves.value[i] === enemy_moves.value[i]) {
      me_score.value += 2;
      enemy_score.value += 2;
    }
    if (me_moves.value[i] && !enemy_moves.value[i]) {
      me_score.value += -1;
      enemy_score.value += 3;
    }
    if (!me_moves.value[i] && enemy_moves.value[i]) {
      me_score.value += 3;
      enemy_score.value += -1;
    }
    clearTimeout(player_score_timeout.value);
  }, 1500)
}

const resetMachineAnimation = () => {
  machine_animation_timeout.value = setTimeout(() => {
    machine_animation.value = null;
    clearTimeout(machine_animation_timeout.value);
  }, 1500)
}

const makeMove = (move, name) => {
  block_move.value = true;
  const i = iteration.value;
  const strategy = strategies[name];
  enemy_moves.value.push(getStrategyByRoundOrLast(strategy, i)(enemy_moves.value, me_moves.value));
  me_moves.value.push(move);
  changeSrc(i);
  changeMachineSrc(me_moves.value[i], enemy_moves.value[i])
  updateScore(i);
  iteration.value += 1;
}

const reset = () => {
  clearInterval(animation_timeout.value);
  clearTimeout(machine_animation_timeout.value);
  clearTimeout(player_score_timeout.value);
  me.value = Me;
  enemy.value = Enemy;
  machine_animation.value = null;
  animation_timeout.value = null;
  player_score_timeout.value = null;
  machine_animation_timeout.value = null;
  iteration.value = 0;
  me_moves.value = [];
  enemy_moves.value = [];
  me_score.value = 0;
  enemy_score.value = 0;
  block_move.value = false;
}

onUnmounted(() => {
  reset();
})

</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &__wrapper {
    position: relative;
    width: 66vw;
    height: 72vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;

    &:hover {
      cursor: pointer;
    }
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  user-select: none;

  &__strategy-description {
    width: 90%;
  }

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

.choices-button {
  display: flex;
  gap: 40px;
}
</style>
