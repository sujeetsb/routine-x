import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMonthlyReport } from '../database/reportRepo';
import { DailySummary } from '../types';

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summaries, setSummaries] = useState<DailySummary[]>([]);

  const loadData = useCallback(async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const data = await getMonthlyReport(month, year);
    setSummaries(data.dailySummaries);
  }, [currentDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const renderDay = ({ item }: { item: number }) => {
    const dayStr = item.toString().padStart(2, '0');
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    
    const summary = summaries.find(s => s.date === dateStr);
    const percentage = summary?.completion_percentage || 0;
    
    let color = '#eee'; // default
    if (summary) {
      if (percentage >= 80) color = '#4CAF50';
      else if (percentage >= 50) color = '#FFC107';
      else color = '#F44336';
    }

    return (
      <View style={styles.dayContainer}>
        <View style={[styles.dayCircle, { backgroundColor: color }]}>
          <Text style={styles.dayText}>{item}</Text>
        </View>
        {summary && <Text style={styles.percentageText}>{percentage}%</Text>}
      </View>
    );
  };

  const days = Array.from({ length: getDaysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear()) }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <FlatList
        data={days}
        renderItem={renderDay}
        keyExtractor={item => item.toString()}
        numColumns={7}
        contentContainerStyle={styles.calendarGrid}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text>80%+</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
          <Text>50-79%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
          <Text>&lt;50%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 20, alignItems: 'center' },
  monthTitle: { fontSize: 20, fontWeight: 'bold' },
  calendarGrid: { alignItems: 'center' },
  dayContainer: {
    width: 45,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayText: { color: '#333', fontWeight: '600' },
  percentageText: { fontSize: 10, color: '#666' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
});

export default CalendarScreen;
