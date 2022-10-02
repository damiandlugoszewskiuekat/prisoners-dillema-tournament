import { v4 as uuid } from "uuid";
import Crypto from 'crypto';
import { prepareTeams } from "./team.js";
import { getRandomInt, startGameRound } from "./game.js";
import {repo_person} from "../db/repo_person.js";

const config = {
  room_code_length: 6,
};

const timers = {};

const strategies = ['WET', 'IDIOT', 'CHEAT', 'AVENGER', 'HOLMES', 'WET_FOR_TWO', 'LUG', 'BRUTAL', 'TESTER', 'RANDOM']

const success = (type, message = {}) => JSON.stringify({ type,  success: true, ...message })
const failure = (type, message = {}) => JSON.stringify({ type,  success: false, ...message })

function joinToWS({ clients, id, ws }) {
  if (!id) {
    const id = uuid();
    const metadata = { data: { id, room: null, nick: null }, ws };
    clients.set(id, metadata);
    ws.send(success('my', { metadata: metadata.data }))
  } else {
    const user = clients.get(id);
    if (user) {
      clients.set(id, {data: user.data, ws} );
      ws.send(success('my', { metadata: user.data }))
    } else {
      const id = uuid();
      const metadata = { data: { id, room: null, nick: null }, ws };
      clients.set(id, metadata);
      ws.send(success('my', { metadata: metadata.data }))
    }
  }
}

function setNick({ clients, nick, id }) {
  const user = clients.get(id);
  user.data.nick = nick;
  clients.set(id, user);
}


function createRooms({ ws, clients, rooms, id }) {
  const user = clients.get(id);
  const code = Crypto.randomBytes(config.room_code_length).toString('hex').substr(0, config.room_code_length);
  rooms.set(code, { users: [id], open: true, users_data: [user.data] })
  user.data.my_room = code;
  clients.set(id, user);
  ws.send(success('my', { metadata: user.data }))
  ws.send(success('create-room', { code }))
}


function joinRoom({ ws, clients, rooms, id, room }) {
  const rooms_config = rooms.get(room)

  if (!rooms_config || !rooms_config.open) {
    ws.send(failure('join-to-room'))
    return;
  }

  const me = clients.get(id);
  rooms_config.users.push(id)
  rooms_config.users_data.push(me.data)
  rooms_config.users.forEach(ids => {
    const user = clients.get(ids)
    if (ids !== id) {
      user.ws.send(success('user-join-to-room', { user: me.data }))
    }
  })

  ws.send(success('join-to-room'))
}

function getPlayers({ ws, clients, room, rooms }) {
  const rooms_config = rooms.get(room)
  const players = rooms_config.users.map(ids => clients.get(ids).data);
  return ws.send(success('players-list', { players }))
}

const strategyTimer = ({ clients, game, room, rooms }) => {
  let timer = 60;

  timers[room] = setInterval(() => {
    game.users.forEach(ids => {
      const user = clients.get(ids)
      user.ws.send(success('strategy-timer', { timer }));
    })
    timer -= 1;
    if (timer < 0) {
      clearInterval(timers[room]);
      game.users.forEach(id => {
        randomStrategyIfNotSet({id, room, clients, rooms })
      })
    }
  }, 1000)

  rooms.set(room, game);
}

const roundTimer = ({ clients, game, room, rooms }) => {
  const round = game.round_of_game
  let timer = (round * 2) + 10;
  const interval = setInterval(() => {
    timer -= 1;

    if (timer < 0) {
      clearInterval(interval);
      game.users.forEach(ids => {
        const user = clients.get(ids)
        user.ws.send(success('round-end', { timer }));
      })
      if (game.finish) {
        game.users.forEach(ids => {
          const user = clients.get(ids)
          user.ws.send(success('end-game', game))
          repo_person.addPlayer(ids, room, game)
        })
      } else {
        strategyTimer({ clients, game, room, rooms});
      }
    }
  }, 1000)
}

const startGame = ({ ws, clients, room, rooms, id }) => {
  const game = rooms.get(room);
  game.open = false;
  const { teams, game_count } = prepareTeams(game.users);
  game.teams = teams;
  game.game_count = game_count;
  game.current_game = 1;

  const players = game.users.reduce((acc, current) => {
    acc[current] = [{ strategy: null, points: [], result: null, enemy_strategy: null, enemy_points: [], points_global_sum: 0, enemy_points_global_sum: 0 }]
    return acc;
  }, {})

  game.players = players || {};
  rooms.set(room, game);
  game.users.forEach(ids => {
    const user = clients.get(ids)
    user.ws.send(success('preparation', { round: 1 }));
  })

  strategyTimer({ clients, game, room, rooms })
}

