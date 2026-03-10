import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { MuscleGroup, BodyView, useAvatarStore } from '../../stores/avatarStore';
import { MuscleBody } from './MuscleBody';

interface MuscleAvatarProps {
  gender: 'male' | 'female';
  side: BodyView;
  muscleGroups: Record<string, MuscleGroup>;
  onMusclePress?: (muscleId: string) => void;
  size?: number;
}

export const MuscleAvatar: React.FC<MuscleAvatarProps> = ({
  gender,
  side,
  muscleGroups,
  onMusclePress,
  size = 200,
}) => {
  const { selectedMuscle, setSelectedMuscle } = useAvatarStore();

  const handleMusclePress = useCallback(
    (muscleId: string) => {
      setSelectedMuscle(muscleId);
      onMusclePress?.(muscleId);
    },
    [onMusclePress, setSelectedMuscle]
  );

  return (
    <View style={[styles.container, { width: size, height: size * 1.8 }]}>
      <MuscleBody
        gender={gender}
        side={side}
        muscleGroups={muscleGroups}
        onMusclePress={handleMusclePress}
        size={size}
        selectedMuscle={selectedMuscle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MuscleAvatar;
