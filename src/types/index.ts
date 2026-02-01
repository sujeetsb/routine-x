export interface Task {
  id: number;
  title: string;
  category: string;
  type: string;
  start_time: string;
  duration: number;
  repeat_type: string;
  reminder: number; // 0 or 1
  is_active: number; // 0 or 1
}

export interface TaskLog {
  id: number;
  task_id: number;
  date: string; // YYYY-MM-DD
  completed: number; // 0 or 1
  completed_at: string; // ISO timestamp
}

export interface Habit {
  id: number;
  name: string;
  type: string;
}

export interface HealthLog {
  id: number;
  habit_id: number;
  date: string; // YYYY-MM-DD
  value: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  completion_percentage: number;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined; // Bottom Tabs
  AddEditTask: { task?: Task };
  MonthlyReport: undefined;
  Health: undefined;
  AddHabit: undefined;
};

export type BottomTabParamList = {
  Today: undefined;
  Calendar: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Health: undefined; // Adding Health to bottom tab or maybe it's part of Dashboard? Prompt says "Health Tracker Screen" is required, UI Requirements say "Bottom tab navigation: Today, Calendar, Dashboard, Profile". It doesn't explicitly list Health in Bottom Tab list in UI section, but in "REQUIRED SCREENS" it is listed. I'll probably put it in Dashboard or add it as a 5th tab or inside a stack. Let's add it as a separate tab for now or accessible from Today/Dashboard. The prompt says "Track health habits" is a key feature. Let's add it as a tab for visibility.
};
