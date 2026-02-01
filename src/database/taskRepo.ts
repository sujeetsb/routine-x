import { getDBConnection } from './database';
import { Task, TaskLog } from '../types';

export const getAllTasks = async (): Promise<Task[]> => {
  const db = await getDBConnection();
  return await db.getAllAsync<Task>('SELECT * FROM tasks WHERE is_active = 1');
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<number> => {
  const db = await getDBConnection();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, category, type, start_time, duration, repeat_type, reminder, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    task.title, task.category, task.type, task.start_time, task.duration, task.repeat_type, task.reminder, task.is_active
  );
  return result.lastInsertRowId;
};

export const updateTask = async (task: Task): Promise<void> => {
  const db = await getDBConnection();
  await db.runAsync(
    'UPDATE tasks SET title = ?, category = ?, type = ?, start_time = ?, duration = ?, repeat_type = ?, reminder = ?, is_active = ? WHERE id = ?',
    task.title, task.category, task.type, task.start_time, task.duration, task.repeat_type, task.reminder, task.is_active, task.id
  );
};

export const deleteTask = async (id: number): Promise<void> => {
  const db = await getDBConnection();
  await db.runAsync('UPDATE tasks SET is_active = 0 WHERE id = ?', id); // Soft delete
};

export const getTaskLogsForDate = async (date: string): Promise<TaskLog[]> => {
  const db = await getDBConnection();
  return await db.getAllAsync<TaskLog>('SELECT * FROM task_logs WHERE date = ?', date);
};

export const toggleTaskCompletion = async (taskId: number, date: string, completed: number): Promise<void> => {
  const db = await getDBConnection();
  
  // Check if log exists
  const existingLog = await db.getFirstAsync<{ id: number }>('SELECT id FROM task_logs WHERE task_id = ? AND date = ?', taskId, date);
  
  if (existingLog) {
    await db.runAsync(
      'UPDATE task_logs SET completed = ?, completed_at = ? WHERE id = ?',
      completed, completed ? new Date().toISOString() : null, existingLog.id
    );
  } else {
    await db.runAsync(
      'INSERT INTO task_logs (task_id, date, completed, completed_at) VALUES (?, ?, ?, ?)',
      taskId, date, completed, completed ? new Date().toISOString() : null
    );
  }

  await updateDailySummary(date);
};

const updateDailySummary = async (date: string) => {
  const db = await getDBConnection();
  
  // Get all active tasks count
  const tasksResult = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM tasks WHERE is_active = 1');
  const totalTasks = tasksResult?.count || 1; // Avoid division by zero

  // Get completed tasks count for the date
  const logsResult = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM task_logs WHERE date = ? AND completed = 1', date);
  const completedTasks = logsResult?.count || 0;

  const percentage = Math.round((completedTasks / totalTasks) * 100);

  // Upsert daily summary
  await db.runAsync(
    `INSERT INTO daily_summary (date, completion_percentage) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET completion_percentage = ?`,
    date, percentage, percentage
  );
};
