/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getLastOf = (array) => {
  return array[array.length - 1];
};
const getSecondLastOf = (array) => array[array.length - 2];

const strategy = {
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

export const startGameRound = (round, strategy_1, strategy_2, points_global_sum, enemy_points_global_sum) => {
  const result = {
    me: [],
    enemy: [],
    score_me: [],
    score_enemy: [],
    score_me_sum: 0,
    score_enemy_sum: 0,
    points_global_sum,
    enemy_points_global_sum,
  };

  const strategy_first = strategy[strategy_1];
  const strategy_second = strategy[strategy_2];

  for (let i = 0; i < round; i += 1) {
    const me_result_round = getStrategyByRoundOrLast(strategy_first, i)(result.me, result.enemy);
    const enemy_result_round = getStrategyByRoundOrLast(strategy_second, i)(result.enemy, result.me);

    result.me.push(me_result_round);
    result.enemy.push(enemy_result_round);

    if (me_result_round && me_result_round === enemy_result_round) {
      result.score_me.push(2);
      result.score_enemy.push(2);
    }
    if (!me_result_round && me_result_round === enemy_result_round) {
      result.score_me.push(0);
      result.score_enemy.push(0);
    }
    if (me_result_round && !enemy_result_round) {
      result.score_me.push(-1);
      result.score_enemy.push(3);
    }
    if (!me_result_round && enemy_result_round) {
      result.score_me.push(3);
      result.score_enemy.push(-1);
    }
  }

  result.score_me_sum = result.score_me.reduce((sum, element) => sum + element, 0);
  result.score_enemy_sum = result.score_enemy.reduce((sum, element) => sum + element, 0);
  result.points_global_sum += result.score_me_sum;
  result.enemy_points_global_sum += result.score_enemy_sum;

  return result;
};
