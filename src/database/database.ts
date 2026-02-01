import * as SQLite from 'expo-sqlite';
import { Task, Habit } from '../types';

const DATABASE_NAME = 'routinex.db';
const IS_DEV = true;

let db: SQLite.SQLiteDatabase | null = null;

export const getDBConnection = async () => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

export const initDatabase = async () => {
  const database = await getDBConnection();
  
  // Enable foreign keys
  await database.execAsync('PRAGMA foreign_keys = ON;');

  // Create Tables
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      type TEXT,
      start_time TEXT,
      duration INTEGER,
      repeat_type TEXT,
      reminder INTEGER,
      is_active INTEGER
    );

    CREATE TABLE IF NOT EXISTS task_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      date TEXT,
      completed INTEGER,
      completed_at TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks (id)
    );

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT
    );

    CREATE TABLE IF NOT EXISTS health_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER,
      date TEXT,
      value TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits (id)
    );

    CREATE TABLE IF NOT EXISTS daily_summary (
      date TEXT PRIMARY KEY,
      completion_percentage INTEGER
    );
  `);

  if (IS_DEV) {
    await insertDummyData(database);
  }
};

const insertDummyData = async (database: SQLite.SQLiteDatabase) => {
  // Check if data exists to avoid duplicate insertion on reload if not intended,
  // but prompt says "When true -> insert dummy data once."
  // A simple way is to check if tasks table is empty.
  const result = await database.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM tasks');
  if (result && result.count > 0) {
    console.log('Dummy data already exists, skipping...');
    return;
  }

  console.log('Inserting dummy data...');

  // Tasks
  const tasks = [
    { title: 'Morning Jog', category: 'Health', type: 'Exercise', start_time: '07:00', duration: 30, repeat_type: 'Daily', reminder: 1, is_active: 1 },
    { title: 'Read Book', category: 'Learning', type: 'Study', start_time: '20:00', duration: 45, repeat_type: 'Daily', reminder: 1, is_active: 1 },
    { title: 'Drink Water', category: 'Health', type: 'Hydration', start_time: '08:00', duration: 0, repeat_type: 'Daily', reminder: 0, is_active: 1 },
    { title: 'Team Meeting', category: 'Work', type: 'Meeting', start_time: '10:00', duration: 60, repeat_type: 'Weekly', reminder: 1, is_active: 1 },
    { title: 'Meditation', category: 'Health', type: 'Mental', start_time: '06:30', duration: 15, repeat_type: 'Daily', reminder: 1, is_active: 1 },
  ];

  for (const task of tasks) {
    await database.runAsync(
      'INSERT INTO tasks (title, category, type, start_time, duration, repeat_type, reminder, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      task.title, task.category, task.type, task.start_time, task.duration, task.repeat_type, task.reminder, task.is_active
    );
  }

  // Habits
  const habits = [
    { name: 'Exercise', type: 'Boolean' },
    { name: 'Medicine', type: 'Boolean' },
    { name: 'Sleep', type: 'Value' }, // e.g. hours
  ];

  for (const habit of habits) {
    await database.runAsync(
      'INSERT INTO habits (name, type) VALUES (?, ?)',
      habit.name, habit.type
    );
  }

  // Generate logs for last 7 days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Task Logs (Random completion)
    const taskRows = await database.getAllAsync<{ id: number }>('SELECT id FROM tasks');
    let completedCount = 0;
    for (const task of taskRows) {
      const isCompleted = Math.random() > 0.3 ? 1 : 0; // 70% completion rate
      if (isCompleted) completedCount++;
      await database.runAsync(
        'INSERT INTO task_logs (task_id, date, completed, completed_at) VALUES (?, ?, ?, ?)',
        task.id, dateStr, isCompleted, isCompleted ? new Date().toISOString() : null
      );
    }

    // Health Logs
    const habitRows = await database.getAllAsync<{ id: number; name: string }>('SELECT id, name FROM habits');
    for (const habit of habitRows) {
      let value = '';
      if (habit.name === 'Sleep') {
        value = (Math.floor(Math.random() * 4) + 5).toString(); // 5-8 hours
      } else {
        value = Math.random() > 0.2 ? 'true' : 'false';
      }
      await database.runAsync(
        'INSERT INTO health_logs (habit_id, date, value) VALUES (?, ?, ?)',
        habit.id, dateStr, value
      );
    }

    // Daily Summary
    const completionPercentage = Math.round((completedCount / taskRows.length) * 100);
    await database.runAsync(
      'INSERT INTO daily_summary (date, completion_percentage) VALUES (?, ?)',
      dateStr, completionPercentage
    );
  }
};
