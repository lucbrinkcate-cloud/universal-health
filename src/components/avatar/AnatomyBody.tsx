import React from 'react';
import Svg, { Path, G, Defs, ClipPath } from 'react-native-svg';
import { BodyView } from '../../stores/avatarStore';

interface AnatomyBodyProps {
  centerX?: number;
  scale?: number;
  bodyView: BodyView;
}

export const AnatomyBody: React.FC<AnatomyBodyProps> = ({
  centerX = 110,
  scale = 1,
  bodyView,
}) => {
  const bodyOutline = `
    M ${centerX - 20 * scale} ${25 * scale}
    C ${centerX - 25 * scale} ${10 * scale} ${centerX + 25 * scale} ${10 * scale} ${centerX + 20 * scale} ${25 * scale}
    C ${centerX + 22 * scale} ${35 * scale} ${centerX + 10 * scale} ${40 * scale} ${centerX} ${40 * scale}
    C ${centerX - 10 * scale} ${40 * scale} ${centerX - 22 * scale} ${35 * scale} ${centerX - 20 * scale} ${25 * scale}
    Z
    M ${centerX - 8 * scale} ${42 * scale}
    L ${centerX + 8 * scale} ${42 * scale}
    L ${centerX + 10 * scale} ${48 * scale}
    L ${centerX - 10 * scale} ${48 * scale}
    Z
    M ${centerX - 15 * scale} ${50 * scale}
    L ${centerX - 35 * scale} ${55 * scale}
    L ${centerX - 50 * scale} ${110 * scale}
    L ${centerX - 40 * scale} ${115 * scale}
    L ${centerX - 30 * scale} ${65 * scale}
    M ${centerX + 15 * scale} ${50 * scale}
    L ${centerX + 35 * scale} ${55 * scale}
    L ${centerX + 50 * scale} ${110 * scale}
    L ${centerX + 40 * scale} ${115 * scale}
    L ${centerX + 30 * scale} ${65 * scale}
    M ${centerX - 18 * scale} ${50 * scale}
    L ${centerX + 18 * scale} ${50 * scale}
    L ${centerX + 25 * scale} ${95 * scale}
    L ${centerX - 25 * scale} ${95 * scale}
    Z
    M ${centerX - 22 * scale} ${97 * scale}
    L ${centerX + 22 * scale} ${97 * scale}
    L ${centerX + 20 * scale} ${135 * scale}
    L ${centerX - 20 * scale} ${135 * scale}
    Z
    M ${centerX - 18 * scale} ${137 * scale}
    L ${centerX - 12 * scale} ${137 * scale}
    L ${centerX - 15 * scale} ${195 * scale}
    L ${centerX - 22 * scale} ${195 * scale}
    Z
    M ${centerX + 18 * scale} ${137 * scale}
    L ${centerX + 12 * scale} ${137 * scale}
    L ${centerX + 15 * scale} ${195 * scale}
    L ${centerX + 22 * scale} ${195 * scale}
    Z
    M ${centerX - 15 * scale} ${197 * scale}
    L ${centerX - 10 * scale} ${197 * scale}
    L ${centerX - 12 * scale} ${230 * scale}
    L ${centerX - 18 * scale} ${230 * scale}
    Z
    M ${centerX + 15 * scale} ${197 * scale}
    L ${centerX + 10 * scale} ${197 * scale}
    L ${centerX + 12 * scale} ${230 * scale}
    L ${centerX + 18 * scale} ${230 * scale}
    Z
  `;

  const frontMuscles = {
    deltoids: `
      M ${centerX - 35 * scale} ${50 * scale}
      Q ${centerX - 45 * scale} ${55 * scale} ${centerX - 48 * scale} ${65 * scale}
      Q ${centerX - 45 * scale} ${75 * scale} ${centerX - 35 * scale} ${80 * scale}
      L ${centerX - 18 * scale} ${60 * scale}
      Q ${centerX - 28 * scale} ${50 * scale} ${centerX - 35 * scale} ${50 * scale}
      M ${centerX + 35 * scale} ${50 * scale}
      Q ${centerX + 45 * scale} ${55 * scale} ${centerX + 48 * scale} ${65 * scale}
      Q ${centerX + 45 * scale} ${75 * scale} ${centerX + 35 * scale} ${80 * scale}
      L ${centerX + 18 * scale} ${60 * scale}
      Q ${centerX + 28 * scale} ${50 * scale} ${centerX + 35 * scale} ${50 * scale}
    `,
    biceps: `
      M ${centerX - 48 * scale} ${68 * scale}
      Q ${centerX - 55 * scale} ${85 * scale} ${centerX - 50 * scale} ${100 * scale}
      L ${centerX - 42 * scale} ${100 * scale}
      Q ${centerX - 45 * scale} ${85 * scale} ${centerX - 40 * scale} ${70 * scale}
      Z
      M ${centerX + 48 * scale} ${68 * scale}
      Q ${centerX + 55 * scale} ${85 * scale} ${centerX + 50 * scale} ${100 * scale}
      L ${centerX + 42 * scale} ${100 * scale}
      Q ${centerX + 45 * scale} ${85 * scale} ${centerX + 40 * scale} ${70 * scale}
      Z
    `,
    pectorals: `
      M ${centerX - 18 * scale} ${52 * scale}
      Q ${centerX - 22 * scale} ${55 * scale} ${centerX - 22 * scale} ${70 * scale}
      Q ${centerX - 18 * scale} ${80 * scale} ${centerX - 5 * scale} ${78 * scale}
      L ${centerX - 3 * scale} ${55 * scale}
      Z
      M ${centerX + 18 * scale} ${52 * scale}
      Q ${centerX + 22 * scale} ${55 * scale} ${centerX + 22 * scale} ${70 * scale}
      Q ${centerX + 18 * scale} ${80 * scale} ${centerX + 5 * scale} ${78 * scale}
      L ${centerX + 3 * scale} ${55 * scale}
      Z
    `,
    abdominals: `
      M ${centerX - 12 * scale} ${80 * scale}
      L ${centerX + 12 * scale} ${80 * scale}
      L ${centerX + 10 * scale} ${130 * scale}
      L ${centerX - 10 * scale} ${130 * scale}
      Z
      M ${centerX - 8 * scale} ${85 * scale} L ${centerX + 8 * scale} ${85 * scale}
      M ${centerX - 9 * scale} ${95 * scale} L ${centerX + 9 * scale} ${95 * scale}
      M ${centerX - 9 * scale} ${105 * scale} L ${centerX + 9 * scale} ${105 * scale}
      M ${centerX - 10 * scale} ${118 * scale} L ${centerX + 10 * scale} ${118 * scale}
    `,
    forearms: `
      M ${centerX - 50 * scale} ${102 * scale}
      L ${centerX - 52 * scale} ${105 * scale}
      L ${centerX - 48 * scale} ${145 * scale}
      L ${centerX - 42 * scale} ${145 * scale}
      L ${centerX - 45 * scale} ${105 * scale}
      Z
      M ${centerX + 50 * scale} ${102 * scale}
      L ${centerX + 52 * scale} ${105 * scale}
      L ${centerX + 48 * scale} ${145 * scale}
      L ${centerX + 42 * scale} ${145 * scale}
      L ${centerX + 45 * scale} ${105 * scale}
      Z
    `,
    quadriceps: `
      M ${centerX - 20 * scale} ${137 * scale}
      L ${centerX - 8 * scale} ${137 * scale}
      L ${centerX - 10 * scale} ${190 * scale}
      L ${centerX - 22 * scale} ${190 * scale}
      Z
      M ${centerX + 20 * scale} ${137 * scale}
      L ${centerX + 8 * scale} ${137 * scale}
      L ${centerX + 10 * scale} ${190 * scale}
      L ${centerX + 22 * scale} ${190 * scale}
      Z
    `,
    calves_front: `
      M ${centerX - 20 * scale} ${195 * scale}
      L ${centerX - 12 * scale} ${195 * scale}
      L ${centerX - 14 * scale} ${225 * scale}
      L ${centerX - 20 * scale} ${225 * scale}
      Z
      M ${centerX + 20 * scale} ${195 * scale}
      L ${centerX + 12 * scale} ${195 * scale}
      L ${centerX + 14 * scale} ${225 * scale}
      L ${centerX + 20 * scale} ${225 * scale}
      Z
    `,
  };

  const backMuscles = {
    traps: `
      M ${centerX - 15 * scale} ${30 * scale}
      Q ${centerX - 25 * scale} ${35 * scale} ${centerX - 28 * scale} ${50 * scale}
      Q ${centerX - 30 * scale} ${70 * scale} ${centerX} ${75 * scale}
      Q ${centerX + 30 * scale} ${70 * scale} ${centerX + 28 * scale} ${50 * scale}
      Q ${centerX + 25 * scale} ${35 * scale} ${centerX + 15 * scale} ${30 * scale}
      Z
    `,
    triceps: `
      M ${centerX - 48 * scale} ${68 * scale}
      Q ${centerX - 55 * scale} ${85 * scale} ${centerX - 50 * scale} ${100 * scale}
      L ${centerX - 42 * scale} ${100 * scale}
      Q ${centerX - 45 * scale} ${85 * scale} ${centerX - 40 * scale} ${70 * scale}
      Z
      M ${centerX + 48 * scale} ${68 * scale}
      Q ${centerX + 55 * scale} ${85 * scale} ${centerX + 50 * scale} ${100 * scale}
      L ${centerX + 42 * scale} ${100 * scale}
      Q ${centerX + 45 * scale} ${85 * scale} ${centerX + 40 * scale} ${70 * scale}
      Z
    `,
    lats: `
      M ${centerX - 18 * scale} ${55 * scale}
      Q ${centerX - 28 * scale} ${75 * scale} ${centerX - 25 * scale} ${105 * scale}
      L ${centerX - 5 * scale} ${100 * scale}
      L ${centerX - 5 * scale} ${55 * scale}
      Z
      M ${centerX + 18 * scale} ${55 * scale}
      Q ${centerX + 28 * scale} ${75 * scale} ${centerX + 25 * scale} ${105 * scale}
      L ${centerX + 5 * scale} ${100 * scale}
      L ${centerX + 5 * scale} ${55 * scale}
      Z
    `,
    lower_back: `
      M ${centerX - 20 * scale} ${105 * scale}
      L ${centerX + 20 * scale} ${105 * scale}
      L ${centerX + 18 * scale} ${135 * scale}
      L ${centerX - 18 * scale} ${135 * scale}
      Z
    `,
    glutes: `
      M ${centerX - 20 * scale} ${137 * scale}
      L ${centerX + 20 * scale} ${137 * scale}
      L ${centerX + 18 * scale} ${165 * scale}
      L ${centerX - 18 * scale} ${165 * scale}
      Z
      M ${centerX} ${137 * scale}
      L ${centerX} ${165 * scale}
    `,
    hamstrings: `
      M ${centerX - 20 * scale} ${167 * scale}
      L ${centerX - 8 * scale} ${167 * scale}
      L ${centerX - 10 * scale} ${215 * scale}
      L ${centerX - 22 * scale} ${215 * scale}
      Z
      M ${centerX + 20 * scale} ${167 * scale}
      L ${centerX + 8 * scale} ${167 * scale}
      L ${centerX + 10 * scale} ${215 * scale}
      L ${centerX + 22 * scale} ${215 * scale}
      Z
    `,
    calves_back: `
      M ${centerX - 20 * scale} ${217 * scale}
      L ${centerX - 10 * scale} ${217 * scale}
      L ${centerX - 12 * scale} ${250 * scale}
      L ${centerX - 20 * scale} ${250 * scale}
      Z
      M ${centerX + 20 * scale} ${217 * scale}
      L ${centerX + 10 * scale} ${217 * scale}
      L ${centerX + 12 * scale} ${250 * scale}
      L ${centerX + 20 * scale} ${250 * scale}
      Z
    `,
  };

  const muscles = bodyView === 'front' ? frontMuscles : backMuscles;

  return (
    <G>
      <Path
        d={bodyOutline}
        fill="#E8F4F8"
        stroke="#5B9BD5"
        strokeWidth={1.5}
      />
    </G>
  );
};

