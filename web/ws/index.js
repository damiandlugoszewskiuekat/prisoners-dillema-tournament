const STATE_ENUM = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const useWS = () => {
  const socket = new WebSocket(import.meta.env.VITE_WSS_URL);
  //const socket = new WebSocket('ws://localhost:7171/ws');

  const send = (payload) => {
    socket.send(JSON.stringify(payload));
  };

  const state = socket.readyState;


  return {
    STATE_ENUM,
    state,
    sendMessage: (payload = {}) => send(payload),
    onConnect: () => new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (socket.readyState === 1) {
          clearInterval(timer);
          resolve(socket);
        }
      }, 10);
    }),
    onMessage: (callback) => {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      });
    },
    onClose: (callback) => {
      socket.addEventListener('close', () => {
        callback();
      });
    },
  };
};
