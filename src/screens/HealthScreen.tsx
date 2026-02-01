import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Habit, HealthLog } from '../types';
import { getAllHabits, getHealthLogsForDate, logHabit, deleteHabit } from '../database/habitRepo';
import HabitCard from '../components/HabitCard';

const HealthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    const allHabits = await getAllHabits();
    const todayLogs = await getHealthLogsForDate(todayStr);
    setHabits(allHabits);
    setLogs(todayLogs);
  }, [todayStr]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleUpdate = async (habitId: number, value: string) => {
    // Optimistic update
    const newLogs = [...logs];
    const logIndex = newLogs.findIndex(l => l.habit_id === habitId);
    if (logIndex >= 0) {
      newLogs[logIndex] = { ...newLogs[logIndex], value };
    } else {
      newLogs.push({
        id: -1,
        habit_id: habitId,
        date: todayStr,
        value
      });
    }
    setLogs(newLogs);

    await logHabit(habitId, todayStr, value);
    // Reload to ensure consistency (e.g. get real ID)
    const updatedLogs = await getHealthLogsForDate(todayStr);
    setLogs(updatedLogs);
  };

  const handleLongPress = (habit: Habit) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habit.id);
            loadData();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            log={logs.find(l => l.habit_id === item.id)}
            onUpdate={handleUpdate}
            onLongPress={handleLongPress}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 20, paddingBottom: 80 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: { fontSize: 32, color: '#fff', marginTop: -2 },
});

export default HealthScreen;
