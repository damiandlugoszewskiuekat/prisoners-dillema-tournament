import { onMounted, ref } from 'vue';
import { useWS } from '../ws';

const setMyId = (id) => localStorage.setItem('game-id', id);
const getMyId = () => localStorage.getItem('game-id');

export const stage = ref(1); // TODO CHANGE BEFORE RELEASE
export const isLoading = ref(true);
export const metadata = ref(null);
export const code = ref(null);
export const players = ref([]);
export const strategy_timer = ref(60);
export const selected_strategy = ref(null);
export const game = ref(null);

const { onConnect, onMessage, sendMessage } = useWS();

export const initWS = async () => {
  await onConnect();
  sendMessage({ path: 'join', payload: { id: getMyId() } });
};

onMessage(({ type, success, ...message }) => {
  switch (type) {
    case 'my': {
      if (success) {
        setMyId(message.metadata.id);
        metadata.value = message.metadata;
        isLoading.value = false;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'create-room': {
      if (success) {
        stage.value = 3;
        code.value = message.code;
        getPlayers(code.value);
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'players-list': {
      if (success) {
        players.value = message.players;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'user-join-to-room': {
      if (success) {
        players.value.push(message.user);
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'join-to-room': {
      if (success) {
        stage.value = 3;
        getPlayers(code.value);
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'preparation': {
      if (success) {
        stage.value = 4;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'round-result': {
      if (success) {
        console.log('round result:', message);
        game.value = message;
        stage.value = 5;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'end-game': {
      if (success) {
        console.log('end: ', message);
        game.value = message;
        stage.value = 6;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'strategy-timer': {
      if (success) {
        strategy_timer.value = message.timer;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'set-random-strategy': {
      if (success) {
        strategy_timer.value = message.timer;
      } else {
        console.log(message.error);
      }
      break;
    }
    case 'round-end': {
      if (success) {
        stage.value = 4;
      } else {
        console.log(message.error);
      }
      break;
    }
  }
});

export const createRoom = () => {
  sendMessage({ path: 'createRoom', payload: { id: getMyId() } });
};

export const joinToRoom = (room) => {
  sendMessage({ path: 'joinToRoom', payload: { id: getMyId(), room } });
  code.value = room;
};

export const getPlayers = (room) => {
  sendMessage({ path: 'getPlayers', payload: { id: getMyId(), room } });
};

export const setNick = (nick) => {
  sendMessage({ path: 'setNick', payload: { nick, id: getMyId() } });
  stage.value = 2;
};

export const startGame = () => {
  sendMessage({ path: 'startGame', payload: { room: code.value, id: getMyId() } });
};

export const setStrategy = (strategy) => {
  sendMessage({ path: 'setStrategy', payload: { room: code.value, strategy, id: getMyId() } });
  selected_strategy.value = strategy;
};
