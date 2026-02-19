import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Button,
  TextInput,
} from 'react-native';
import { useHealthStore } from '../../stores';
import { useAvatarStore } from '../../stores/avatarSlice';
import { DigitalTwinAvatar } from '../../components/DigitalTwinAvatar';
import { BiometricDisplay } from '../../components/BiometricDisplay';
import { BodyRegionDetail } from '../../components/BodyRegionDetail';
import { Loading, ErrorView } from '../../components';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { BodyRegion, BodyRegionData } from '../../types';
import { getRelativeTime } from '../../utils';

export const DigitalTwinScreen: React.FC = () => {
  const {
    healthData,
    extendedHealthData,
    isLoading,
    error,
    fetchHealthData,
    useMockData,
    clearError,
    selectedRegion,
    setSelectedRegion,
  } = useHealthStore();

  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    if (!healthData) {
      fetchHealthData();
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      setDetailVisible(true);
    }
  }, [selectedRegion]);

  const onRefresh = useCallback(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const handleRegionPress = useCallback((region: BodyRegion) => {
    setSelectedRegion(region);
  }, [setSelectedRegion]);

  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedRegion(null);
  }, [setSelectedRegion]);

  const getSelectedRegionData = (): BodyRegionData | null => {
    if (!selectedRegion || !extendedHealthData) return null;
    return extendedHealthData.bodyRegionData.find(r => r.region === selectedRegion) || null;
  };

  if (isLoading && !extendedHealthData) {
    return <Loading fullScreen message="Loading your Digital Twin..." />;
  }

  if (error && !extendedHealthData) {
    return (
      <View style={styles.errorContainer}>
        <ErrorView message={error} onRetry={onRefresh} />
        <Pressable style={styles.demoButton} onPress={useMockData}>
          <Text style={styles.demoText}>Or try with demo data:</Text>
          <Text style={styles.demoButtonText}>Load Demo Data</Text>
        </Pressable>
      </View>
    );
  }

  if (!extendedHealthData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.noDataText}>No health data available</Text>
        <Pressable style={styles.demoButton} onPress={useMockData}>
          <Text style={styles.demoButtonText}>Load Demo Data</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Digital Twin</Text>
        <Text style={styles.subtitle}>
          Tap on body regions to explore your health
        </Text>
        <Text style={styles.lastUpdated}>
          Updated {getRelativeTime(extendedHealthData.lastUpdated)}
        </Text>
      </View>

      <View style={styles.avatarSection}>
        <DigitalTwinAvatar
          bodyRegionData={extendedHealthData.bodyRegionData}
          onRegionPress={handleRegionPress}
          size="medium"
          animated={true}
        />
      </View>

      <View style={styles.biometricSection}>
        <BiometricDisplay healthData={extendedHealthData} />
      </View>

      <View style={styles.legendSection}>
        <Text style={styles.legendTitle}>Status Legend</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>Good</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendText}>Warning</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendText}>Alert</Text>
          </View>
        </View>
      </View>

      <BodyRegionDetail
        visible={detailVisible}
        regionData={getSelectedRegionData()}
        onClose={handleCloseDetail}
      />
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
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
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
  lastUpdated: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  biometricSection: {
    marginTop: SPACING.lg,
  },
  legendSection: {
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  legendTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  demoButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  demoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  demoButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  noDataText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
});

export default DigitalTwinScreen;
