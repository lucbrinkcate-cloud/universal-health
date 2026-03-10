import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

export const MuscleAnatomyScreen: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.placeholder, { width: Math.min(width - 40, 350) }]}>
        <Text style={styles.stickFigure}>🧍</Text>
        <Text style={styles.placeholderText}>Muscles</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  placeholder: {
    height: 400,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  stickFigure: {
    fontSize: 120,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '500',
  },
});

export default MuscleAnatomyScreen;