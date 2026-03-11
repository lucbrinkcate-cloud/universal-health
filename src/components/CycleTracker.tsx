import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { useCycleStore } from '../stores/cycleStore';
import type { CycleEntry } from '../stores/cycleStore';

interface CycleTrackerProps {
  compact?: boolean;
}

const PHASE_INFO = {
  menstruation: {
    name: 'Menstruation',
    icon: '🩸',
    color: COLORS.calories,
    description: 'Your period phase. Rest and hydrate.',
  },
  fertile: {
    name: 'Fertile Window',
    icon: '🌸',
    color: COLORS.primary,
    description: 'High fertility. Great for conception.',
  },
  ovulation: {
    name: 'Ovulation',
    icon: '🥚',
    color: COLORS.success,
    description: 'Ovulation day. Peak fertility.',
  },
  luteal: {
    name: 'Luteal Phase',
    icon: '🌙',
    color: COLORS.sleep,
    description: 'Post-ovulation. Energy may vary.',
  },
  not_configured: {
    name: 'Not Configured',
    icon: '⚙️',
    color: COLORS.textSecondary,
    description: 'Set up your cycle to get predictions',
  },
};

const ENTRY_TYPES = [
  { id: 'period', label: 'Period', icon: '🩸' },
  { id: 'spotting', label: 'Spotting', icon: '💧' },
  { id: 'fertile', label: 'Fertile', icon: '🌸' },
  { id: 'ovulation', label: 'Ovulation', icon: '🥚' },
  { id: 'symptoms', label: 'Symptoms', icon: '🤒' },
  { id: 'notes', label: 'Notes', icon: '📝' },
];

const FLOW_OPTIONS = [
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy', label: 'Heavy' },
];

