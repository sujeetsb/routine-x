import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMonthlyReport, MonthlyReportData } from '../database/reportRepo';

const MonthlyReportScreen = () => {
  const [date, setDate] = useState(new Date());
  const [report, setReport] = useState<MonthlyReportData | null>(null);

  const loadReport = useCallback(async () => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const data = await getMonthlyReport(month, year);
    setReport(data);
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      loadReport();
    }, [loadReport])
  );

  const changeMonth = (delta: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + delta);
    setDate(newDate);
  };

  if (!report) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.navText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.navText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Performance</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{report.avgCompletion}%</Text>
            <Text style={styles.statLabel}>Avg Completion</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Habits</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{report.exerciseDays}</Text>
            <Text style={styles.statLabel}>Exercise Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{report.medicineAdherence}%</Text>
            <Text style={styles.statLabel}>Medicine</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Insights</Text>
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Best Habit:</Text>
          <Text style={styles.insightValue}>{report.bestHabit}</Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Needs Focus:</Text>
          <Text style={styles.insightValue}>{report.worstHabit}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  navText: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', paddingHorizontal: 10 },
  monthTitle: { fontSize: 18, fontWeight: 'bold' },
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
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#444' },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  statLabel: { color: '#666', marginTop: 5, fontSize: 12 },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  insightLabel: { color: '#666', fontSize: 16 },
  insightValue: { fontWeight: 'bold', color: '#333', fontSize: 16 },
});

export default MonthlyReportScreen;
