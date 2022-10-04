import { repo_person } from './repo_person.js';
import { test_key } from './test.js';

export const calculateResult = async (id, room) => {
  const { game_json, quiz_json } = await repo_person.getTestByUserAndRoom(id, room);
  if (!game_json || !quiz_json) return 'error';
  const quiz = JSON.parse(quiz_json);
  return calculateTestAnswer(quiz);
};

export const calculateTestAnswer = (quiz = []) => quiz.reduce((acc, answer, index) => {
  const answer_key = test_key[index];
  Object.entries(answer_key).forEach(([key, val]) => {
    if (val === answer) {
      acc[key] += 1;
    }
  });

  return acc;
}, {
  competition: 0,
  cooperation: 0,
  compromise: 0,
  avoidance: 0,
  quadrating: 0,
});

const getCharacteristic = (test_answer) => {
  const max = Math.max(...Object.values(test_answer));
  const max_entries = Object.entries(test_answer).filter(([key, val]) => val === max);
  const names = max_entries.map(([key]) => key);
  return Object.values(names).join(', ');
};

export const prepareDataForExcel = async (room) => {
  const result = await repo_person.getGameByRoom(room);

  return result.reduce((acc, element) => {
    const { id: user_id } = element;
    const quiz = JSON.parse(element.quiz_json || '[]');
    const game = JSON.parse(element.game_json);
    const test_answer = quiz.length ? calculateTestAnswer(quiz) : { none: 0 };

    const games_result = game.players[user_id].reduce((accumulator, round, index) => {
      const num = index + 1;
      accumulator[`sr${num}`] = round.strategy;
      accumulator[`pr${num}`] = round.points_sum;
      accumulator[`spr${num}`] = round.enemy_strategy;
      accumulator[`ppr${num}`] = round.enemy_points_sum;
      return accumulator;
    }, {});

    acc.push({
      user_id,
      characteristic: getCharacteristic(test_answer),
      ...games_result,
    });

    return acc;
  }, []);
};
