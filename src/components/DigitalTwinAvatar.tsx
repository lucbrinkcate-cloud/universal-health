import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { BodyRegion, BodyRegionData, HealthStatus } from '../types';
import { getStatusColor } from '../utils/healthScoreEngine';
import { COLORS, SPACING } from '../constants';

interface DigitalTwinAvatarProps {
  bodyRegionData: BodyRegionData[];
  onRegionPress: (region: BodyRegion) => void;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = SCREEN_WIDTH * 0.7;

interface BodyRegionPath {
  region: BodyRegion;
  path: string;
  label: string;
  cx: number;
  cy: number;
}

const BODY_REGION_PATHS: BodyRegionPath[] = [
  {
    region: 'cardiovascular',
    path: 'M 90 85 C 90 60, 110 50, 110 85 C 110 110, 90 120, 90 85 M 110 85 C 110 60, 130 50, 130 85 C 130 110, 110 120, 110 85',
    label: 'Heart',
    cx: 100,
    cy: 85,
  },
  {
    region: 'respiratory',
    path: 'M 70 70 C 50 60, 40 90, 60 110 C 80 130, 90 120, 70 70 M 150 70 C 170 60, 180 90, 160 110 C 140 130, 130 120, 150 70',
    label: 'Lungs',
    cx: 70,
    cy: 90,
  },
  {
    region: 'musculoskeletal',
    path: 'M 50 150 L 40 200 L 60 200 L 70 160 L 150 160 L 160 200 L 180 200 L 170 150',
    label: 'Arms',
    cx: 60,
    cy: 175,
  },
  {
    region: 'nervous',
    path: 'M 85 30 C 85 10, 135 10, 135 30 C 135 45, 115 50, 110 50 L 110 55 C 115 55, 135 60, 135 75 C 135 95, 85 95, 85 75 C 85 60, 105 55, 110 55 L 110 50 C 105 50, 85 45, 85 30',
    label: 'Brain',
    cx: 110,
    cy: 52,
  },
  {
    region: 'digestive',
    path: 'M 90 130 L 130 130 L 140 200 L 80 200 Z',
    label: 'Stomach',
    cx: 110,
    cy: 165,
  },
  {
    region: 'endocrine',
    path: 'M 95 115 L 125 115 L 125 130 L 95 130 Z',
    label: 'Thyroid',
    cx: 110,
    cy: 122,
  },
  {
    region: 'immune',
    path: 'M 70 210 L 150 210 L 150 280 L 70 280 Z',
    label: 'Core',
    cx: 110,
    cy: 245,
  },
  {
    region: 'general',
    path: 'M 75 285 L 90 340 L 130 340 L 145 285',
    label: 'Legs',
    cx: 110,
    cy: 312,
  },
];

const getRegionStatus = (region: BodyRegion, data: BodyRegionData[]): HealthStatus => {
  const regionData = data.find(r => r.region === region);
  return regionData?.status || 'good';
};

const getRegionScore = (region: BodyRegion, data: BodyRegionData[]): number => {
  const regionData = data.find(r => r.region === region);
  return regionData?.score || 0;
};

export const DigitalTwinAvatar: React.FC<DigitalTwinAvatarProps> = ({
  bodyRegionData,
  onRegionPress,
  size = 'medium',
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const getSize = () => {
    switch (size) {
      case 'small':
        return AVATAR_SIZE * 0.6;
      case 'large':
        return AVATAR_SIZE;
      default:
        return AVATAR_SIZE * 0.8;
    }
  };

  const avatarSize = getSize();
  const scale = avatarSize / AVATAR_SIZE;

  useEffect(() => {
    if (animated) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [animated, pulseAnim]);

  const handleRegionPress = useCallback((region: BodyRegion) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onRegionPress(region);
  }, [onRegionPress, scaleAnim]);

  const renderBodyOutline = () => (
    <G scale={scale} translateX={0} translateY={0}>
      <Path
        d="M 85 25 C 85 5, 135 5, 135 25 C 135 42, 118 48, 110 48 L 110 52 C 118 52, 135 58, 135 75 C 135 95, 85 95, 85 75 C 85 58, 102 52, 110 52 L 110 48 C 102 48, 85 42, 85 25"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 70 55 C 50 45, 35 80, 55 110 C 70 135, 85 125, 70 55 M 150 55 C 170 45, 185 80, 165 110 C 150 135, 135 125, 150 55"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 85 85 C 85 55, 110 45, 110 85 C 110 115, 85 125, 85 85 M 110 85 C 110 55, 135 45, 135 85 C 135 115, 110 125, 110 85"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 88 120 L 132 120 L 142 200 L 78 200 Z"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 45 145 L 35 210 L 55 210 L 65 160 M 175 145 L 185 210 L 165 210 L 155 160"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 70 205 L 150 205 L 150 290 L 70 290 Z"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
      <Path
        d="M 75 290 L 90 350 L 130 350 L 145 290"
        fill={COLORS.surface}
        stroke={COLORS.border}
        strokeWidth={2}
      />
    </G>
  );

  const renderRegionOverlays = () => (
    <G scale={scale} translateX={0} translateY={0}>
      {BODY_REGION_PATHS.map(({ region, label, cx, cy }) => {
        const status = getRegionStatus(region, bodyRegionData);
        const score = getRegionScore(region, bodyRegionData);
        const color = getStatusColor(status);

        return (
          <Pressable
            key={region}
            onPress={() => handleRegionPress(region)}
          >
            <G>
              <Circle
                cx={cx}
                cy={cy}
                r={18 * (score / 100 + 0.5)}
                fill={color}
                opacity={0.3}
              />
              <Circle
                cx={cx}
                cy={cy}
                r={12 * (score / 100 + 0.5)}
                fill={color}
                opacity={0.5}
              />
              <Circle
                cx={cx}
                cy={cy}
                r={6}
                fill={color}
              />
              <SvgText
                x={cx}
                y={cy + 30}
                fontSize={8}
                fill={COLORS.textSecondary}
                textAnchor="middle"
              >
                {label}
              </SvgText>
            </G>
          </Pressable>
        );
      })}
    </G>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
            ],
          },
        ]}
      >
        <Svg
          width={avatarSize}
          height={avatarSize * 1.2}
          viewBox={`0 0 ${AVATAR_SIZE} ${AVATAR_SIZE * 1.2}`}
        >
          {renderBodyOutline()}
          {renderRegionOverlays()}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DigitalTwinAvatar;
