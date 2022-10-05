import { repo_person } from './repo_person.js';
import { test_key } from './test.js';

const getPercentile = (mode, score) => {
  if (mode === 'Rywalizacja') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 14;
      }
      case (3): {
        return 24;
      }
      case (4): {
        return 34;
      }
      case (5): {
        return 48;
      }
      case (6): {
        return 58;
      }
      case (7): {
        return 74;
      }
      case (8): {
        return 84;
      }
      case (9): {
        return 88;
      }
      case (10): {
        return 93;
      }
      case (11): {
        return 95;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Współpraca') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 7;
      }
      case (4): {
        return 9;
      }
      case (5): {
        return 18;
      }
      case (6): {
        return 28;
      }
      case (7): {
        return 48;
      }
      case (8): {
        return 58;
      }
      case (9): {
        return 78;
      }
      case (10): {
        return 88;
      }
      case (11): {
        return 93;
      }
      case (12): {
        return 95;
      }
    }
  }
  else if (mode === 'Kompromis') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 7;
      }
      case (4): {
        return 18;
      }
      case (5): {
        return 28;
      }
      case (6): {
        return 38;
      }
      case (7): {
        return 54;
      }
      case (8): {
        return 74;
      }
      case (9): {
        return 84;
      }
      case (10): {
        return 93;
      }
      case (11): {
        return 95;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Unikanie') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 14;
      }
      case (4): {
        return 24;
      }
      case (5): {
        return 34;
      }
      case (6): {
        return 54;
      }
      case (7): {
        return 68;
      }
      case (8): {
        return 84;
      }
      case (9): {
        return 93;
      }
      case (10): {
        return 95;
      }
      case (11): {
        return 97;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Dostosowanie się') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 24;
      }
      case (4): {
        return 38;
      }
      case (5): {
        return 58;
      }
      case (6): {
        return 78;
      }
      case (7): {
        return 88;
      }
      case (8): {
        return 91;
      }
      case (9): {
        return 93;
      }
      case (10): {
        return 95;
      }
      case (11): {
        return 97;
      }
      case (12): {
        return 99;
      }
    }
  }
}

const getQualities = (qualities) => {
  const features = {
    competition: 'Rywalizacja',
    cooperation: 'Współpraca',
    compromise: 'Kompromis',
    avoidance: 'Unikanie',
    quadrating: 'Dostosowanie się',
  };
  const values = Object.keys(qualities).map((key) => {
    const new_key = features[key] || key;
    return { [new_key]: qualities[key] };
  });
  return Object.assign({}, ...values);
};

const getPercentiles = (qualities) => {
  const values = Object.keys(qualities).map(key => {
    return { [key]: getPercentile(key, qualities[key]) };
  });
  return Object.assign({}, ...values);
};

export const calculateResult = async (id, room) => {
  const { game_json, test_json } = await repo_person.getTestByUserAndRoom(id, room);
  if (!game_json || !test_json) return 'error';
  const test = JSON.parse(test_json);
  return getQualities(calculateTestAnswer(test));
};

const calculateTestAnswer = (test = []) => test.reduce((acc, answer, index) => {
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

export const prepareDataForExcel = async (room) => {
  const result = await repo_person.getGameByRoom(room);

  return result.reduce((acc, element) => {
    const { id: user_id, name } = element;
    const test = JSON.parse(element.test_json || '[]');
    const game = JSON.parse(element.game_json);
    const test_answer = test.length ? getPercentiles(getQualities(calculateTestAnswer(test))) : { none: 0 };

    const games_result = game.players[user_id].reduce((accumulator, round, index) => {
      const num = index + 1;
      accumulator[`strategia #${num}`] = round.strategy;
      accumulator[`punkty zdobyte runda #${num}`] = round.points_sum;
      accumulator[`punkty po rundzie #${num}`] = round.points_global_sum;
      accumulator[`przeciwnik strategia #${num}`] = round.enemy_strategy;
      accumulator[`przeciwnik punkty zdobyte runda #${num}`] = round.enemy_points_sum;
      accumulator[`przeciwnik punkty po rundzie #${num}`] = round.enemy_points_global_sum;
      return accumulator;
    }, {});

    acc.push({
      user_id,
      name,
      styl: test_answer,
      ...games_result,
    });

    return acc;
  }, []);
};
