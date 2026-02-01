import { getDBConnection } from './database';
import { Habit, HealthLog } from '../types';

export const getAllHabits = async (): Promise<Habit[]> => {
  const db = await getDBConnection();
  return await db.getAllAsync<Habit>('SELECT * FROM habits');
};

export const getHealthLogsForDate = async (date: string): Promise<HealthLog[]> => {
  const db = await getDBConnection();
  return await db.getAllAsync<HealthLog>('SELECT * FROM health_logs WHERE date = ?', date);
};

export const logHabit = async (habitId: number, date: string, value: string): Promise<void> => {
  const db = await getDBConnection();
  
  const existingLog = await db.getFirstAsync<{ id: number }>('SELECT id FROM health_logs WHERE habit_id = ? AND date = ?', habitId, date);
  
  if (existingLog) {
    await db.runAsync('UPDATE health_logs SET value = ? WHERE id = ?', value, existingLog.id);
  } else {
    await db.runAsync('INSERT INTO health_logs (habit_id, date, value) VALUES (?, ?, ?)', habitId, date, value);
  }
};

export const addHabit = async (name: string, type: 'Boolean' | 'Value'): Promise<void> => {
  const db = await getDBConnection();
  await db.runAsync('INSERT INTO habits (name, type) VALUES (?, ?)', name, type);
};

export const deleteHabit = async (id: number): Promise<void> => {
  const db = await getDBConnection();
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
  await db.runAsync('DELETE FROM health_logs WHERE habit_id = ?', id);
};
