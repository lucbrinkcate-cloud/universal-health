import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { MuscleGroup, BodyView } from '../../stores/avatarStore';

interface ImageMuscleAnatomyProps {
  gender: 'male' | 'female';
  side: BodyView;
  muscleGroups: Record<string, MuscleGroup>;
  onMusclePress?: (muscleId: string) => void;
  width?: number;
  height?: number;
  imageSource: any; // require() path to image
}

// Muscle region definitions (relative coordinates 0-1)
// These define clickable/touchable areas over the image
const MUSCLE_REGIONS = {
  front: [
    // Head & Neck
    { id: 'head_front', name: 'Head (skull muscles)', x: 0.5, y: 0.08, width: 0.25, height: 0.15 },
    { id: 'neck_front', name: 'Neck (sternocleidomastoid)', x: 0.5, y: 0.2, width: 0.12, height: 0.08 },

    // Shoulders / Deltoids
    { id: 'deltoid_front_left', name: 'Deltoid (Anterior, Left)', x: 0.28, y: 0.18, width: 0.12, height: 0.08 },
    { id: 'deltoid_front_right', name: 'Deltoid (Anterior, Right)', x: 0.72, y: 0.18, width: 0.12, height: 0.08 },

    // Chest / Pectorals
    { id: 'pec_front_left', name: 'Pectoralis Major (Left)', x: 0.42, y: 0.26, width: 0.12, height: 0.12 },
    { id: 'pec_front_right', name: 'Pectoralis Major (Right)', x: 0.58, y: 0.26, width: 0.12, height: 0.12 },

    // Biceps
    { id: 'bicep_front_left', name: 'Biceps Brachii (Left)', x: 0.35, y: 0.35, width: 0.08, height: 0.15 },
    { id: 'bicep_front_right', name: 'Biceps Brachii (Right)', x: 0.65, y: 0.35, width: 0.08, height: 0.15 },

    // Forearms
    { id: 'forearm_front_left', name: 'Forearm Flexors (Left)', x: 0.33, y: 0.52, width: 0.07, height: 0.18 },
    { id: 'forearm_front_right', name: 'Forearm Flexors (Right)', x: 0.67, y: 0.52, width: 0.07, height: 0.18 },

    // Abs
    { id: 'abs_front', name: 'Rectus Abdominis', x: 0.5, y: 0.58, width: 0.12, height: 0.18 },
    { id: 'abs_side_left', name: 'External Oblique (Left)', x: 0.38, y: 0.58, width: 0.1, height: 0.16 },
    { id: 'abs_side_right', name: 'External Oblique (Right)', x: 0.62, y: 0.58, width: 0.1, height: 0.16 },

    // Serratus
    { id: 'serratus_left', name: 'Serratus Anterior (Left)', x: 0.42, y: 0.32, width: 0.08, height: 0.12 },
    { id: 'serratus_right', name: 'Serratus Anterior (Right)', x: 0.58, y: 0.32, width: 0.08, height: 0.12 },

    // Hips / Glutes
    { id: 'glute_front_left', name: 'Gluteus Maximus (Left)', x: 0.42, y: 0.8, width: 0.12, height: 0.1 },
    { id: 'glute_front_right', name: 'Gluteus Maximus (Right)', x: 0.58, y: 0.8, width: 0.12, height: 0.1 },

    // Quadriceps
    { id: 'quad_left', name: 'Quadriceps Femoris (Left)', x: 0.4, y: 0.9, width: 0.1, height: 0.2 },
    { id: 'quad_right', name: 'Quadriceps Femoris (Right)', x: 0.6, y: 0.9, width: 0.1, height: 0.2 },

    // Hamstrings
    { id: 'ham_left', name: 'Hamstrings (Left)', x: 0.4, y: 0.92, width: 0.08, height: 0.12 },
    { id: 'ham_right', name: 'Hamstrings (Right)', x: 0.6, y: 0.92, width: 0.08, height: 0.12 },

    // Calves
    { id: 'calf_left', name: 'Gastrocnemius (Calf, Left)', x: 0.4, y: 1.05, width: 0.08, height: 0.15 },
    { id: 'calf_right', name: 'Gastrocnemius (Calf, Right)', x: 0.6, y: 1.05, width: 0.08, height: 0.15 },
  ],
  back: [
    // Head & Neck
    { id: 'head_back', name: 'Head (back muscles)', x: 0.5, y: 0.08, width: 0.25, height: 0.15 },
    { id: 'neck_back', name: 'Neck (trapezius, splenius)', x: 0.5, y: 0.2, width: 0.12, height: 0.08 },

    // Shoulders
    { id: 'deltoid_back_left', name: 'Deltoid (Posterior, Left)', x: 0.28, y: 0.18, width: 0.12, height: 0.08 },
    { id: 'deltoid_back_right', name: 'Deltoid (Posterior, Right)', x: 0.72, y: 0.18, width: 0.12, height: 0.08 },

    // Trapezius
    { id: 'trap_left', name: 'Trapezius (Left)', x: 0.38, y: 0.17, width: 0.12, height: 0.08 },
    { id: 'trap_right', name: 'Trapezius (Right)', x: 0.62, y: 0.17, width: 0.12, height: 0.08 },

    // Lats
    { id: 'lat_left', name: 'Latissimus Dorsi (Left)', x: 0.28, y: 0.35, width: 0.12, height: 0.2 },
    { id: 'lat_right', name: 'Latissimus Dorsi (Right)', x: 0.72, y: 0.35, width: 0.12, height: 0.2 },

    // Rhomboids
    { id: 'rhomboid_left', name: 'Rhomboids (Left)', x: 0.42, y: 0.32, width: 0.08, height: 0.1 },
    { id: 'rhomboid_right', name: 'Rhomboids (Right)', x: 0.58, y: 0.32, width: 0.08, height: 0.1 },

    // Spinal erectors
    { id: 'spine_erector', name: 'Erector Spinae', x: 0.5, y: 0.38, width: 0.06, height: 0.25 },

    // Triceps
    { id: 'tricep_back_left', name: 'Triceps Brachii (Left)', x: 0.35, y: 0.38, width: 0.08, height: 0.15 },
    { id: 'tricep_back_right', name: 'Triceps Brachii (Right)', x: 0.65, y: 0.38, width: 0.08, height: 0.15 },

    // Forearms (back)
    { id: 'forearm_back_left', name: 'Forearm Extensors (Left)', x: 0.33, y: 0.55, width: 0.07, height: 0.15 },
    { id: 'forearm_back_right', name: 'Forearm Extensors (Right)', x: 0.67, y: 0.55, width: 0.07, height: 0.15 },

    // Glutes
    { id: 'glute_back_left', name: 'Gluteus Maximus (Left)', x: 0.42, y: 0.8, width: 0.12, height: 0.1 },
    { id: 'glute_back_right', name: 'Gluteus Maximus (Right)', x: 0.58, y: 0.8, width: 0.12, height: 0.1 },

    // Hamstrings
    { id: 'ham_back_left', name: 'Hamstrings (Left)', x: 0.4, y: 0.92, width: 0.08, height: 0.12 },
    { id: 'ham_back_right', name: 'Hamstrings (Right)', x: 0.6, y: 0.92, width: 0.08, height: 0.12 },

    // Calves (back)
    { id: 'calf_back_left', name: 'Gastrocnemius & Soleus (Left)', x: 0.4, y: 1.05, width: 0.08, height: 0.15 },
    { id: 'calf_back_right', name: 'Gastrocnemius & Soleus (Right)', x: 0.6, y: 1.05, width: 0.08, height: 0.15 },
  ],
};

