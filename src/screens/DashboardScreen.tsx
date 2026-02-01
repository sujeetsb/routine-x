import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getDBConnection } from '../database/database';

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState({ totalTasks: 0, totalHabits: 0 });

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        const db = await getDBConnection();
        const tasks = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM task_logs WHERE completed = 1');
        const habits = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM health_logs');
        setStats({
          totalTasks: tasks?.count || 0,
          totalHabits: habits?.count || 0,
        });
      };
      loadStats();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lifetime Stats</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalTasks}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Habit Logs</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Health')}
      >
        <Text style={styles.buttonText}>Health Tracker</Text>
        <Text style={styles.buttonSubtext}>Track habits, medicine, sleep</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.reportButton]}
        onPress={() => navigation.navigate('MonthlyReport')}
      >
        <Text style={styles.buttonText}>Monthly Report</Text>
        <Text style={styles.buttonSubtext}>View detailed analysis</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#444' },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  statLabel: { color: '#666', marginTop: 5 },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportButton: { backgroundColor: '#E8F5E9' },
  buttonText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
  buttonSubtext: { color: '#666' },
});

export default DashboardScreen;
