import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllTasks, getTaskLogsForDate, toggleTaskCompletion } from '../database/taskRepo';
import { getDBConnection } from '../database/database';
import { Task, TaskLog, RootStackParamList } from '../types';
import TaskItem from '../components/TaskItem';
import ProgressRing from '../components/ProgressRing';

const TodayScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const allTasks = await getAllTasks();
      const todayLogs = await getTaskLogsForDate(todayStr);
      
      // Calculate completion
      const db = await getDBConnection();
      const summary = await db.getFirstAsync<{ completion_percentage: number }>('SELECT completion_percentage FROM daily_summary WHERE date = ?', todayStr);
      
      setTasks(allTasks);
      setLogs(todayLogs);
      setCompletionPercentage(summary?.completion_percentage || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleToggle = async (taskId: number, completed: boolean) => {
    // Optimistic update
    const newLogs = [...logs];
    const logIndex = newLogs.findIndex(l => l.task_id === taskId);
    if (logIndex >= 0) {
      newLogs[logIndex] = { ...newLogs[logIndex], completed: completed ? 1 : 0 };
    } else {
      newLogs.push({
        id: -1, // temporary
        task_id: taskId,
        date: todayStr,
        completed: completed ? 1 : 0,
        completed_at: new Date().toISOString()
      });
    }
    setLogs(newLogs);

    // Recalculate percentage locally for UI responsiveness
    const activeTasks = tasks.length;
    const completedCount = newLogs.filter(l => l.completed === 1).length;
    const newPercentage = activeTasks > 0 ? Math.round((completedCount / activeTasks) * 100) : 0;
    setCompletionPercentage(newPercentage);

    await toggleTaskCompletion(taskId, todayStr, completed ? 1 : 0);
    loadData(); // Reload to sync with DB triggers/updates
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('AddEditTask', { task });
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        <Text style={styles.title}>Today's Routine</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressRing percentage={completionPercentage} />
        <View style={styles.stats}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{logs.filter(l => l.completed === 1).length} / {tasks.length}</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleEditTask(item)}>
            <TaskItem
              task={item}
              log={logs.find(l => l.task_id === item.id)}
              onToggle={handleToggle}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks for today. Add one!</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditTask', {})}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff' },
  dateText: { color: '#666', fontSize: 14, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  stats: { alignItems: 'center' },
  statLabel: { color: '#666', fontSize: 14 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  listContent: { padding: 20, paddingBottom: 80 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 50 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
});

export default TodayScreen;
