import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Habit, HealthLog } from '../types';

interface Props {
  habit: Habit;
  log?: HealthLog;
  onUpdate: (habitId: number, value: string) => void;
  onLongPress?: (habit: Habit) => void;
}

const HabitCard: React.FC<Props> = ({ habit, log, onUpdate, onLongPress }) => {
  const isBoolean = habit.type === 'Boolean';
  const currentValue = log?.value || '';

  const handleToggle = () => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    onUpdate(habit.id, newValue);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onLongPress={() => onLongPress && onLongPress(habit)}
      activeOpacity={0.9}
    >
      <Text style={styles.name}>{habit.name}</Text>
      
      <View style={styles.controlContainer}>
        {isBoolean ? (
          <TouchableOpacity
            style={[styles.toggleButton, currentValue === 'true' && styles.activeToggle]}
            onPress={handleToggle}
          >
            <Text style={[styles.toggleText, currentValue === 'true' && styles.activeToggleText]}>
              {currentValue === 'true' ? 'Done' : 'Mark'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={(text) => onUpdate(habit.id, text)}
              placeholder="Value"
              keyboardType="numeric"
            />
            <Text style={styles.unit}>hrs</Text> 
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  controlContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  activeToggleText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    width: 60,
    textAlign: 'center',
    marginRight: 5,
  },
  unit: {
    color: '#666',
    fontSize: 12,
  },
});

export default HabitCard;
