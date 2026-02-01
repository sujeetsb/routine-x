import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../types';
import { getDBConnection } from '../database/database';

type Props = NativeStackScreenProps<BottomTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will clear all data and reset the app. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDBConnection();
              await db.execAsync('DELETE FROM tasks; DELETE FROM task_logs; DELETE FROM habits; DELETE FROM health_logs; DELETE FROM daily_summary;');
              await AsyncStorage.clear();
              // In a real app, we might reload using Updates.reloadAsync()
              Alert.alert('Success', 'Data cleared. Please restart the app.');
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to reset data');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RX</Text>
        </View>
        <Text style={styles.name}>RoutineX User</Text>
        <Text style={styles.email}>user@routinex.app</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Notifications</Text>
          <Text style={styles.rowValue}>On</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Theme</Text>
          <Text style={styles.rowValue}>Light</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Version</Text>
          <Text style={styles.rowValue}>1.0.0 (MVP)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset All Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 16, color: '#666' },
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 10, marginLeft: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: { fontSize: 16, color: '#333' },
  rowValue: { fontSize: 16, color: '#999' },
  resetButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  resetButtonText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
