import ExcelJS from 'exceljs';
import path from 'node:path';
import { repo_person } from '../db/repo_person.js';
import { prepareDataForExcel } from '../db/quiz.js';

const createExcel = async () => {
  const games = await repo_person.getFinishedGameList();
  const workbook = new ExcelJS.Workbook();
  for (const el of games) {
    const data = await prepareDataForExcel(el.room);
    const sheet = workbook.addWorksheet(el.room);
    sheet.columns = Object.keys(data[0]).map((e, i) => ({
      header: e, key: e, width: 30,
    }));
    data.forEach((row) => {
      sheet.addRow(row);
    });
  }
  const file_name = 'WYNIKI.xlsx';
  await workbook.xlsx.writeFile(path.join(process.cwd(), file_name));
};

createExcel();
