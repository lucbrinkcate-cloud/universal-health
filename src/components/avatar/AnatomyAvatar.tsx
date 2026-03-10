import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MuscleGroup, BodyView, MuscleStatus } from '../../stores/avatarStore';

export interface AnatomyAvatarProps {
  gender: 'male' | 'female';
  side: BodyView;
  muscleGroups: Record<string, MuscleGroup>;
  selectedMuscle?: string | null;
  onMusclePress?: (muscleId: string) => void;
  size?: number;
  showLabels?: boolean;
  highlightedMuscles?: string[];
}

const COLORS = {
  skin: '#E8C4B8',
  skinDark: '#D4A594',
  outline: '#5D4037',
  muscle: {
    fresh: '#B8B8B8',
    trained: '#4CAF50',
    recovering: '#FF9800',
    selected: '#2196F3',
  },
  stroke: {
    fresh: '#757575',
    trained: '#2E7D32',
    recovering: '#F57C00',
    selected: '#1565C0',
  },
};

export const AnatomyAvatar: React.FC<AnatomyAvatarProps> = ({
  gender,
  side,
  muscleGroups,
  selectedMuscle,
  onMusclePress,
  size = 300,
  showLabels = false,
  highlightedMuscles = [],
}) => {
  const viewBox = '0 0 400 700';
  const aspectRatio = 700 / 400;

  const MUSCLE_ID_MAP: Record<string, string> = {
    deltoids_left: 'deltoids',
    deltoids_right: 'deltoids',
    pectorals_left: 'pectorals',
    pectorals_right: 'pectorals',
    biceps_left: 'biceps',
    biceps_right: 'biceps',
    forearms_left: 'forearms',
    forearms_right: 'forearms',
    abdominals: 'abdominals',
    obliques_left: 'obliques',
    obliques_right: 'obliques',
    quadriceps_left: 'quadriceps',
    quadriceps_right: 'quadriceps',
    calves_left: 'calves_front',
    calves_right: 'calves_front',
    calves_back_left: 'calves_back',
    calves_back_right: 'calves_back',
    trapezius: 'traps',
    triceps_left: 'triceps',
    triceps_right: 'triceps',
    upper_back: 'traps',
    lats_left: 'lats',
    lats_right: 'lats',
    lower_back: 'lower_back',
    glutes: 'glutes',
    hamstrings_left: 'hamstrings',
    hamstrings_right: 'hamstrings',
    sternocleidomastoid_left: 'neck',
    sternocleidomastoid_right: 'neck',
    sternocleidomastoid_back_left: 'neck',
    sternocleidomastoid_back_right: 'neck',
    infraspinatus_left: 'traps',
    infraspinatus_right: 'traps',
    serratus_left: 'pectorals',
    serratus_right: 'pectorals',
    sartorius_left: 'quadriceps',
    sartorius_right: 'quadriceps',
    shins_left: 'calves_front',
    shins_right: 'calves_front',
    hands_left: 'forearms',
    hands_right: 'forearms',
    hands_back_left: 'forearms',
    hands_back_right: 'forearms',
    feet_left: 'calves_front',
    feet_right: 'calves_front',
    feet_back_left: 'calves_back',
    feet_back_right: 'calves_back',
  };

  const mapMuscleId = useCallback((id: string): string => {
    return MUSCLE_ID_MAP[id] || id;
  }, []);

  const getMuscleColor = useCallback((muscleId: string, status: MuscleStatus): { fill: string; stroke: string } => {
    const mappedId = mapMuscleId(muscleId);
    const isSelected = selectedMuscle === mappedId || highlightedMuscles.includes(mappedId);
    if (isSelected) {
      return { fill: COLORS.muscle.selected, stroke: COLORS.stroke.selected };
    }
    return {
      fill: COLORS.muscle[status] || COLORS.muscle.fresh,
      stroke: COLORS.stroke[status] || COLORS.stroke.fresh,
    };
  }, [selectedMuscle, highlightedMuscles, mapMuscleId]);

  const getMuscleStatus = useCallback((muscleId: string): MuscleStatus => {
    const mappedId = mapMuscleId(muscleId);
    const muscle = muscleGroups[mappedId];
    return muscle?.status || 'fresh';
  }, [muscleGroups, mapMuscleId]);

  const handlePress = useCallback((muscleId: string) => {
    const mappedId = mapMuscleId(muscleId);
    onMusclePress?.(mappedId);
  }, [onMusclePress, mapMuscleId]);

  const renderMuscle = useCallback((
    id: string,
    paths: string[],
    label?: string,
    centerX?: number,
    centerY?: number
  ) => {
    const status = getMuscleStatus(id);
    const colors = getMuscleColor(id, status);
    
    return (
      <G key={id}>
        {paths.map((d, index) => (
          <Path
            key={`${id}-${index}`}
            d={d}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={1.5}
            opacity={0.85}
            onPress={() => handlePress(id)}
          />
        ))}
        {showLabels && label && centerX && centerY && (
          <></>
        )}
      </G>
    );
  }, [getMuscleStatus, getMuscleColor, handlePress, showLabels]);

  const frontMuscles = useMemo(() => (
    <>
      {/* Neck muscles */}
      {renderMuscle('sternocleidomastoid_left', [
        'M178,70 C175,78 172,92 175,108 L188,108 C192,92 190,78 185,70 C180,62 176,60 178,70 Z',
        'M175,110 C172,120 170,135 176,145 L182,145 C186,135 184,120 180,112 C177,105 176,100 175,110 Z'
      ], 'SCM', 180, 100)}
      {renderMuscle('sternocleidomastoid_right', [
        'M222,70 C225,78 228,92 225,108 L212,108 C208,92 210,78 215,70 C220,62 224,60 222,70 Z',
        'M225,110 C228,120 230,135 224,145 L218,145 C214,135 216,120 220,112 C223,105 224,100 225,110 Z'
      ], 'SCM', 220, 100)}
      
      {/* Trapezius upper fibers */}
      {renderMuscle('trapezius_upper_left', [
        'M155,70 C148,78 142,95 145,130 C148,165 165,180 185,175 C200,170 195,140 180,110 C170,85 158,75 155,70 Z'
      ], 'Traps', 168, 125)}
      {renderMuscle('trapezius_upper_right', [
        'M245,70 C252,78 258,95 255,130 C252,165 235,180 215,175 C200,170 205,140 220,110 C230,85 242,75 245,70 Z'
      ], 'Traps', 232, 125)}
      
      {/* Deltoids - three heads */}
      {renderMuscle('deltoid_anterior_left', [
        'M130,90 C118,95 108,108 108,130 C108,155 125,170 145,165 C155,160 158,138 150,112 C145,95 138,85 130,90 Z'
      ])}
      {renderMuscle('deltoid_lateral_left', [
        'M140,85 C135,88 130,100 132,125 C135,150 148,165 160,160 C168,155 168,130 160,105 C155,90 145,82 140,85 Z'
      ])}
      {renderMuscle('deltoid_posterior_left', [
        'M145,95 C138,100 130,118 132,145 C135,170 152,182 165,178 C175,174 175,148 168,120 C162,102 150,92 145,95 Z'
      ])}
      
      {renderMuscle('deltoid_anterior_right', [
        'M270,90 C282,95 292,108 292,130 C292,155 275,170 255,165 C245,160 242,138 250,112 C255,95 262,85 270,90 Z'
      ])}
      {renderMuscle('deltoid_lateral_right', [
        'M260,85 C265,88 270,100 268,125 C265,150 252,165 240,160 C232,155 232,130 240,105 C245,90 255,82 260,85 Z'
      ])}
      {renderMuscle('deltoid_posterior_right', [
        'M255,95 C262,100 270,118 268,145 C265,170 248,182 235,178 C225,174 225,148 232,120 C238,102 250,92 255,95 Z'
      ])}
      
      {/* Pectorals - clavicular and sternocostal heads */}
      {renderMuscle('pectoralis_clavicular_left', [
        'M148,108 C145,102 162,92 180,95 C198,98 208,115 200,135 C188,152 168,148 155,135 C148,125 148,115 148,108 Z',
        'M155,115 C152,110 165,102 180,105 C193,108 200,125 195,142 C187,158 170,155 158,142 C152,132 152,122 155,115 Z'
      ], 'Pecs', 175, 125)}
      {renderMuscle('pectoralis_clavicular_right', [
        'M252,108 C255,102 238,92 220,95 C202,98 192,115 200,135 C212,152 232,148 245,135 C252,125 252,115 252,108 Z',
        'M245,115 C248,110 235,102 220,105 C207,108 200,125 205,142 C213,158 230,155 242,142 C248,132 248,122 245,115 Z'
      ], 'Pecs', 225, 125)}
      
      {renderMuscle('pectoralis_sternocostal_left', [
        'M150,130 C148,125 162,118 175,125 C188,132 195,155 185,180 C175,200 160,198 152,180 C148,160 148,140 150,130 Z'
      ])}
      {renderMuscle('pectoralis_sternocostal_right', [
        'M250,130 C252,125 238,118 225,125 C212,132 205,155 215,180 C225,200 240,198 248,180 C252,160 252,140 250,130 Z'
      ])}
      
      {/* Serratus anterior */}
      {renderMuscle('serratus_anterior_left', [
        'M142,140 C138,148 136,168 140,195 C145,215 158,225 168,218 C175,208 172,175 162,155 C155,145 146,140 142,140 Z',
        'M146,150 C143,158 141,178 145,200 C150,215 160,222 168,215 C174,205 170,175 162,158 C156,150 149,147 146,150 Z'
      ])}
      {renderMuscle('serratus_anterior_right', [
        'M258,140 C262,148 264,168 260,195 C255,215 242,225 232,218 C225,208 228,175 238,155 C245,145 254,140 258,140 Z',
        'M254,150 C257,158 259,178 255,200 C250,215 240,222 232,215 C226,205 230,175 238,158 C244,150 251,147 254,150 Z'
      ])}
      
      {/* Biceps brachii - two heads */}
      {renderMuscle('biceps_short_head_left', [
        'M118,148 C112,158 108,182 112,220 C118,255 135,265 145,250 C152,230 148,185 135,160 C128,152 122,148 118,148 Z'
      ], 'Biceps', 128, 200)}
      {renderMuscle('biceps_long_head_left', [
        'M125,155 C118,165 115,192 118,228 C122,258 138,268 148,255 C155,238 152,198 140,175 C132,165 126,162 125,155 Z'
      ], 'Biceps', 135, 210)}
      
      {renderMuscle('biceps_short_head_right', [
        'M282,148 C288,158 292,182 288,220 C282,255 265,265 255,250 C248,230 252,185 265,160 C272,152 278,148 282,148 Z'
      ], 'Biceps', 272, 200)}
      {renderMuscle('biceps_long_head_right', [
        'M275,155 C282,165 285,192 282,228 C278,258 262,268 252,255 C245,238 248,198 260,175 C268,165 274,162 275,155 Z'
      ], 'Biceps', 265, 210)}
      
      {/* Brachialis */}
      {renderMuscle('brachialis_left', [
        'M132,190 C125,198 122,220 125,250 C130,275 148,280 155,268 C160,250 158,215 145,195 C138,188 133,186 132,190 Z'
      ])}
      {renderMuscle('brachialis_right', [
        'M268,190 C275,198 278,220 275,250 C270,275 252,280 245,268 C240,250 242,215 255,195 C262,188 267,186 268,190 Z'
      ])}
      
      {/* Triceps brachii - three heads */}
      {renderMuscle('triceps_long_head_left', [
        'M125,155 C118,168 115,200 118,240 C122,270 140,278 150,265 C158,248 152,210 140,180 C130,165 123,160 125,155 Z'
      ])}
      {renderMuscle('triceps_lateral_head_left', [
        'M135,158 C128,172 125,205 130,242 C135,268 152,272 158,255 C163,235 158,200 148,175 C140,163 134,158 135,158 Z'
      ])}
      {renderMuscle('triceps_medial_head_left', [
        'M130,168 C125,180 123,210 126,240 C130,265 145,268 150,250 C154,235 150,210 142,185 C136,175 130,170 130,168 Z'
      ])}
      
      {renderMuscle('triceps_long_head_right', [
        'M275,155 C282,168 285,200 282,240 C278,270 260,278 250,265 C242,248 248,210 260,180 C270,165 277,160 275,155 Z'
      ])}
      {renderMuscle('triceps_lateral_head_right', [
        'M265,158 C272,172 275,205 270,242 C265,268 248,272 242,255 C237,235 242,200 252,175 C260,163 266,158 265,158 Z'
      ])}
      {renderMuscle('triceps_medial_head_right', [
        'M270,168 C275,180 277,210 274,240 C270,265 255,268 250,250 C246,235 250,210 258,185 C264,175 270,170 270,168 Z'
      ])}
      
      {/* Forearms - flexor and extensor compartments */}
      {renderMuscle('forearm_flexors_left', [
        'M110,265 C98,280 92,320 98,365 C105,395 122,405 138,390 C150,370 148,310 135,280 C125,268 116,265 110,265 Z',
        'M115,270 C108,282 105,310 108,350 C112,380 125,388 138,375 C148,358 145,295 132,268 C124,258 116,255 115,270 Z'
      ])}
      {renderMuscle('forearm_extensors_left', [
        'M105,268 C92,283 88,325 95,370 C102,400 120,408 132,392 C142,372 140,305 128,278 C120,268 110,262 105,268 Z'
      ])}
      
      {renderMuscle('forearm_flexors_right', [
        'M290,265 C302,280 308,320 302,365 C295,395 278,405 262,390 C250,370 252,310 265,280 C275,268 284,265 290,265 Z',
        'M285,270 C292,282 295,310 292,350 C288,380 275,388 262,375 C252,358 255,295 268,268 C276,258 284,255 285,270 Z'
      ])}
      {renderMuscle('forearm_extensors_right', [
        'M295,268 C308,283 312,325 305,370 C298,400 280,408 268,392 C258,372 260,305 272,278 C280,268 290,262 295,268 Z'
      ])}
      
      {/* Hands */}
      {renderMuscle('thenar_left', [
        'M88,340 C82,350 78,370 82,390 C88,410 102,418 112,410 C118,398 120,370 112,350 C105,342 95,338 88,340 Z'
      ])}
      {renderMuscle('hypothenar_left', [
        'M72,365 C65,375 62,395 66,415 C72,435 88,442 98,435 C106,422 108,395 98,375 C92,365 80,360 72,365 Z'
      ])}
      
      {renderMuscle('thenar_right', [
        'M312,340 C318,350 322,370 318,390 C312,410 298,418 288,410 C282,398 280,370 288,350 C295,342 305,338 312,340 Z'
      ])}
      {renderMuscle('hypothenar_right', [
        'M328,365 C335,375 338,395 334,415 C328,435 312,442 302,435 C294,422 292,395 302,375 C308,365 320,360 328,365 Z'
      ])}
      
      {/* Abdominal muscles */}
      {renderMuscle('rectus_abdominis_left', [
        'M175,175 C172,185 170,210 172,240 C175,265 188,278 200,278 C212,278 225,265 228,240 C230,210 228,185 225,178 C218,170 198,168 190,168 C182,168 172,172 175,175 Z'
      ], 'Abs', 188, 225)}
      {renderMuscle('rectus_abdominis_center_left', [
        'M185,175 C182,188 180,210 182,238 C185,260 195,270 200,268 C205,270 215,260 218,238 C220,210 218,188 215,180 C208,173 198,172 192,172 C186,172 178,175 185,175 Z'
      ], 'Abs', 200, 225)}
      {renderMuscle('rectus_abdominis_center_right', [
        'M215,175 C218,188 220,210 218,238 C215,260 205,270 200,268 C195,270 185,260 182,238 C180,210 182,188 185,180 C192,173 202,172 208,172 C214,172 222,175 215,175 Z'
      ], 'Abs', 212, 225)}
       {renderMuscle('rectus_abdominis_right', [
         'M225,175 C228,185 230,210 228,240 C225,265 212,278 200,278 C188,278 175,265 172,240 C170,210 172,185 175,178 C182,170 202,168 210,168 C218,168 228,172 225,175 Z'
        ], 'Abs', 212, 225)}
      </>
    ), [renderMuscle]);

   const backMuscles = useMemo(() => (
     <>
       {/* Trapezius - upper, middle, lower */}
      {renderMuscle('trapezius_upper', [
        'M155,60 C145,72 135,95 138,130 C140,165 165,185 200,182 C235,185 260,165 262,130 C265,95 255,72 245,60 C232,52 215,48 200,48 C185,48 168,52 155,60 Z'
      ], 'Traps', 200, 110)}
      {renderMuscle('trapezius_middle_left', [
        'M145,100 C138,112 135,135 140,160 C148,180 165,192 185,188 C200,184 198,162 185,135 C175,115 158,105 145,100 Z'
      ], 'Traps', 165, 145)}
      {renderMuscle('trapezius_middle_right', [
        'M255,100 C262,112 265,135 260,160 C252,180 235,192 215,188 C200,184 202,162 215,135 C225,115 242,105 255,100 Z'
      ], 'Traps', 235, 145)}
      {renderMuscle('trapezius_lower_left', [
        'M150,150 C143,160 140,185 145,215 C155,240 175,252 195,248 C210,244 208,218 195,190 C182,168 162,158 150,150 Z'
      ], 'Traps', 170, 200)}
      {renderMuscle('trapezius_lower_right', [
        'M250,150 C257,160 260,185 255,215 C245,240 225,252 205,248 C190,244 192,218 205,190 C218,168 238,158 250,150 Z'
      ], 'Traps', 230, 200)}
      
      {/* Levator scapulae */}
      {renderMuscle('levator_scapulae_left', [
        'M175,75 C172,85 170,100 175,120 C180,140 195,150 205,145 C212,138 210,115 200,95 C190,78 175,70 175,75 Z'
      ])}
      {renderMuscle('levator_scapulae_right', [
        'M225,75 C228,85 230,100 225,120 C220,140 205,150 195,145 C188,138 190,115 200,95 C210,78 225,70 225,75 Z'
      ])}
      
      {/* Rhomboids */}
      {renderMuscle('rhomboid_major_left', [
        'M165,140 C160,150 158,175 165,205 C172,230 185,242 200,238 C212,232 210,205 200,180 C192,158 178,148 165,140 Z'
      ], 'Upper Back', 180, 190)}
      {renderMuscle('rhomboid_major_right', [
        'M235,140 C240,150 242,175 235,205 C228,230 215,242 200,238 C188,232 190,205 200,180 C208,158 222,148 235,140 Z'
      ], 'Upper Back', 220, 190)}
      
      {/* Posterior deltoids (back view) */}
      {renderMuscle('deltoid_posterior_left', [
        'M138,95 C130,102 125,122 128,150 C132,178 150,190 162,186 C172,182 172,156 165,128 C158,108 145,92 138,95 Z'
      ])}
      {renderMuscle('deltoid_posterior_right', [
        'M262,95 C270,102 275,122 272,150 C268,178 250,190 238,186 C228,182 228,156 235,128 C242,108 255,92 262,95 Z'
      ])}
      
      {/* Infraspinatus and teres minor */}
      {renderMuscle('infraspinatus_left', [
        'M148,115 C142,125 138,152 142,185 C148,208 168,220 182,212 C195,203 198,175 185,148 C175,130 160,118 148,115 Z'
      ])}
      {renderMuscle('infraspinatus_right', [
        'M252,115 C258,125 262,152 258,185 C252,208 232,220 218,212 C205,203 202,175 215,148 C225,130 240,118 252,115 Z'
      ])}
      
      {/* Supraspinatus */}
      {renderMuscle('supraspinatus_left', [
        'M155,105 C150,112 148,130 152,155 C157,178 172,188 185,184 C195,180 192,158 180,135 C168,118 158,110 155,105 Z'
      ])}
      {renderMuscle('supraspinatus_right', [
        'M245,105 C250,112 252,130 248,155 C243,178 228,188 215,184 C205,180 208,158 220,135 C232,118 242,110 245,105 Z'
      ])}
      
      {/* Triceps - three heads */}
      {renderMuscle('triceps_long_head_back_left', [
        'M125,160 C118,172 115,210 118,255 C122,290 142,300 150,280 C158,258 152,215 140,180 C130,165 123,158 125,160 Z'
      ], 'Triceps', 135, 225)}
      {renderMuscle('triceps_lateral_head_back_left', [
        'M135,165 C128,178 125,215 130,255 C136,288 155,295 162,275 C168,252 162,210 150,180 C142,168 135,162 135,165 Z'
      ], 'Triceps', 148, 228)}
      
      {renderMuscle('triceps_long_head_back_right', [
        'M275,160 C282,172 285,210 282,255 C278,290 258,300 250,280 C242,258 248,215 260,180 C270,165 277,158 275,160 Z'
      ], 'Triceps', 265, 225)}
      {renderMuscle('triceps_lateral_head_back_right', [
        'M265,165 C272,178 275,215 270,255 C264,288 245,295 238,275 C232,252 238,210 250,180 C258,168 265,162 265,165 Z'
      ], 'Triceps', 252, 228)}
      
      {/* Latissimus dorsi */}
      {renderMuscle('latissimus_dorsi_left', [
        'M135,180 C128,200 125,252 138,302 C150,345 175,362 195,355 C210,345 208,298 195,255 C182,218 165,200 148,190 C138,185 132,185 135,180 Z',
        'M142,195 C136,212 134,260 145,300 C155,335 175,345 192,338 C205,328 202,285 190,245 C178,210 162,195 150,188 C142,183 137,183 142,195 Z'
      ], 'Lats', 165, 270)}
      {renderMuscle('latissimus_dorsi_right', [
        'M265,180 C272,200 275,252 262,302 C250,345 225,362 205,355 C190,345 192,298 205,255 C218,218 235,200 252,190 C262,185 268,185 265,180 Z',
        'M258,195 C264,212 266,260 255,300 C245,335 225,345 208,338 C195,328 198,285 210,245 C222,210 238,195 250,188 C258,183 263,183 258,195 Z'
      ], 'Lats', 235, 270)}
      
      {/* Teres major */}
      {renderMuscle('teres_major_left', [
        'M148,215 C142,230 140,260 148,290 C155,315 172,328 185,322 C195,312 192,278 180,248 C168,228 152,218 148,215 Z'
      ], 'Lats', 162, 275)}
      {renderMuscle('teres_major_right', [
        'M252,215 C258,230 260,260 252,290 C245,315 228,328 215,322 C205,312 208,278 220,248 C232,228 248,218 252,215 Z'
      ], 'Lats', 238, 275)}
      
      {/* Erector spinae */}
      {renderMuscle('erector_spinae_left', [
        'M170,280 C165,295 162,325 168,358 C175,385 190,398 200,396 C210,398 225,385 232,358 C238,325 235,295 230,280 C218,265 205,262 200,262 C195,262 182,265 170,280 Z',
        'M168,340 C163,352 161,375 166,398 C172,415 185,422 200,420 C215,422 228,415 234,398 C239,375 237,352 232,340 C222,328 210,325 200,325 C190,325 178,328 168,340 Z'
      ], 'Lower Back', 185, 340)}
      {renderMuscle('erector_spinae_right', [
        'M230,280 C235,295 238,325 232,358 C225,385 210,398 200,396 C190,398 175,385 168,358 C162,325 165,295 170,280 C182,265 195,262 200,262 C205,262 218,265 230,280 Z',
        'M232,340 C237,352 239,375 234,398 C228,415 215,422 200,420 C185,422 172,415 166,398 C161,375 163,352 168,340 C178,328 190,325 200,325 C210,325 222,328 232,340 Z'
      ], 'Lower Back', 215, 340)}
      
      {/* Gluteus maximus */}
      {renderMuscle('gluteus_maximus_left', [
        'M142,355 C130,378 125,425 138,478 C152,525 178,548 195,543 C208,536 205,495 188,450 C175,415 158,398 145,385 C135,375 130,368 142,355 Z',
        'M150,370 C138,390 135,430 148,475 C162,515 185,528 200,523 C212,516 208,480 192,450 C178,422 162,408 152,398 C144,390 140,382 150,370 Z'
      ], 'Glutes', 168, 460)}
      {renderMuscle('gluteus_maximus_right', [
        'M258,355 C270,378 275,425 262,478 C248,525 222,548 205,543 C192,536 195,495 212,450 C225,415 242,398 255,385 C265,375 270,368 258,355 Z',
        'M250,370 C262,390 265,430 252,475 C238,515 215,528 200,523 C188,516 192,480 208,450 C222,422 238,408 248,398 C256,390 260,382 250,370 Z'
      ], 'Glutes', 232, 460)}
      
      {/* Gluteus medius */}
      {renderMuscle('gluteus_medius_left', [
        'M160,380 C152,395 148,420 158,455 C168,485 190,495 205,490 C218,483 215,455 200,425 C188,402 172,392 162,380 Z'
      ], 'Glutes', 180, 445)}
      {renderMuscle('gluteus_medius_right', [
        'M240,380 C248,395 252,420 242,455 C232,485 210,495 195,490 C182,483 185,455 200,425 C212,402 228,392 238,380 Z'
      ], 'Glutes', 220, 445)}
      
      {/* Hamstrings */}
      {renderMuscle('biceps_femoris_left', [
        'M155,440 C145,470 142,530 152,590 C162,640 185,665 200,658 C212,648 215,598 205,530 C195,480 175,455 160,445 Z'
      ], 'Hamstrings', 175, 555)}
      {renderMuscle('biceps_femoris_right', [
        'M245,440 C255,470 258,530 248,590 C238,640 215,665 200,658 C188,648 185,598 195,530 C205,480 225,455 240,445 Z'
      ], 'Hamstrings', 225, 555)}
      
      {renderMuscle('semitendinosus_left', [
        'M158,445 C150,475 148,540 156,595 C164,635 185,652 200,645 C212,638 210,585 200,520 C192,475 175,452 162,442 Z'
      ], 'Hamstrings', 178, 560)}
      {renderMuscle('semitendinosus_right', [
        'M242,445 C250,475 252,540 244,595 C236,635 215,652 200,645 C188,638 190,585 200,520 C208,475 225,452 238,442 Z'
      ], 'Hamstrings', 222, 560)}
      
      {renderMuscle('semimembranosus_left', [
        'M160,450 C152,480 150,548 158,608 C165,655 188,670 200,663 C210,656 208,600 198,535 C190,488 172,465 162,455 Z'
      ], 'Hamstrings', 180, 580)}
      {renderMuscle('semimembranosus_right', [
        'M240,450 C248,480 250,548 242,608 C235,655 212,670 200,663 C190,656 192,600 202,535 C210,488 228,465 238,455 Z'
      ], 'Hamstrings', 220, 580)}
      
      {/* Popliteus */}
      {renderMuscle('popliteus_left', [
        'M170,600 C165,615 163,635 168,655 C175,672 188,678 200,675 C208,670 210,650 205,630 C200,618 185,615 180,612 C176,610 172,608 170,600 Z'
      ])}
      {renderMuscle('popliteus_right', [
        'M230,600 C235,615 237,635 232,655 C225,672 212,678 200,675 C192,670 190,650 195,630 C200,618 215,615 220,612 C224,610 228,608 230,600 Z'
      ])}
      
      {/* Gastrocnemius */}
      {renderMuscle('gastrocnemius_medial_left', [
        'M162,635 C152,655 148,695 158,740 C168,775 188,788 200,785 C212,782 215,745 205,700 C195,660 178,640 165,635 Z'
      ], 'Calves', 178, 710)}
      {renderMuscle('gastrocnemius_lateral_left', [
        'M168,638 C158,658 155,700 165,745 C175,780 192,790 200,787 C208,784 212,750 202,708 C192,670 178,650 167,645 Z'
      ], 'Calves', 180, 720)}
      
      {renderMuscle('gastrocnemius_medial_right', [
        'M238,635 C248,655 252,695 242,740 C232,775 212,788 200,785 C188,782 185,745 195,700 C205,660 222,640 235,635 Z'
      ], 'Calves', 222, 710)}
      {renderMuscle('gastrocnemius_lateral_right', [
        'M232,638 C242,658 245,700 235,745 C225,780 208,790 200,787 C192,784 188,750 198,708 C208,670 222,650 233,645 Z'
      ], 'Calves', 220, 720)}
      
      {/* Soleus */}
      {renderMuscle('soleus_left', [
        'M170,700 C162,715 160,740 168,770 C178,800 195,810 205,807 C212,802 215,770 208,735 C200,710 185,702 175,700 C170,698 165,698 170,700 Z'
      ])}
      {renderMuscle('soleus_right', [
        'M230,700 C238,715 240,740 232,770 C222,800 205,810 195,807 C188,802 185,770 192,735 C200,710 215,702 225,700 C230,698 235,698 230,700 Z'
      ])}
      
      {/* Tibialis posterior */}
      {renderMuscle('tibialis_posterior_left', [
        'M178,720 C170,738 168,760 175,790 C182,815 195,825 205,822 C212,817 215,790 208,760 C200,740 185,732 180,728 C176,726 172,724 178,720 Z'
      ])}
      {renderMuscle('tibialis_posterior_right', [
        'M222,720 C230,738 232,760 225,790 C218,815 205,825 195,822 C188,817 185,790 192,760 C200,740 215,732 220,728 C224,726 228,724 222,720 Z'
      ])}
      
      {/* Forearms back */}
      {renderMuscle('triceps_brachii_outer_left', [
        'M110,260 C98,275 92,315 98,360 C105,390 122,400 138,385 C150,365 148,298 135,268 C125,258 116,255 110,260 Z'
      ])}
      {renderMuscle('triceps_brachii_outer_right', [
        'M290,260 C302,275 308,315 302,360 C295,390 278,400 262,385 C250,365 252,298 265,268 C275,258 284,255 290,260 Z'
      ])}
      
      {/* Extensor compartment */}
      {renderMuscle('extensor_carpi_radialis_left', [
        'M108,268 C95,283 90,325 98,370 C105,400 122,408 135,392 C145,372 142,305 130,278 C122,268 112,262 108,268 Z'
      ])}
      {renderMuscle('extensor_carpi_radialis_right', [
        'M292,268 C305,283 310,325 302,370 C295,400 278,408 265,392 C255,372 258,305 270,278 C278,268 288,262 292,268 Z'
      ])}
      
      {/* Hands back */}
      {renderMuscle('extensor_digitorum_left', [
        'M100,350 C92,360 88,380 92,400 C98,420 112,428 122,420 C130,410 128,385 120,360 C112,350 105,345 100,350 Z'
      ])}
      {renderMuscle('extensor_digitorum_right', [
        'M300,350 C308,360 312,380 308,400 C302,420 288,428 278,420 C270,410 272,385 280,360 C288,350 295,345 300,350 Z'
      ])}
      
      {/* Gluteus minimus */}
      {renderMuscle('gluteus_minimus_left', [
        'M175,400 C168,415 165,435 172,460 C180,480 198,488 210,484 C218,478 215,456 202,435 C192,418 180,412 176,408 C172,406 168,404 175,400 Z'
      ])}
      {renderMuscle('gluteus_minimus_right', [
        'M225,400 C232,415 235,435 228,460 C220,480 202,488 190,484 C182,478 185,456 198,435 C208,418 220,412 224,408 C228,406 232,404 225,400 Z'
      ])}
      
      {/* Iliotibial tract */}
      {renderMuscle('it_band_left', [
        'M145,420 C140,440 138,480 148,530 C158,575 178,590 195,585 C208,578 205,540 190,495 C178,460 162,445 150,438 C145,435 142,432 145,420 Z'
      ])}
      {renderMuscle('it_band_right', [
        'M255,420 C260,440 262,480 252,530 C242,575 222,590 205,585 C192,578 195,540 210,495 C222,460 238,445 250,438 C255,435 258,432 255,420 Z'
      ])}
      
      {/* Feet */}
      {renderMuscle('foot_dorsum_left', [
        'M172,720 C165,730 162,748 168,768 C175,788 190,798 200,795 C208,790 210,768 205,745 C198,728 180,722 175,720 C170,718 165,718 172,720 Z'
      ])}
      {renderMuscle('foot_plantar_left', [
        'M175,740 C168,752 165,775 172,800 C180,820 195,828 208,822 C218,814 220,788 210,760 C200,740 182,735 178,732 C174,730 170,730 175,740 Z'
      ])}
      
      {renderMuscle('foot_dorsum_right', [
        'M228,720 C235,730 238,748 232,768 C225,788 210,798 200,795 C192,790 190,768 195,745 C202,728 220,722 225,720 C230,718 235,718 228,720 Z'
      ])}
      {renderMuscle('foot_plantar_right', [
        'M225,740 C232,752 235,775 228,800 C220,820 205,828 192,822 C182,814 180,788 190,760 C200,740 218,735 222,732 C226,730 230,730 225,740 Z'
      ])}
    </>
  ), [renderMuscle]);

  const bodyOutline = useMemo(() => {
    const maleFront = `M200,15 C175,15 155,35 155,65 C155,85 165,100 185,108 L125,125 C100,140 85,170 85,220 L85,300 L75,400 L70,500 L85,540 L130,540 L150,440 L165,350 L180,260 L200,160 L220,260 L235,350 L250,440 L270,540 L315,540 L330,500 L325,400 L315,300 L315,220 C315,170 300,140 275,125 L215,108 C235,100 245,85 245,65 C245,35 225,15 200,15 Z`;
    const maleBack = `M200,15 C175,15 155,35 155,65 C155,85 165,100 185,108 L125,125 C100,140 85,170 85,220 L85,300 L75,400 L70,500 L85,540 L130,540 L150,440 L165,350 L180,260 L200,160 L220,260 L235,350 L250,440 L270,540 L315,540 L330,500 L325,400 L315,300 L315,220 C315,170 300,140 275,125 L215,108 C235,100 245,85 245,65 C245,35 225,15 200,15 Z`;
    
    const femaleFront = `M200,20 C170,20 150,45 150,70 C150,95 165,110 185,115 L135,130 C110,145 95,175 95,230 L90,320 L82,420 L80,510 L95,545 L135,545 L152,455 L165,370 L180,275 L200,175 L220,275 L235,370 L248,455 L265,545 L305,545 L320,510 L308,420 L300,320 L295,230 C295,175 280,145 255,130 L205,115 C225,110 240,95 240,70 C240,45 220,20 200,20 Z`;
    const femaleBack = `M200,20 C170,20 150,45 150,70 C150,95 165,110 185,115 L135,130 C110,145 95,175 95,230 L90,320 L82,420 L80,510 L95,545 L135,545 L152,455 L165,370 L180,275 L200,175 L220,275 L235,370 L248,455 L265,545 L305,545 L320,510 L308,420 L300,320 L295,230 C295,175 280,145 255,130 L205,115 C225,110 240,95 240,70 C240,45 220,20 200,20 Z`;

    if (gender === 'female') {
      return side === 'front' ? femaleFront : femaleBack;
    }
    return side === 'front' ? maleFront : maleBack;
  }, [gender, side]);

  const neckPath = side === 'front'
    ? 'M180,60 C178,70 178,90 182,105 L218,105 C222,90 222,70 220,60 C215,50 185,50 180,60 Z'
    : 'M180,60 C178,70 178,90 182,105 L218,105 C222,90 222,70 220,60 C215,50 185,50 180,60 Z';

  return (
    <View style={styles.container}>
      <Svg
        width={size}
        height={size * aspectRatio}
        viewBox={viewBox}
      >
        <Defs>
          <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.skin} />
            <Stop offset="100%" stopColor={COLORS.skinDark} />
          </LinearGradient>
          <LinearGradient id="bodyOutlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.skinDark} />
            <Stop offset="50%" stopColor={COLORS.skin} />
            <Stop offset="100%" stopColor={COLORS.skinDark} />
          </LinearGradient>
        </Defs>

        <Path
          d={bodyOutline}
          fill="url(#skinGradient)"
          stroke={COLORS.outline}
          strokeWidth={2}
        />

        <Path
          d={neckPath}
          fill="url(#skinGradient)"
          stroke={COLORS.outline}
          strokeWidth={1.5}
        />

        {side === 'front' ? frontMuscles : backMuscles}

        <Path
          d={bodyOutline}
          fill="transparent"
          stroke={COLORS.outline}
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnatomyAvatar;
