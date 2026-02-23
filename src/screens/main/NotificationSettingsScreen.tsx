import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useNotificationsStore } from '../../stores/notificationsStore';

export default function NotificationSettingsScreen() {
  const { preferences, updatePreferences } = useNotificationsStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Achievements</Text>
        <Switch
          value={preferences.achievements}
          onValueChange={(value) => updatePreferences({ achievements: value })}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Daily Challenges</Text>
        <Switch
          value={preferences.dailyChallenges}
          onValueChange={(value) => updatePreferences({ dailyChallenges: value })}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Friend Activity</Text>
        <Switch
          value={preferences.friendActivity}
          onValueChange={(value) => updatePreferences({ friendActivity: value })}
        />
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
