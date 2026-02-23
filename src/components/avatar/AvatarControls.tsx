// AvatarControls component – simple UI to tweak avatar settings
import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { useAvatarStore } from '../../stores/avatarStore';

export const AvatarControls: React.FC = () => {
  const {
    skinTone,
    anatomyLayers,
    setSkinTone,
    setAnatomyLayer,
  } = useAvatarStore();

  // Generate toggles for each anatomy layer key
  const layerKeys = Object.keys(anatomyLayers);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Skin Tone (hex):</Text>
      <TextInput
        style={styles.input}
        value={skinTone}
        onChangeText={setSkinTone}
        placeholder="#FFCCAA"
      />
      <Text style={styles.label}>Anatomy Layers:</Text>
      {layerKeys.length === 0 ? (
        <Text style={styles.note}>No layers defined yet.</Text>
      ) : (
        layerKeys.map((key) => (
          <View key={key} style={styles.row}>
            <Text style={styles.rowLabel}>{key}</Text>
            <Switch
              value={anatomyLayers[key]}
              onValueChange={(val) => setAnatomyLayer(key, val)}
            />
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  rowLabel: {
    textTransform: 'capitalize',
  },
  note: {
    fontStyle: 'italic',
    color: '#777',
  },
});
