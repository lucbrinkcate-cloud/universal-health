import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useThemeStore } from '../stores';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height = 20, 
  borderRadius = 8,
  style 
}) => {
  const { colors } = useThemeStore();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: StyleProp<ViewStyle>;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <Skeleton width={60} height={60} borderRadius={30} />
      <View style={styles.cardContent}>
        <Skeleton width={150} height={16} />
        <Skeleton width={100} height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
};

interface SkeletonListProps {
  count?: number;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 5, style }) => {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} style={{ marginBottom: 12 }} />
      ))}
    </View>
  );
};

interface SkeletonBiometricCardProps {
  style?: StyleProp<ViewStyle>;
}

export const SkeletonBiometricCard: React.FC<SkeletonBiometricCardProps> = ({ style }) => {
  return (
    <View style={[styles.biometricCard, style]}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <Skeleton width={60} height={14} style={{ marginTop: 8 }} />
      <Skeleton width={80} height={24} style={{ marginTop: 4 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  list: {
    padding: 16,
  },
  biometricCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
  },
});

export default Skeleton;
