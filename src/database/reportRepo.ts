import { getDBConnection } from './database';
import { DailySummary } from '../types';

export interface MonthlyReportData {
  avgCompletion: number;
  exerciseDays: number;
  medicineAdherence: number;
  bestHabit: string;
  worstHabit: string;
  dailySummaries: DailySummary[];
}

export const getMonthlyReport = async (month: number, year: number): Promise<MonthlyReportData> => {
  const db = await getDBConnection();
  const monthStr = month.toString().padStart(2, '0');
  const datePattern = `${year}-${monthStr}%`;

  // 1. Average Task Completion
  const summaryResult = await db.getFirstAsync<{ avg_comp: number }>(
    'SELECT AVG(completion_percentage) as avg_comp FROM daily_summary WHERE date LIKE ?',
    datePattern
  );
  const avgCompletion = Math.round(summaryResult?.avg_comp || 0);

  // 2. Exercise Days (assuming Habit named 'Exercise' and value 'true')
  const exerciseResult = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) as count 
     FROM health_logs hl
     JOIN habits h ON hl.habit_id = h.id
     WHERE h.name = 'Exercise' AND hl.value = 'true' AND hl.date LIKE ?`,
    datePattern
  );
  const exerciseDays = exerciseResult?.count || 0;

  // 3. Medicine Adherence %
  // Total days in month so far (or just total logs? Adherence usually means days taken / days required).
  // Assuming daily medicine. Let's count days in month up to today.
  const now = new Date();
  let daysInMonth = new Date(year, month, 0).getDate();
  if (year === now.getFullYear() && month === now.getMonth() + 1) {
    daysInMonth = now.getDate();
  }
  
  const medicineResult = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) as count 
     FROM health_logs hl
     JOIN habits h ON hl.habit_id = h.id
     WHERE h.name = 'Medicine' AND hl.value = 'true' AND hl.date LIKE ?`,
    datePattern
  );
  const medicineDays = medicineResult?.count || 0;
  const medicineAdherence = Math.round((medicineDays / daysInMonth) * 100);

  // 4. Best & Worst Habit (by consistency of 'true' or presence for value types)
  // We'll simplisticly count 'true' for boolean habits.
  const habitStats = await db.getAllAsync<{ name: string; count: number }>(
    `SELECT h.name, count(*) as count
     FROM health_logs hl
     JOIN habits h ON hl.habit_id = h.id
     WHERE hl.date LIKE ? AND (hl.value = 'true' OR hl.value != 'false') -- Treat non-false as positive
     GROUP BY h.name
     ORDER BY count DESC`,
    datePattern
  );

  const bestHabit = habitStats.length > 0 ? habitStats[0].name : 'N/A';
  const worstHabit = habitStats.length > 0 ? habitStats[habitStats.length - 1].name : 'N/A';

  // 5. Daily Summaries for Calendar/Graph
  const dailySummaries = await db.getAllAsync<DailySummary>(
    'SELECT * FROM daily_summary WHERE date LIKE ? ORDER BY date ASC',
    datePattern
  );

  return {
    avgCompletion,
    exerciseDays,
    medicineAdherence,
    bestHabit,
    worstHabit,
    dailySummaries
  };
};