const randomStrategyIfNotSet = ({ id, room, clients, rooms }) => {
  const game = rooms.get(room)
  const user = clients.get(id);
  const game_index = game.current_game - 1;
  if (!game.players[id][game_index]?.strategy){
    const strategy_index = Math.floor(Math.random() * 6);
    user.ws.send(success('set-random-strategy', { strategy: strategies[strategy_index] }));
    setStrategy({id, room, clients, rooms, strategy: strategies[strategy_index]})
  }
}

const setStrategy = ({ id, room, clients, rooms, strategy }) => {
  //TODO if strategy exist
  const game = rooms.get(room)
  const game_index = game.current_game - 1;
  if (!game.players[id][game_index]){
    game.players[id].push({})
  }
  game.players[id][game_index].strategy = strategy;
  rooms.set(room, game);
  if (Object.values(game.players).every(player => !!player[game_index]?.strategy)) {
    startRound({ room, rooms, clients, game_index})
  }
}

const startRound = ({room, rooms, clients, game_index }) => {
  const game = rooms.get(room);
  const { game_count } = prepareTeams(game.users);
  game.game_count = game_count;
  game.round_of_game = getRandomInt(6, 10);
  clearInterval(timers[room]);
  Object.entries(game.players).forEach(([id, rounds]) => {
    const current_round = rounds[game_index];
    const team_group = game.teams.find(t => t[game_index].includes(id))
    const team = team_group[game_index];
    const enemy_id = team.find(ids => ids !== id);
    const enemy_player_round = game.players[enemy_id][game_index];
    const round = game.round_of_game;
    const points_global_sum = game.players[id][game_index - 1]?.points_global_sum || 0;
    const enemy_points_global_sum = game.players[enemy_id][game_index - 1]?.points_global_sum || 0;

    if (!current_round.result_of_game) {
      const result_of_game = startGameRound(round, current_round.strategy, enemy_player_round.strategy, points_global_sum, enemy_points_global_sum);
      game.players[id][game_index] = {
        ...current_round,
        game_count: game.game_count,
        game_index: game_index + 1,
        enemy_strategy: enemy_player_round.strategy,
        points: result_of_game.score_me,
        enemy_points: result_of_game.score_enemy,
        move: result_of_game.me,
        move_enemy: result_of_game.enemy,
        points_sum: result_of_game.score_me_sum,
        enemy_points_sum: result_of_game.score_enemy_sum,
        points_global_sum: result_of_game.points_global_sum,
        enemy_points_global_sum: result_of_game.enemy_points_global_sum,
        result_of_game: result_of_game.score_me_sum === result_of_game.score_enemy_sum ? 'DRAW' :  result_of_game.score_me_sum > result_of_game.score_enemy_sum ? 'WIN' : 'LOSE',
      }

      game.players[enemy_id][game_index] = {
        ...enemy_player_round,
        game_count: game.game_count,
        game_index: game_index + 1,
        enemy_strategy: current_round.strategy,
        points: result_of_game.score_enemy,
        enemy_points: result_of_game.score_me,
        move: result_of_game.enemy,
        move_enemy: result_of_game.me,
        points_sum: result_of_game.score_enemy_sum,
        enemy_points_sum: result_of_game.score_me_sum,
        points_global_sum: result_of_game.enemy_points_global_sum,
        enemy_points_global_sum: result_of_game.points_global_sum,
        result_of_game: result_of_game.score_enemy_sum === result_of_game.score_me_sum ? 'DRAW' :  result_of_game.score_enemy_sum > result_of_game.score_me_sum ? 'WIN' : 'LOSE',
      }
      const me = clients.get(id);
      const enemy = clients.get(enemy_id);
      game.players[id][game_index].points_global_sum = result_of_game.points_global_sum;
      me.ws.send(success('round-result', game.players[id][game_index]));
      enemy.ws.send(success('round-result', game.players[enemy_id][game_index]));
    }
  })

  if (game.game_count === game.current_game) {
    game.finish = true;
  } else {
    game.current_game += 1;
  }
  rooms.set(room, game);
  roundTimer({ clients, game, room, rooms })
}

export function endpointParser({ path, payload, ws, clients, metadata, rooms }) {
  const { room, nick, id, strategy } = payload || {};
  const wsPayload = { ws, room, clients, metadata, id, rooms, nick, strategy };

  switch (path) {
    case 'join':
      return joinToWS(wsPayload);
    case 'createRoom':
      return createRooms(wsPayload);
    case 'joinToRoom':
      return joinRoom(wsPayload);
    case 'setNick':
      return setNick(wsPayload);
    case 'getPlayers':
      return getPlayers(wsPayload);
    case 'startGame':
      return startGame(wsPayload);
    case 'setStrategy':
      return setStrategy(wsPayload);
    default: {
      throw new Error('Invalid path!');
    }
  }
}
