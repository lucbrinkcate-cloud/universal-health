import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, useThemeStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE } from '../../constants';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut, isLoading } = useAuthStore();
  const { mode, setThemeMode, toggleTheme } = useThemeStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              // Error handled in store
            }
          }
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screen next time you restart the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: async () => {
            await AsyncStorage.setItem('@onboarding_complete', 'false');
            Alert.alert('Done', 'Onboarding will show on next app restart.');
          }
        },
      ]
    );
  };

  const isDarkMode = mode === 'dark';

  const menuItems = [
    { icon: '👤', title: 'Personal Info', subtitle: 'Name, email, phone', onPress: () => {} },
    { icon: '📱', title: 'Devices', subtitle: 'Connect health devices', onPress: () => navigation.navigate('Devices') },
    { icon: '🔔', title: 'Notifications', subtitle: 'Push notifications settings', onPress: () => navigation.navigate('Notifications') },
    { icon: '🌙', title: 'Dark Mode', subtitle: isDarkMode ? 'Currently enabled' : 'Currently disabled', onPress: toggleTheme, hasSwitch: true, switchValue: isDarkMode },
    { icon: '🔒', title: 'Privacy', subtitle: 'Data and security settings', onPress: () => {} },
    { icon: '📊', title: 'Data Export', subtitle: 'Download your health data', onPress: () => {} },
    { icon: '❓', title: 'Help & Support', subtitle: 'FAQ and contact us', onPress: () => {} },
    { icon: '🔄', title: 'Reset Onboarding', subtitle: 'Show welcome screens again', onPress: handleResetOnboarding },
    { icon: 'ℹ️', title: 'About', subtitle: 'App version and info', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.displayName}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.slice(0, 1).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {menuItems.slice(1, 5).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            {item.hasSwitch ? (
              <Switch
                value={item.switchValue}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: COLORS.primaryLight }}
                thumbColor={item.switchValue ? COLORS.primary : '#f4f3f4'}
              />
            ) : (
              <Text style={styles.chevron}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {menuItems.slice(5).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        disabled={isLoading}
      >
        <Text style={styles.signOutText}>
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  displayName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textTertiary,
  },
  signOutButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.error,
  },
  version: {
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.lg,
  },
});

export default ProfileScreen;
