import { query, getOneSql, getAllSql } from './db.js';

export const repo_person = {
  addPlayer: async (id, room, game) => {
    const game_json = JSON.stringify(game);
    const sql = 'INSERT INTO person (id, room, game_json) VALUES (?, ?, ?)';
    return query(sql, [id, room, game_json]);
  },
  setTestResult: async (id, room, quiz) => {
    const quiz_json = JSON.stringify(quiz);
    const sql = 'UPDATE person SET quiz_json = ? WHERE id = ? AND room = ?';
    return query(sql, [quiz_json, id, room]);
  },
  getTestByUserAndRoom: async (id, room) => {
    const sql = `SELECT * FROM person WHERE id = '${id}' AND room = '${room}'`;
    return getOneSql(sql);
  },
  getFinishedGameList: async () => {
    const sql = 'SELECT room FROM person WHERE quiz_json NOT NULL GROUP BY room';
    return getAllSql(sql);
  },
  getGameByRoom: async (room) => {
    const sql = `SELECT * FROM person WHERE room = '${room}'`;
    return getAllSql(sql);
  },
};
