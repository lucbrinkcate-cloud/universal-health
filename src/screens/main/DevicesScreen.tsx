import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { useHealthStore } from '../../stores';
import { Loading, ErrorView, Button } from '../../components';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { DeviceProvider } from '../../types';

interface DeviceOption {
  id: string;
  name: string;
  logo: string;
  description: string;
  platform: 'ios' | 'android' | 'both';
}

const DEVICE_OPTIONS: DeviceOption[] = [
  {
    id: 'apple_health',
    name: 'Apple Health',
    logo: '❤️',
    description: 'Sync health data from your iPhone and Apple Watch',
    platform: 'ios',
  },
  {
    id: 'google_health_connect',
    name: 'Health Connect',
    logo: '🟢',
    description: 'Sync health data from Android devices and Wear OS watches',
    platform: 'android',
  },
  {
    id: 'samsung_health',
    name: 'Samsung Health',
    logo: '📱',
    description: 'Connect Samsung Galaxy watches and phones',
    platform: 'android',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    logo: '⌚',
    description: 'Sync Garmin watches and fitness devices',
    platform: 'both',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    logo: '📟',
    description: 'Connect Fitbit devices for activity and sleep tracking',
    platform: 'both',
  },
  {
    id: 'ouraring',
    name: 'Oura Ring',
    logo: '💍',
    description: 'Sync Oura ring for sleep and recovery insights',
    platform: 'both',
  },
  {
    id: 'whoop',
    name: 'Whoop',
    logo: '💪',
    description: 'Connect Whoop for strain and recovery data',
    platform: 'both',
  },
];

export const DevicesScreen: React.FC = () => {
  const {
    connectedDevices,
    isLoading,
    error,
    nativeHealthAvailable,
    fetchConnectedDevices,
    connectDevice,
    disconnectDevice,
    clearError,
  } = useHealthStore();

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentPlatform = Platform.OS;

  useEffect(() => {
    fetchConnectedDevices();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchConnectedDevices();
    setRefreshing(false);
  }, [fetchConnectedDevices]);

  const handleConnect = async (device: DeviceOption) => {
    setConnectingId(device.id);
    try {
      if (device.id === 'apple_health' || device.id === 'google_health_connect') {
        await connectDevice('native');
      } else {
        await connectDevice(device.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect device';
      Alert.alert('Connection Failed', message);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = (device: DeviceProvider) => {
    Alert.alert(
      'Disconnect Device',
      `Are you sure you want to disconnect ${device.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectDevice(device.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to disconnect device');
            }
          },
        },
      ]
    );
  };

  const isDeviceConnected = (deviceId: string) => {
    return connectedDevices.some(d => d.id === deviceId);
  };

  const isNativeHealthConnected = () => {
    return nativeHealthAvailable || connectedDevices.some(
      d => d.id === 'apple_health' || d.id === 'google_health_connect'
    );
  };

  const getFilteredDevices = () => {
    return DEVICE_OPTIONS.filter(device => 
      device.platform === 'both' || 
      device.platform === currentPlatform ||
      (currentPlatform === 'ios' && device.platform === 'ios') ||
      (currentPlatform === 'android' && device.platform === 'android')
    );
  };

  const getPlatformName = () => {
    if (currentPlatform === 'ios') return 'Apple Health';
    if (currentPlatform === 'android') return 'Health Connect';
    return 'Health Platform';
  };

  if (isLoading && !connectedDevices.length) {
    return <Loading fullScreen message="Loading devices..." />;
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Connected Devices</Text>
        <Text style={styles.subtitle}>
          Connect your health platforms and wearable devices
        </Text>
      </View>

      {error && (
        <ErrorView message={error} onRetry={clearError} />
      )}

      <View style={styles.platformSection}>
        <Text style={styles.sectionTitle}>{getPlatformName()}</Text>
        <View style={styles.platformCard}>
          <View style={styles.platformInfo}>
            <Text style={styles.platformLogo}>
              {currentPlatform === 'ios' ? '❤️' : '🟢'}
            </Text>
            <View style={styles.platformDetails}>
              <Text style={styles.platformName}>{getPlatformName()}</Text>
              <Text style={styles.platformDescription}>
                {currentPlatform === 'ios'
                  ? 'Access health data from iPhone and Apple Watch'
                  : 'Access health data from Android and connected devices'}
              </Text>
            </View>
          </View>
          {isNativeHealthConnected() ? (
            <View style={styles.connectedContainer}>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedText}>Connected</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const device = connectedDevices.find(
                    d => d.id === 'native' || d.id === 'apple_health' || d.id === 'google_health_connect'
                  );
                  if (device) handleDisconnect(device);
                }}
              >
                <Text style={styles.disconnectText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title={connectingId === 'native' ? 'Connecting...' : 'Connect'}
              onPress={() => handleConnect(
                currentPlatform === 'ios'
                  ? DEVICE_OPTIONS[0]
                  : DEVICE_OPTIONS[1]
              )}
              size="small"
              variant={connectingId === 'native' ? 'outline' : 'primary'}
              disabled={connectingId !== null}
            />
          )}
        </View>
        <Text style={styles.helpText}>
          {currentPlatform === 'ios'
            ? 'Grant permission in Settings → Health → Universal Health'
            : 'Grant permission in Health Connect app settings'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wearable Devices</Text>
        <Text style={styles.sectionSubtitle}>
          Connect your fitness wearables to enrich your Digital Twin
        </Text>
        
        {getFilteredDevices()
          .filter(d => d.id !== 'apple_health' && d.id !== 'google_health_connect')
          .map((device) => (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceLogo}>{device.logo}</Text>
              <View style={styles.deviceDetails}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceDescription}>{device.description}</Text>
              </View>
            </View>
            {isDeviceConnected(device.id) ? (
              <TouchableOpacity
                onPress={() => {
                  const connected = connectedDevices.find(d => d.id === device.id);
                  if (connected) handleDisconnect(connected);
                }}
              >
                <View style={styles.connectedBadge}>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Button
                title={connectingId === device.id ? 'Connecting...' : 'Connect'}
                onPress={() => handleConnect(device)}
                size="small"
                variant={connectingId === device.id ? 'outline' : 'primary'}
                disabled={connectingId !== null || !isNativeHealthConnected()}
              />
            )}
          </View>
        ))}
      </View>

      {connectedDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Connections</Text>
          {connectedDevices.map((device) => (
            <View key={device.id} style={styles.activeDeviceCard}>
              <View style={styles.activeDeviceInfo}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.activeDeviceName}>{device.name}</Text>
              </View>
              <Text style={styles.activeDeviceStatus}>
                {device.status === 'connected' ? 'Syncing' : device.status}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>
              Connect {getPlatformName()} to read health data from your phone and watch
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>
              Pair your wearable devices through the platform to aggregate all data
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>
              Your Digital Twin updates automatically with insights from all sources
            </Text>
          </View>
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
  platformSection: {
    marginBottom: SPACING.xl,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformLogo: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  platformDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  connectedContainer: {
    alignItems: 'flex-end',
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
  disconnectText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  helpText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
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
  activeDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${COLORS.success}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  activeDeviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  activeDeviceName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  activeDeviceStatus: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  infoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
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
