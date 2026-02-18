import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens/auth';
import { DashboardScreen, DigitalTwinScreen, DevicesScreen, GamificationScreen, BiometricsScreen, FriendsScreen, LeaderboardScreen, AnalyticsScreen } from '../screens/main';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { useHealthStore } from '../stores';
import { COLORS, SPACING, FONT_SIZE } from '../constants';
import { RootStackParamList, MainTabParamList, User } from '../types';

// Mock authentication state for development
const mockUser: User = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  createdAt: new Date().toISOString()
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const icons: Record<string, string> = {
    Dashboard: '🏠',
    DigitalTwin: '👤',
    Devices: '📱',
    Profile: '⚙️',
    Gamification: '🏆',
    Biometrics: '📊',
    Friends: '👥',
    Leaderboard: '🏅',
    Analytics: '📈',
  };
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {icons[name]}
      </Text>
    </View>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.text,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="DigitalTwin" 
        component={DigitalTwinScreen}
        options={{ title: 'My Twin' }}
      />
      <Tab.Screen 
        name="Biometrics" 
        component={BiometricsScreen}
        options={{ title: 'Biometrics' }}
      />
      <Tab.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{ title: 'Devices' }}
      />
      <Tab.Screen 
        name="Gamification" 
        component={GamificationScreen}
        options={{ title: 'Rewards' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: 'Leaderboard' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
    </Tab.Navigator>
  );
};

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Create Account', headerStyle: styles.header, headerTitleStyle: styles.headerTitle }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: true, title: 'Reset Password', headerStyle: styles.header, headerTitleStyle: styles.headerTitle }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { fetchHealthData, fetchConnectedDevices } = useHealthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize native health service
        await fetchConnectedDevices();
        // Fetch initial health data
        await fetchHealthData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [fetchHealthData, fetchConnectedDevices]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
    height: 60,
  },
  tabBarLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
  header: {
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
});

export default AppNavigator;