import sqlite3 from 'sqlite3';
import path from 'node:path';

const sq = sqlite3.verbose();

const db = new sq.Database(path.join(process.cwd(), 'db', 'default.db'));

const dbAction = (sql, method) => new Promise((resolve, reject, default_value) => {
  db.serialize(() => {
    db[method](sql, (err, res) => {
      if (err) {
        console.log({ err });
        reject(err);
      } else {
        resolve(res || default_value);
      }
    });
  });
});

const dbQuery = (sql, params) => new Promise((resolve, reject, default_value) => {
  db.serialize(() => {
    db.run(sql, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res || default_value);
      }
    });
  });
});

export const getOneSql = async (sql) => dbAction(sql, 'get', null);
export const getAllSql = async (sql) => dbAction(sql, 'all', null);
export const query = async (sql, params = []) => dbQuery(sql, params, true);
