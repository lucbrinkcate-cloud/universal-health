import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useHealthStore } from '../../stores';
import { Loading, ErrorView, Button } from '../../components';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { TerraProvider } from '../../types';

const AVAILABLE_PROVIDERS: TerraProvider[] = [
  {
    id: 'apple',
    name: 'Apple Health',
    logo: '🍎',
    description: 'Connect Apple Health to sync your health data',
    status: 'disconnected',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    logo: '⌚',
    description: 'Connect Garmin devices for activity tracking',
    status: 'disconnected',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    logo: '📟',
    description: 'Connect Fitbit for comprehensive health data',
    status: 'disconnected',
  },
  {
    id: 'ouraring',
    name: 'Oura Ring',
    logo: '💍',
    description: 'Connect Oura for sleep and recovery insights',
    status: 'disconnected',
  },
  {
    id: 'whoop',
    name: 'Whoop',
    logo: '💪',
    description: 'Connect Whoop for strain and recovery data',
    status: 'disconnected',
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    logo: '📱',
    description: 'Connect Google Fit for Android health data',
    status: 'disconnected',
  },
];

export const DevicesScreen: React.FC = () => {
  const { connectedDevices, isLoading, error, fetchConnectedDevices, connectDevice, clearError } =
    useHealthStore();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectedDevices();
  }, []);

  const handleConnect = async (provider: TerraProvider) => {
    setConnectingId(provider.id);
    try {
      const url = await connectDevice(provider.id);
      if (url) {
        Linking.openURL(url);
      }
    } catch (err) {
      console.error('Failed to connect:', err);
    } finally {
      setConnectingId(null);
    }
  };

  const isConnected = (providerId: string) => {
    return connectedDevices.some(d => d.id === providerId);
  };

  if (isLoading && !connectedDevices.length) {
    return <Loading fullScreen message="Loading devices..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Connected Devices</Text>
        <Text style={styles.subtitle}>
          Connect your wearable devices to sync health data
        </Text>
      </View>

      {error && (
        <ErrorView message={error} onRetry={clearError} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Devices</Text>
        {AVAILABLE_PROVIDERS.map((provider) => (
          <View key={provider.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceLogo}>{provider.logo}</Text>
              <View style={styles.deviceDetails}>
                <Text style={styles.deviceName}>{provider.name}</Text>
                <Text style={styles.deviceDescription}>{provider.description}</Text>
              </View>
            </View>
            {isConnected(provider.id) ? (
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            ) : (
              <Button
                title={connectingId === provider.id ? 'Connecting...' : 'Connect'}
                onPress={() => handleConnect(provider)}
                size="small"
                variant={connectingId === provider.id ? 'outline' : 'primary'}
                disabled={connectingId !== null}
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terra API</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔗</Text>
          <Text style={styles.infoText}>
            We use Terra API to securely connect and sync data from your
            wearable devices. Your data is encrypted and never shared with
            third parties.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceLogo: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  deviceDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  connectedBadge: {
    backgroundColor: `${COLORS.success}20`,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  connectedText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default DevicesScreen;
