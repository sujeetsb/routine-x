import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { RootStackParamList, Task } from '../types';
import { addTask, updateTask, deleteTask } from '../database/taskRepo';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditTask'>;

const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task } = route.params || {};
  const isEditMode = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || 'Work');
  const [type, setType] = useState(task?.type || 'General');
  const [startTime, setStartTime] = useState(task?.start_time || '09:00');
  const [duration, setDuration] = useState(task?.duration?.toString() || '30');
  const [repeatType, setRepeatType] = useState(task?.repeat_type || 'Daily');
  const [reminder, setReminder] = useState(task?.reminder === 1);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData: Omit<Task, 'id'> | Task = {
      id: task?.id || 0, // Will be ignored for add
      title,
      category,
      type,
      start_time: startTime,
      duration: parseInt(duration) || 0,
      repeat_type: repeatType,
      reminder: reminder ? 1 : 0,
      is_active: 1,
    };

    try {
      if (isEditMode && task) {
        await updateTask(taskData as Task);
      } else {
        await addTask(taskData);
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Morning Jog"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Work, Health..."
          />
        </View>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Meeting, Exercise..."
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="HH:MM"
          />
        </View>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Duration (min)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="30"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Repeat</Text>
        <View style={styles.chipContainer}>
          {['Daily', 'Weekly', 'Monthly', 'Once'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, repeatType === r && styles.activeChip]}
              onPress={() => setRepeatType(r)}
            >
              <Text style={[styles.chipText, repeatType === r && styles.activeChipText]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Reminder</Text>
        <Switch value={reminder} onValueChange={setReminder} trackColor={{ false: '#767577', true: '#4CAF50' }} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{isEditMode ? 'Update Task' : 'Create Task'}</Text>
      </TouchableOpacity>

      {isEditMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: { backgroundColor: '#4CAF50' },
  chipText: { color: '#333' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' },
});

export default AddEditTaskScreen;
