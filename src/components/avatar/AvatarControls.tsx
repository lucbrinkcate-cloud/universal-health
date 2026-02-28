import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAvatarStore } from '../../stores/avatarStore';
import { SKIN_TONES, BODY_TYPES } from '../../constants/avatarOptions';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

export const AvatarControls: React.FC = () => {
  const { customization, setCustomization } = useAvatarStore();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Skin Tone</Text>
      <View style={styles.colorRow}>
        {SKIN_TONES.map((tone) => (
          <Pressable
            key={tone.id}
            style={[
              styles.colorButton,
              customization.skinTone === tone.color && styles.colorButtonSelected,
            ]}
            onPress={() => setCustomization({ skinTone: tone.color })}
          >
            <View style={[styles.colorSwatch, { backgroundColor: tone.color }]} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Body Type</Text>
      <View style={styles.typeRow}>
        {BODY_TYPES.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.typeButton,
              customization.bodyType === type.id && styles.typeButtonSelected,
            ]}
            onPress={() => setCustomization({ bodyType: type.id as any })}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text style={styles.typeName}>{type.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 2,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: COLORS.primary,
  },
  colorSwatch: {
    flex: 1,
    borderRadius: 16,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeButton: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  typeButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
});

export default AvatarControls;
