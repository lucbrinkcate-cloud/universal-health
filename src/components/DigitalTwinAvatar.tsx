import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DigitalTwinAvatarProps {
  bodyRegionData?: any[];
  onRegionPress?: (region: any) => void;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showModeToggle?: boolean;
  useNewAnatomy?: boolean;
  useZAnatomy?: boolean;
  useDetailedAnatomy?: boolean;
  showGenderToggle?: boolean;
  showSideToggle?: boolean;
}

export const DigitalTwinAvatar: React.FC<DigitalTwinAvatarProps> = ({
  size = 'medium',
}) => {
  const getSizeValue = (): number => {
    switch (size) {
      case 'small':
        return 100;
      case 'large':
        return 160;
      default:
        return 120;
    }
  };

  const fontSize = getSizeValue();

  return (
    <View style={[styles.container, { width: fontSize, height: fontSize * 2.2 }]}>
      <Text style={[styles.stickFigure, { fontSize }]}>🧍</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  stickFigure: {
    textAlign: 'center',
  },
});

export default DigitalTwinAvatar;