const MUSCLE_COLORS = {
  fresh: 'rgba(160, 160, 160, 0.6)',
  trained: 'rgba(76, 175, 80, 0.7)',
  recovering: 'rgba(255, 152, 0, 0.7)',
  selected: 'rgba(33, 150, 243, 0.8)',
  hover: 'rgba(100, 181, 246, 0.75)',
};

export const ImageMuscleAnatomyViewer: React.FC<ImageMuscleAnatomyProps> = ({
  gender,
  side,
  muscleGroups,
  onMusclePress,
  width = 300,
  height = 600,
  imageSource,
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '' });

  const regions = MUSCLE_REGIONS[side];

  const getMuscleColor = useCallback((muscleId: string, isHovered: boolean = false) => {
    const muscle = muscleGroups[muscleId];
    const isSelected = selectedMuscle === muscleId;

    if (isSelected) return MUSCLE_COLORS.selected;
    if (isHovered) return MUSCLE_COLORS.hover;
    if (!muscle) return MUSCLE_COLORS.fresh;

    return MUSCLE_COLORS[muscle.status] || MUSCLE_COLORS.fresh;
  }, [muscleGroups, selectedMuscle]);

  const handleMusclePress = useCallback((muscleId: string) => {
    const newSelection = selectedMuscle === muscleId ? null : muscleId;
    setSelectedMuscle(newSelection);
    onMusclePress?.(newSelection || muscleId);
  }, [selectedMuscle, onMusclePress]);

  const handleHover = useCallback((muscleId: string, event: any) => {
    setHoveredMuscle(muscleId);
    const muscle = muscleGroups[muscleId] || { name: muscleId };
    
    if (event && event.nativeEvent) {
      const { locationX, locationY } = event.nativeEvent;
      setTooltip({
        visible: true,
        x: locationX,
        y: locationY,
        name: getMuscleName(muscleId),
      });
    }
  }, [muscleGroups]);

  const handleHoverEnd = useCallback(() => {
    setHoveredMuscle(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  const renderMuscleRegion = (region: any) => {
    const isSelected = selectedMuscle === region.id;
    const isHovered = hoveredMuscle === region.id;
    
    const left = region.x * width;
    const top = region.y * height;
    const regionWidth = region.width * width;
    const regionHeight = region.height * height;

    return (
      <TouchableWithoutFeedback
        key={region.id}
        onPress={() => handleMusclePress(region.id)}
      >
        <View
          style={[
            styles.muscleRegion,
            {
              left,
              top,
              width: regionWidth,
              height: regionHeight,
              backgroundColor: getMuscleColor(region.id, isHovered),
              borderWidth: isSelected || isHovered ? 2 : 0,
              borderColor: isSelected ? '#1565C0' : isHovered ? '#1976D2' : 'transparent',
            },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <ImageBackground
        source={imageSource}
        style={[styles.image, { width, height }]}
        resizeMode="contain"
      >
        {/* Muscle overlay regions */}
        {regions.map(renderMuscleRegion)}
      </ImageBackground>

      {/* Tooltip */}
      {tooltip.visible && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              left: tooltip.x - 75,
              top: tooltip.y - 60,
            },
          ]}
        >
          <Text style={styles.tooltipName}>{tooltip.name}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const getMuscleName = (muscleId: string): string => {
  const names: Record<string, string> = {
    // Front
    head_front: 'Head (Frontal Muscles)',
    neck_front: 'Neck (Sternocleidomastoid)',
    deltoid_front_left: 'Deltoid (Anterior, Left)',
    deltoid_front_right: 'Deltoid (Anterior, Right)',
    pec_front_left: 'Pectoralis Major (Left)',
    pec_front_right: 'Pectoralis Major (Right)',
    bicep_front_left: 'Biceps Brachii (Left)',
    bicep_front_right: 'Biceps Brachii (Right)',
    forearm_front_left: 'Forearm Flexors (Left)',
    forearm_front_right: 'Forearm Flexors (Right)',
    abs_front: 'Rectus Abdominis',
    abs_side_left: 'External Oblique (Left)',
    abs_side_right: 'External Oblique (Right)',
    serratus_left: 'Serratus Anterior (Left)',
    serratus_right: 'Serratus Anterior (Right)',
    glute_front_left: 'Gluteus Maximus (Left)',
    glute_front_right: 'Gluteus Maximus (Right)',
    quad_left: 'Quadriceps (Left)',
    quad_right: 'Quadriceps (Right)',
    ham_left: 'Hamstrings (Left)',
    ham_right: 'Hamstrings (Right)',
    calf_left: 'Gastrocnemius (Left)',
    calf_right: 'Gastrocnemius (Right)',

    // Back
    head_back: 'Head (Back)',
    neck_back: 'Neck (Trapezius, Splenius)',
    deltoid_back_left: 'Deltoid (Posterior, Left)',
    deltoid_back_right: 'Deltoid (Posterior, Right)',
    trap_left: 'Trapezius (Left)',
    trap_right: 'Trapezius (Right)',
    lat_left: 'Latissimus Dorsi (Left)',
    lat_right: 'Latissimus Dorsi (Right)',
    rhomboid_left: 'Rhomboids (Left)',
    rhomboid_right: 'Rhomboids (Right)',
    spine_erector: 'Erector Spinae',
    tricep_back_left: 'Triceps Brachii (Left)',
    tricep_back_right: 'Triceps Brachii (Right)',
    forearm_back_left: 'Forearm Extensors (Left)',
    forearm_back_right: 'Forearm Extensors (Right)',
    glute_back_left: 'Gluteus Maximus (Left)',
    glute_back_right: 'Gluteus Maximus (Right)',
    ham_back_left: 'Hamstrings (Left)',
    ham_back_right: 'Hamstrings (Right)',
    calf_back_left: 'Gastrocnemius & Soleus (Left)',
    calf_back_right: 'Gastrocnemius & Soleus (Right)',
  };

  return names[muscleId] || muscleId.replace(/(_left|_right|_front|_back)/g, '').replace(/_/g, ' ');
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  muscleRegion: {
    position: 'absolute',
    borderRadius: 4,
    opacity: 0.6,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  tooltipName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ImageMuscleAnatomyViewer;