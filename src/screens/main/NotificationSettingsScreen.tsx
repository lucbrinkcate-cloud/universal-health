import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useStore } from 'easy-peasy';

/**
 * Simple screen that lets the user toggle the three notification types
 * used in the app: achievements, daily challenges, and friend activity.
 */
export default function NotificationSettingsScreen() {
  const {
    enableAchievements,
    enableDaily,
    enableFriends,
    setEnableAchievements,
    setEnableDaily,
    setEnableFriends,
  } = useStore(state => state.notificationsStore);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Achievements</Text>
        <Switch value={enableAchievements} onValueChange={setEnableAchievements} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Daily Challenges</Text>
        <Switch value={enableDaily} onValueChange={setEnableDaily} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Friend Activity</Text>
        <Switch value={enableFriends} onValueChange={setEnableFriends} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
  },
});
