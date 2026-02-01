import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task, TaskLog } from '../types';

interface Props {
  task: Task;
  log?: TaskLog;
  onToggle: (taskId: number, completed: boolean) => void;
}

const TaskItem: React.FC<Props> = ({ task, log, onToggle }) => {
  const isCompleted = log?.completed === 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checked]}
        onPress={() => onToggle(task.id, !isCompleted)}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedTitle]}>
          {task.title}
        </Text>
        <Text style={styles.subtitle}>
          {task.start_time} • {task.category}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default TaskItem;
