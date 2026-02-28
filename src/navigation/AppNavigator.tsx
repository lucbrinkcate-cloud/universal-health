import React, { useEffect, useState, useMemo } from 'react';
import { useColorScheme, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens/auth';
import { DashboardScreen, DevicesScreen, GamificationScreen, BiometricsScreen, FriendsScreen, LeaderboardScreen, AnalyticsScreen, NotificationsScreen } from '../screens/main';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { useHealthStore, useThemeStore } from '../stores';
import { SPACING, FONT_SIZE } from '../constants';
import { RootStackParamList, MainTabParamList, User, HomeStackParamList, ActivityStackParamList, SocialStackParamList, ProfileStackParamList } from '../types';

const mockUser: User = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  createdAt: new Date().toISOString()
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabStack = createBottomTabNavigator<MainTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const ActivityStackNav = createNativeStackNavigator<ActivityStackParamList>();
const SocialStackNav = createNativeStackNavigator<SocialStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();

const ONBOARDING_COMPLETE_KEY = '@onboarding_complete';

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const icons: Record<string, string> = {
    Dashboard: '🏠',
    Gamification: '🏆',
    Friends: '👥',
    Profile: '⚙️',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{icons[name] || '📄'}</Text>
  );
};

const HomeStack = () => {
  const { colors } = useThemeStore();
  
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <HomeStackNav.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <HomeStackNav.Screen 
        name="Biometrics" 
        component={BiometricsScreen}
        options={{ title: 'Biometrics' }}
      />
    </HomeStackNav.Navigator>
  );
};

const ActivityStack = () => {
  const { colors } = useThemeStore();
  
  return (
    <ActivityStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <ActivityStackNav.Screen 
        name="Gamification" 
        component={GamificationScreen}
        options={{ title: 'Rewards' }}
      />
      <ActivityStackNav.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <ActivityStackNav.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: 'Leaderboard' }}
      />
    </ActivityStackNav.Navigator>
  );
};

const SocialStack = () => {
  const { colors } = useThemeStore();
  
  return (
    <SocialStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <SocialStackNav.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
    </SocialStackNav.Navigator>
  );
};

const ProfileStack = () => {
  const { colors } = useThemeStore();
  
  return (
    <ProfileStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <ProfileStackNav.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStackNav.Screen 
        name="Devices" 
        component={DevicesScreen}
        options={{ title: 'Devices' }}
      />
      <ProfileStackNav.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Alerts' }}
      />
    </ProfileStackNav.Navigator>
  );
};

const MainTabs: React.FC = () => {
  const { colors } = useThemeStore();
  
  const tabBarStyle = {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: SPACING.xs,
    height: 60,
  };
  
  const tabBarActiveTintColor = colors.primary;
  const tabBarInactiveTintColor = colors.textSecondary;

  return (
    <MainTabStack.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle,
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontWeight: '500', marginBottom: SPACING.xs },
        headerShown: false,
      })}
    >
      <MainTabStack.Screen 
        name="Dashboard" 
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <MainTabStack.Screen 
        name="Gamification" 
        component={ActivityStack}
        options={{ title: 'Activity' }}
      />
      <MainTabStack.Screen 
        name="Friends" 
        component={SocialStack}
        options={{ title: 'Social' }}
      />
      <MainTabStack.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </MainTabStack.Navigator>
  );
};

const AuthStack: React.FC = () => {
  const { colors } = useThemeStore();
  
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Create Account', headerStyle: { backgroundColor: colors.surface }, headerTitleStyle: { color: colors.text } }}
      />
      <RootStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: true, title: 'Reset Password', headerStyle: { backgroundColor: colors.surface }, headerTitleStyle: { color: colors.text } }}
      />
    </RootStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { fetchHealthData, fetchConnectedDevices } = useHealthStore();
  const { colors, mode } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setShowOnboarding(value === 'true');
      } catch (error) {
        setShowOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const navigationTheme = useMemo(() => {
    if (isDark) {
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
        },
      };
    }
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [isDark, colors]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchConnectedDevices();
        await fetchHealthData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (showOnboarding === false) {
      initializeApp();
    }
  }, [showOnboarding, fetchHealthData, fetchConnectedDevices]);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
    setShowOnboarding(false);
    setIsInitialized(true);
    fetchConnectedDevices();
    fetchHealthData();
  };

  if (showOnboarding === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen onComplete={handleOnboardingComplete} />
    );
  }

  if (!isInitialized) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <MainTabs />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
});

export default AppNavigator;
