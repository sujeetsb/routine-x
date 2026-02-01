import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addHabit } from '../database/habitRepo';

const AddHabitScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState<'Boolean' | 'Value'>('Boolean');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      await addHabit(name, type);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save habit');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Habit</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Read, Drink Water"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tracking Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'Boolean' && styles.activeType]}
            onPress={() => setType('Boolean')}
          >
            <Text style={[styles.typeText, type === 'Boolean' && styles.activeTypeText]}>
              Yes/No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'Value' && styles.activeType]}
            onPress={() => setType('Value')}
          >
            <Text style={[styles.typeText, type === 'Value' && styles.activeTypeText]}>
              Value (e.g. 30 mins)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Create Habit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#444' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeContainer: { flexDirection: 'row', gap: 10 },
  typeButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeType: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  typeText: { fontSize: 16, color: '#666' },
  activeTypeText: { color: '#4CAF50', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddHabitScreen;