export const MUSCLE_PATHS = {
  front: {
    deltoids: `
      M 75 50 Q 65 55 62 65 Q 65 75 75 80 L 92 60 Q 82 50 75 50
      M 145 50 Q 155 55 158 65 Q 155 75 145 80 L 128 60 Q 138 50 145 50
    `,
    biceps: `
      M 62 68 Q 55 85 60 100 L 68 100 Q 65 85 70 70 Z
      M 158 68 Q 165 85 160 100 L 152 100 Q 155 85 150 70 Z
    `,
    pectorals: `
      M 92 52 Q 88 55 88 70 Q 92 80 105 78 L 107 55 Z
      M 128 52 Q 132 55 132 70 Q 128 80 115 78 L 113 55 Z
    `,
    abdominals: `
      M 98 80 L 122 80 L 120 130 L 100 130 Z
    `,
    forearms: `
      M 60 102 L 58 105 L 62 145 L 68 145 L 65 105 Z
      M 160 102 L 162 105 L 158 145 L 152 145 L 155 105 Z
    `,
    quadriceps: `
      M 90 137 L 102 137 L 100 190 L 88 190 Z
      M 130 137 L 118 137 L 120 190 L 132 190 Z
    `,
    calves_front: `
      M 90 195 L 98 195 L 96 225 L 90 225 Z
      M 130 195 L 122 195 L 124 225 L 130 225 Z
    `,
  },
  back: {
    traps: `
      M 95 30 Q 85 35 82 50 Q 80 70 110 75 Q 140 70 138 50 Q 135 35 125 30 Z
    `,
    triceps: `
      M 62 68 Q 55 85 60 100 L 68 100 Q 65 85 70 70 Z
      M 158 68 Q 165 85 160 100 L 152 100 Q 155 85 150 70 Z
    `,
    lats: `
      M 92 55 Q 82 75 85 105 L 105 100 L 105 55 Z
      M 128 55 Q 138 75 135 105 L 115 100 L 115 55 Z
    `,
    lower_back: `
      M 90 105 L 130 105 L 128 135 L 92 135 Z
    `,
    glutes: `
      M 90 137 L 130 137 L 128 165 L 92 165 Z M 110 137 L 110 165
    `,
    hamstrings: `
      M 90 167 L 102 167 L 100 215 L 88 215 Z
      M 130 167 L 118 167 L 120 215 L 132 215 Z
    `,
    calves_back: `
      M 90 217 L 100 217 L 98 250 L 90 250 Z
      M 130 217 L 120 217 L 122 250 L 130 250 Z
    `,
  },
};

export default AnatomyBody;
