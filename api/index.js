import { test } from '../db/test.js';
import { repo_person } from '../db/repo_person.js';
import { calculateResult } from '../db/quiz.js';

const sendError = (res, message) => {
  res.send({ success: false, message });
};

const success = (res, result) => {
  res.send({ success: true, result });
};

export const api = {
  getTest: async (req, res) => {
    success(res, test);
  },
  finishTest: async (req, res) => {
    try {
      const { user_id, room_id, answer } = req.body;
      await repo_person.setTestResult(user_id, room_id, answer);
      const result = await calculateResult(user_id, room_id);
      success(res, result);
    } catch (e) {
      sendError(res, e);
    }
  },
};
