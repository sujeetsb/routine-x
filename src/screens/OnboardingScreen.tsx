import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to RoutineX',
    description: 'Your offline-first daily routine & health tracking companion.',
  },
  {
    id: '2',
    title: 'Track Your Habits',
    description: 'Keep track of your exercise, sleep, medicine, and more.',
  },
  {
    id: '3',
    title: 'Stay Consistent',
    description: 'Monitor your progress with daily stats and monthly reports.',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.replace('Main');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  description: { fontSize: 18, textAlign: 'center', color: '#666', paddingHorizontal: 20 },
  footer: { padding: 20, marginBottom: 20 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#ddd', marginHorizontal: 5 },
  activeDot: { backgroundColor: '#4CAF50', width: 20 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipText: { fontSize: 16, color: '#999' },
  nextButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OnboardingScreen;
