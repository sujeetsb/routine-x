import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TodayScreen from '../screens/TodayScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import CalendarScreen from '../screens/CalendarScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MonthlyReportScreen from '../screens/MonthlyReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HealthScreen from '../screens/HealthScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Today') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ presentation: 'modal', headerShown: true, title: 'Task' }} />
        <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} options={{ headerShown: true, title: 'Monthly Report' }} />
        <Stack.Screen name="Health" component={HealthScreen} options={{ title: 'Health Tracker', headerShown: true }} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ presentation: 'modal', headerShown: true, title: 'Add Habit' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
