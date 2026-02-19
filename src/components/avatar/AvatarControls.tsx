import React from 'react';
import { View, Text, Button, TextInput, Switch, StyleSheet } from 'react-native';
import { useAvatarStore } from '../../stores/avatarSlice';

export const AvatarControls: React.FC = () => {
  const { config, setSkinTone, setAnatomyLayer } = useAvatarStore();

  const toggleLayer = (layer: keyof typeof config.anatomyLayers) => {
    setAnatomyLayer(layer, !config.anatomyLayers[layer]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Skin Tone (hex):</Text>
      <TextInput
        style={styles.input}
        value={config.skinTone}
        onChangeText={setSkinTone}
        placeholder="#FFCC99"
      />
      <Text style={styles.label}>Anatomy Layers:</Text>
      {Object.entries(config.anatomyLayers).map(([layer, enabled]) => (
        <View key={layer} style={styles.layerRow}>
          <Text style={styles.layerText}>{layer}</Text>
          <Switch
            value={enabled}
            onValueChange={() => toggleLayer(layer as keyof typeof config.anatomyLayers)}
          />
        </View>
      ))}
      {/* Photo picker placeholder */}
      <Button title="Change Photo (TODO)" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    marginBottom: 8,
  },
  layerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  layerText: {
    textTransform: 'capitalize',
  },
});