export const CycleTracker: React.FC<CycleTrackerProps> = ({ compact = false }) => {
  const { entries, settings, addEntry, updateSettings, getPredictions, getCurrentPhase } = useCycleStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<CycleEntry['type']>('period');
  const [flow, setFlow] = useState<CycleEntry['flow']>('medium');
  const [notes, setNotes] = useState('');
  const [cycleLength, setCycleLength] = useState(settings.cycleLength.toString());
  const [periodLength, setPeriodLength] = useState(settings.periodLength.toString());

  const currentPhase = getCurrentPhase();
  const predictions = getPredictions();
  const phaseInfo = PHASE_INFO[currentPhase as keyof typeof PHASE_INFO] || PHASE_INFO.not_configured;

  const handleAddEntry = () => {
    addEntry({
      date: new Date().toISOString().split('T')[0],
      type: selectedType,
      flow: selectedType === 'period' ? flow : undefined,
      notes: notes || undefined,
    });
    setShowModal(false);
    setNotes('');
  };

  const handleSaveSettings = () => {
    updateSettings({
      cycleLength: parseInt(cycleLength) || 28,
      periodLength: parseInt(periodLength) || 5,
      isEnabled: true,
    });
    setShowModal(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (compact) {
    return (
      <Pressable style={styles.compactContainer} onPress={() => setShowModal(true)}>
        <View style={[styles.phaseIcon, { backgroundColor: `${phaseInfo.color}20` }]}>
          <Text style={styles.phaseEmoji}>{phaseInfo.icon}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactPhase}>{phaseInfo.name}</Text>
          {settings.isEnabled ? (
            predictions && currentPhase !== 'not_configured' ? (
              <Text style={styles.compactDate}>
                Next period: {formatDate(predictions.nextPeriod)}
              </Text>
            ) : (
              <Text style={styles.compactDate}>Track to see predictions</Text>
            )
          ) : (
            <Text style={styles.compactDate}>Tap to configure</Text>
          )}
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cycle Tracker</Text>
        <Pressable onPress={() => setShowModal(true)}>
          <Text style={styles.settingsButton}>⚙️</Text>
        </Pressable>
      </View>

      {/* Current Phase */}
      <View style={[styles.phaseCard, { borderLeftColor: phaseInfo.color }]}>
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseEmojiLarge}>{phaseInfo.icon}</Text>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseName}>{phaseInfo.name}</Text>
            <Text style={styles.phaseDescription}>{phaseInfo.description}</Text>
          </View>
        </View>
      </View>

      {/* Predictions */}
      {settings.isEnabled && predictions && (
        <View style={styles.predictionsCard}>
          <Text style={styles.predictionsTitle}>📅 Predictions</Text>
          <View style={styles.predictionRow}>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>Next Period</Text>
              <Text style={styles.predictionValue}>{formatDate(predictions.nextPeriod)}</Text>
            </View>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>Ovulation</Text>
              <Text style={styles.predictionValue}>{formatDate(predictions.ovulationDate)}</Text>
            </View>
          </View>
          <View style={styles.fertileWindow}>
            <Text style={styles.fertileLabel}>🌸 Fertile Window:</Text>
            <Text style={styles.fertileDates}>
              {formatDate(predictions.nextFertileWindow.start)} - {formatDate(predictions.nextFertileWindow.end)}
            </Text>
          </View>
        </View>
      )}

      {/* Quick Add */}
      <Pressable style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+ Log Today</Text>
      </Pressable>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <View style={styles.entriesSection}>
          <Text style={styles.entriesTitle}>Recent Entries</Text>
          {entries.slice(0, 5).map((entry) => {
            const typeInfo = ENTRY_TYPES.find(t => t.id === entry.type);
            return (
              <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryIcon}>{typeInfo?.icon || '📝'}</Text>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryType}>{typeInfo?.label || entry.type}</Text>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                </View>
                {entry.flow && (
                  <View style={[styles.flowBadge, { 
                    backgroundColor: entry.flow === 'heavy' ? COLORS.calories : 
                      entry.flow === 'medium' ? COLORS.warning : COLORS.primary 
                  }]}>
                    <Text style={styles.flowText}>{entry.flow}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cycle Tracker</Text>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>⚙️ Settings</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Cycle Length</Text>
                <TextInput
                  style={styles.input}
                  value={cycleLength}
                  onChangeText={setCycleLength}
                  keyboardType="numeric"
                  placeholder="28"
                />
                <Text style={styles.inputUnit}>days</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Period Length</Text>
                <TextInput
                  style={styles.input}
                  value={periodLength}
                  onChangeText={setPeriodLength}
                  keyboardType="numeric"
                  placeholder="5"
                />
                <Text style={styles.inputUnit}>days</Text>
              </View>
              <Pressable style={styles.saveButton} onPress={handleSaveSettings}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </Pressable>
            </View>

            {/* Log Entry */}
            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>📝 Log Entry</Text>
              <Text style={styles.logSubtitle}>What are you tracking today?</Text>
              
              <View style={styles.typeGrid}>
                {ENTRY_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.typeButton,
                      selectedType === type.id && styles.typeButtonActive,
                    ]}
                    onPress={() => setSelectedType(type.id as CycleEntry['type'])}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[
                      styles.typeLabel,
                      selectedType === type.id && styles.typeLabelActive,
                    ]}>
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {selectedType === 'period' && (
                <View style={styles.flowSection}>
                  <Text style={styles.flowTitle}>Flow Intensity</Text>
                  <View style={styles.flowOptions}>
                    {FLOW_OPTIONS.map((option) => (
                      <Pressable
                        key={option.id}
                        style={[
                          styles.flowOption,
                          flow === option.id && styles.flowOptionActive,
                        ]}
                        onPress={() => setFlow(option.id as CycleEntry['flow'])}
                      >
                        <Text style={[
                          styles.flowOptionText,
                          flow === option.id && styles.flowOptionTextActive,
                        ]}>{option.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <TextInput
                style={styles.notesInput}
                placeholder="Add notes (optional)..."
                placeholderTextColor={COLORS.textTertiary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              <Pressable style={styles.logButton} onPress={handleAddEntry}>
                <Text style={styles.logButtonText}>Log Entry</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsButton: {
    fontSize: 20,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  phaseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactPhase: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  compactDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textTertiary,
  },
  phaseCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseEmoji: {
    fontSize: 24,
  },
  phaseEmojiLarge: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  phaseDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  predictionsCard: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  predictionsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  predictionItem: {
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  predictionValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fertileWindow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  fertileLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  fertileDates: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  entriesSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  entriesTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  entryIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryType: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  entryDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  flowBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  flowText: {
    fontSize: FONT_SIZE.xs,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    padding: SPACING.sm,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.md,
  },
  settingsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  input: {
    width: 60,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  inputUnit: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  logSection: {
    marginBottom: SPACING.lg,
  },
  logSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  typeButton: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: `${COLORS.primary}15`,
    borderColor: COLORS.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  typeLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  typeLabelActive: {
    color: COLORS.primary,
  },
  flowSection: {
    marginBottom: SPACING.md,
  },
  flowTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  flowOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  flowOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flowOptionActive: {
    backgroundColor: `${COLORS.primary}15`,
    borderColor: COLORS.primary,
  },
  flowOptionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  flowOptionTextActive: {
    color: COLORS.primary,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  logButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default CycleTracker;
