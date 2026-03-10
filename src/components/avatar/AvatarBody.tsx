import React from 'react';
import Svg, { Path, Ellipse, G } from 'react-native-svg';
import { BodyProportions } from '../../utils/bodyProportions';
import { BodyType } from '../../stores/avatarStore';
import { darkenColor } from './colorUtils';

interface AvatarBodyProps {
  proportions: BodyProportions;
  skinTone: string;
  bodyType: BodyType;
  centerX?: number;
}

export const AvatarBody: React.FC<AvatarBodyProps> = ({
  proportions,
  skinTone,
  bodyType,
  centerX = 110,
}) => {
  const { scale, shoulderWidth, chestWidth, waistWidth, hipWidth, armLength, armWidth, legLength, legWidth, handSize, footSize } = proportions;
  
  const shoulderY = 70 * scale;
  const chestY = 95 * scale;
  const waistY = 130 * scale;
  const hipY = 155 * scale;
  const armPitY = shoulderY + 15 * scale;
  const handY = armPitY + armLength;
  const legStartY = hipY + 10 * scale;
  const footY = legStartY + legLength;
  
  const halfShoulder = shoulderWidth / 2;
  const halfChest = chestWidth / 2;
  const halfWaist = waistWidth / 2;
  const halfHip = hipWidth / 2;

  const typeModifiers = {
    slim: { shoulderMod: 0.9, waistMod: 0.85, hipMod: 0.9 },
    average: { shoulderMod: 1, waistMod: 1, hipMod: 1 },
    athletic: { shoulderMod: 1.15, waistMod: 0.9, hipMod: 1 },
    curvy: { shoulderMod: 1, waistMod: 1.1, hipMod: 1.2 },
  };
  
  const mod = typeModifiers[bodyType];

  const torsoPath = `
    M ${centerX - halfShoulder * mod.shoulderMod} ${shoulderY}
    Q ${centerX - halfChest * mod.shoulderMod - 5 * scale} ${chestY - 10 * scale} ${centerX - halfChest} ${chestY}
    Q ${centerX - halfWaist - 10 * scale} ${waistY - 10 * scale} ${centerX - halfWaist * mod.waistMod} ${waistY}
    Q ${centerX - halfHip * mod.hipMod} ${waistY + 15 * scale} ${centerX - halfHip * mod.hipMod} ${hipY}
    L ${centerX + halfHip * mod.hipMod} ${hipY}
    Q ${centerX + halfHip * mod.hipMod} ${waistY + 15 * scale} ${centerX + halfWaist * mod.waistMod} ${waistY}
    Q ${centerX + halfWaist + 10 * scale} ${waistY - 10 * scale} ${centerX + halfChest} ${chestY}
    Q ${centerX + halfChest * mod.shoulderMod + 5 * scale} ${chestY - 10 * scale} ${centerX + halfShoulder * mod.shoulderMod} ${shoulderY}
    Z
  `;

  const leftArmPath = `
    M ${centerX - halfShoulder * mod.shoulderMod} ${shoulderY + 5 * scale}
    Q ${centerX - halfShoulder * mod.shoulderMod - 5 * scale} ${armPitY} ${centerX - halfShoulder * mod.shoulderMod - 15 * scale} ${armPitY + 20 * scale}
    L ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - armWidth} ${handY - 10 * scale}
    Q ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - armWidth - 5 * scale} ${handY} ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - armWidth + 5 * scale} ${handY + 5 * scale}
    L ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - armWidth + 15 * scale} ${handY + 5 * scale}
    Q ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - armWidth + 20 * scale} ${handY} ${centerX - halfShoulder * mod.shoulderMod - 15 * scale - 5 * scale} ${handY - 10 * scale}
    L ${centerX - halfShoulder * mod.shoulderMod - 5 * scale} ${armPitY + 20 * scale}
    Q ${centerX - halfShoulder * mod.shoulderMod} ${armPitY} ${centerX - halfShoulder * mod.shoulderMod} ${shoulderY + 5 * scale}
    Z
  `;

  const rightArmPath = `
    M ${centerX + halfShoulder * mod.shoulderMod} ${shoulderY + 5 * scale}
    Q ${centerX + halfShoulder * mod.shoulderMod + 5 * scale} ${armPitY} ${centerX + halfShoulder * mod.shoulderMod + 15 * scale} ${armPitY + 20 * scale}
    L ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + armWidth} ${handY - 10 * scale}
    Q ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + armWidth + 5 * scale} ${handY} ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + armWidth - 5 * scale} ${handY + 5 * scale}
    L ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + armWidth - 15 * scale} ${handY + 5 * scale}
    Q ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + armWidth - 20 * scale} ${handY} ${centerX + halfShoulder * mod.shoulderMod + 15 * scale + 5 * scale} ${handY - 10 * scale}
    L ${centerX + halfShoulder * mod.shoulderMod + 5 * scale} ${armPitY + 20 * scale}
    Q ${centerX + halfShoulder * mod.shoulderMod} ${armPitY} ${centerX + halfShoulder * mod.shoulderMod} ${shoulderY + 5 * scale}
    Z
  `;

  const leftLegPath = `
    M ${centerX - halfHip * mod.hipMod + 5 * scale} ${legStartY}
    L ${centerX - halfHip * mod.hipMod + 5 * scale - legWidth / 2} ${footY - 10 * scale}
    L ${centerX - halfHip * mod.hipMod + 5 * scale - legWidth / 2 - footSize / 2} ${footY}
    L ${centerX - halfHip * mod.hipMod + 5 * scale - legWidth / 2 + footSize / 2} ${footY + 5 * scale}
    L ${centerX - halfHip * mod.hipMod + 5 * scale + legWidth / 2 - 5 * scale} ${footY + 5 * scale}
    L ${centerX - halfHip * mod.hipMod + 5 * scale + legWidth / 2} ${footY - 10 * scale}
    Z
  `;

  const rightLegPath = `
    M ${centerX + halfHip * mod.hipMod - 5 * scale} ${legStartY}
    L ${centerX + halfHip * mod.hipMod - 5 * scale + legWidth / 2} ${footY - 10 * scale}
    L ${centerX + halfHip * mod.hipMod - 5 * scale + legWidth / 2 + footSize / 2} ${footY}
    L ${centerX + halfHip * mod.hipMod - 5 * scale + legWidth / 2 - footSize / 2} ${footY + 5 * scale}
    L ${centerX + halfHip * mod.hipMod - 5 * scale - legWidth / 2 + 5 * scale} ${footY + 5 * scale}
    L ${centerX + halfHip * mod.hipMod - 5 * scale - legWidth / 2} ${footY - 10 * scale}
    Z
  `;

  return (
    <G>
      <Path
        d={leftArmPath}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.15)}
        strokeWidth={1}
      />
      <Path
        d={rightArmPath}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.15)}
        strokeWidth={1}
      />
      <Path
        d={torsoPath}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.15)}
        strokeWidth={1}
      />
      <Path
        d={leftLegPath}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.15)}
        strokeWidth={1}
      />
      <Path
        d={rightLegPath}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.15)}
        strokeWidth={1}
      />
    </G>
  );
};

export default AvatarBody;
