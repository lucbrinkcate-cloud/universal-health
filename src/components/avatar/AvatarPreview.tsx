import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useAvatarStore } from '../../stores/avatarStore';
import { MuscleAvatar } from './MuscleAvatar';
import { AnatomyBody } from './AnatomyBody';
import { MuscleOverlay } from './MuscleOverlay';
import { AnatomyViewer } from './AnatomyViewer';
import { AvataaarsAvatar } from './AvataaarsAvatar';
import { ZAnatomyViewer } from './ZAnatomyViewer';
import { MuscleAnatomyViewer } from './MuscleAnatomyViewer';
import { AnatomyAvatar } from './AnatomyAvatar';
import { COLORS, SPACING } from '../../constants';

interface AvatarPreviewProps {
  size?: number;
  showModeToggle?: boolean;
  onMusclePress?: (muscleId: string) => void;
  onPress?: () => void;
  useNewAnatomy?: boolean;
  showGenderToggle?: boolean;
  showSideToggle?: boolean;
  useZAnatomy?: boolean;
  useDetailedAnatomy?: boolean;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  size = 300,
  showModeToggle = false,
  onMusclePress,
  onPress,
  useNewAnatomy = false,
  showGenderToggle = false,
  showSideToggle = false,
  useZAnatomy = false,
  useDetailedAnatomy = true,
}) => {
  const {
    profileData,
    viewMode,
    bodyView,
    customization,
    muscleGroups,
    toggleBodyView,
    setGender,
  } = useAvatarStore();

  const { gender } = customization;

  const centerX = 110;
  const scale = size / 300;

  const renderAvatarMode = () => (
    <AvataaarsAvatar size={size} />
  );

  const renderAnatomyMode = () => {
    if (useZAnatomy) {
      return (
        <ZAnatomyViewer
          size={size}
          onRegionSelect={onMusclePress}
        />
      );
    }

    if (useDetailedAnatomy) {
      return (
        <AnatomyAvatar
          gender={gender}
          side={bodyView}
          muscleGroups={muscleGroups}
          onMusclePress={onMusclePress}
          size={size}
          showLabels={true}
        />
      );
    }

    if (useNewAnatomy) {
      return (
        <MuscleAnatomyViewer
          gender={gender}
          side={bodyView}
          muscleGroups={muscleGroups}
          onMusclePress={onMusclePress}
          size={size}
        />
      );
    }

    return (
      <View>
        <AnatomyBody
          centerX={centerX}
          scale={scale}
          bodyView={bodyView}
        />
        <MuscleOverlay
          centerX={centerX}
          scale={scale}
          bodyView={bodyView}
          muscleGroups={muscleGroups}
          onMusclePress={onMusclePress}
          showLabels={false}
        />
      </View>
    );
  };

  const renderToggles = () => {
    if (!showGenderToggle && !showSideToggle) return null;

    return (
      <View style={styles.togglesContainer}>
        {showGenderToggle && (
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Gender:</Text>
            <View style={styles.toggleButtons}>
              <Pressable
                style={[
                  styles.toggleButton,
                  gender === 'male' && styles.toggleButtonActive,
                ]}
                onPress={() => setGender('male')}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    gender === 'male' && styles.toggleButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  gender === 'female' && styles.toggleButtonActive,
                ]}
                onPress={() => setGender('female')}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    gender === 'female' && styles.toggleButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {showSideToggle && (
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>View:</Text>
            <View style={styles.toggleButtons}>
              <Pressable
                style={[
                  styles.toggleButton,
                  bodyView === 'front' && styles.toggleButtonActive,
                ]}
                onPress={() => bodyView !== 'front' && toggleBodyView()}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    bodyView === 'front' && styles.toggleButtonTextActive,
                  ]}
                >
                  Front
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  bodyView === 'back' && styles.toggleButtonActive,
                ]}
                onPress={() => bodyView !== 'back' && toggleBodyView()}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    bodyView === 'back' && styles.toggleButtonTextActive,
                  ]}
                >
                  Back
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (viewMode === 'avatar') {
    return (
      <View style={styles.container}>
        <Pressable onPress={onPress} style={styles.avatarContainer}>
          {renderAvatarMode()}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.anatomyContainer}>
        {renderAnatomyMode()}
      </View>
      {renderToggles()}
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
  anatomyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglesContainer: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  toggleLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default AvatarPreview;
