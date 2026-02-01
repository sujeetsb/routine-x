import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '../database/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        
        // Add a small delay for better UX
        setTimeout(() => {
          if (hasLaunched === 'true') {
            navigation.replace('Main');
          } else {
            navigation.replace('Onboarding');
          }
        }, 1500);
      } catch (e) {
        console.error(e);
      }
    };

    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RoutineX</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default SplashScreen;
