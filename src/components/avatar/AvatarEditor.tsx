import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { useAvatarStore } from '../../stores/avatarStore';
import { AvatarPreview } from './AvatarPreview';
import {
  SKIN_TONES,
  BODY_TYPES,
  FACE_SHAPES,
  HAIR_STYLES,
  HAIR_COLORS,
  FACIAL_HAIR_STYLES,
  EYE_COLORS,
  EYE_SHAPES,
  CLOTHING_TOPS,
  CLOTHING_BOTTOMS,
  GLASSES_STYLES,
  HAT_STYLES,
  COMMON_COLORS,
} from '../../constants/avatarOptions';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

type EditorTab = 'body' | 'face' | 'hair' | 'clothes' | 'accessories' | 'profile';

interface AvatarEditorProps {
  visible: boolean;
  onClose: () => void;
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('body');
  const {
    profileData,
    customization,
    viewMode,
    setProfileData,
    setCustomization,
    setFaceCustomization,
    setEyeCustomization,
    setNoseCustomization,
    setMouthCustomization,
    setHairCustomization,
    setClothingCustomization,
    setAccessoryCustomization,
    setViewMode,
    resetCustomization,
  } = useAvatarStore();

  const tabs: { id: EditorTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '📊' },
    { id: 'body', label: 'Body', icon: '🧍' },
    { id: 'face', label: 'Face', icon: '😊' },
    { id: 'hair', label: 'Hair', icon: '💇' },
    { id: 'clothes', label: 'Clothes', icon: '👕' },
    { id: 'accessories', label: 'Extras', icon: '👓' },
  ];

  const renderColorOptions = (
    colors: { id: string; color: string; name: string }[],
    selectedColor: string,
    onSelect: (color: string) => void
  ) => (
    <View style={styles.optionGrid}>
      {colors.map((item) => (
        <Pressable
          key={item.id}
          style={[
            styles.colorOption,
            selectedColor === item.color && styles.colorOptionSelected,
          ]}
          onPress={() => onSelect(item.color)}
        >
          <View style={[styles.colorSwatch, { backgroundColor: item.color }]} />
        </Pressable>
      ))}
    </View>
  );

  const renderOptionGrid = (
    options: { id: string; name: string; icon?: string }[],
    selectedId: string,
    onSelect: (id: string) => void
  ) => (
    <View style={styles.optionGrid}>
      {options.map((item) => (
        <Pressable
          key={item.id}
          style={[
            styles.optionButton,
            selectedId === item.id && styles.optionButtonSelected,
          ]}
          onPress={() => onSelect(item.id)}
        >
          {item.icon && <Text style={styles.optionIcon}>{item.icon}</Text>}
          <Text style={[
            styles.optionText,
            selectedId === item.id && styles.optionTextSelected,
          ]}>
            {item.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Height & Weight</Text>
      <Text style={styles.sectionSubtitle}>These affect your avatar's proportions</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={profileData.height.toString()}
            onChangeText={(v) => setProfileData({ height: parseInt(v) || 170 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={profileData.weight.toString()}
            onChangeText={(v) => setProfileData({ weight: parseInt(v) || 70 })}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Body Type</Text>
      {renderOptionGrid(
        BODY_TYPES,
        customization.bodyType,
        (id) => setCustomization({ bodyType: id as any })
      )}
    </View>
  );

  const renderBodyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Skin Tone</Text>
      {renderColorOptions(
        SKIN_TONES,
        customization.skinTone,
        (color) => setCustomization({ skinTone: color })
      )}
    </View>
  );

  const renderFaceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Face Shape</Text>
      {renderOptionGrid(
        FACE_SHAPES,
        customization.face.shape,
        (id) => setFaceCustomization({ shape: id as any })
      )}

      <Text style={styles.sectionTitle}>Eye Shape</Text>
      {renderOptionGrid(
        EYE_SHAPES,
        customization.eyes.shape,
        (id) => setEyeCustomization({ shape: id as any })
      )}

      <Text style={styles.sectionTitle}>Eye Color</Text>
      {renderColorOptions(
        EYE_COLORS,
        customization.eyes.color,
        (color) => setEyeCustomization({ color })
      )}

      <Text style={styles.sectionTitle}>Mouth</Text>
      <View style={styles.optionGrid}>
        {['neutral', 'smile', 'smirk'].map((expr) => (
          <Pressable
            key={expr}
            style={[
              styles.optionButton,
              customization.mouth.expression === expr && styles.optionButtonSelected,
            ]}
            onPress={() => setMouthCustomization({ expression: expr as any })}
          >
            <Text style={styles.optionIcon}>
              {expr === 'smile' ? '😊' : expr === 'smirk' ? '😏' : '😐'}
            </Text>
            <Text style={styles.optionText}>{expr}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderHairTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Hair Style</Text>
      {renderOptionGrid(
        HAIR_STYLES,
        customization.hair.style,
        (id) => setHairCustomization({ style: id })
      )}

      <Text style={styles.sectionTitle}>Hair Color</Text>
      {renderColorOptions(
        HAIR_COLORS,
        customization.hair.color,
        (color) => setHairCustomization({ color })
      )}

      <Text style={styles.sectionTitle}>Facial Hair</Text>
      {renderOptionGrid(
        FACIAL_HAIR_STYLES,
        customization.hair.facialHair,
        (id) => setHairCustomization({ facialHair: id as any })
      )}
    </View>
  );

  const renderClothesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Top</Text>
      {renderOptionGrid(
        CLOTHING_TOPS,
        customization.clothing.top,
        (id) => setClothingCustomization({ top: id })
      )}

      <Text style={styles.sectionTitle}>Top Color</Text>
      {renderColorOptions(
        COMMON_COLORS,
        customization.clothing.topColor,
        (color) => setClothingCustomization({ topColor: color })
      )}

      <Text style={styles.sectionTitle}>Bottom</Text>
      {renderOptionGrid(
        CLOTHING_BOTTOMS,
        customization.clothing.bottom,
        (id) => setClothingCustomization({ bottom: id })
      )}

      <Text style={styles.sectionTitle}>Bottom Color</Text>
      {renderColorOptions(
        COMMON_COLORS,
        customization.clothing.bottomColor,
        (color) => setClothingCustomization({ bottomColor: color })
      )}
    </View>
  );

  const renderAccessoriesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Glasses</Text>
      {renderOptionGrid(
        GLASSES_STYLES,
        customization.accessories.glasses,
        (id) => setAccessoryCustomization({ glasses: id })
      )}

      <Text style={styles.sectionTitle}>Hat</Text>
      {renderOptionGrid(
        HAT_STYLES,
        customization.accessories.hat,
        (id) => setAccessoryCustomization({ hat: id })
      )}

      <Text style={styles.sectionTitle}>Hat Color</Text>
      {renderColorOptions(
        COMMON_COLORS,
        customization.accessories.hatColor,
        (color) => setAccessoryCustomization({ hatColor: color })
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'body':
        return renderBodyTab();
      case 'face':
        return renderFaceTab();
      case 'hair':
        return renderHairTab();
      case 'clothes':
        return renderClothesTab();
      case 'accessories':
        return renderAccessoriesTab();
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Done</Text>
          </Pressable>
          <Text style={styles.title}>Customize Avatar</Text>
          <Pressable onPress={resetCustomization} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>

        <View style={styles.previewContainer}>
          <AvatarPreview 
            size={180} 
            showModeToggle={true}
            showGenderToggle={true}
            showSideToggle={true}
            useNewAnatomy={true}
          />
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resetButton: {
    padding: SPACING.sm,
  },
  resetButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: '600',
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  tabContent: {
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  optionButton: {
    width: '23%',
    margin: '1%',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  optionIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  optionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  colorOption: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 20,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.primary,
  },
  colorSwatch: {
    flex: 1,
    borderRadius: 18,
  },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: -SPACING.sm,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default AvatarEditor;
