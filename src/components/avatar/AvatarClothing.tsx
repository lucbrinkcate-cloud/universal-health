import React from 'react';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { ClothingCustomization } from '../../stores/avatarStore';
import { BodyProportions } from '../../utils/bodyProportions';
import { darkenColor } from './colorUtils';

interface AvatarClothingProps {
  proportions: BodyProportions;
  clothing: ClothingCustomization;
  centerX?: number;
}

export const AvatarClothing: React.FC<AvatarClothingProps> = ({
  proportions,
  clothing,
  centerX = 110,
}) => {
  const { scale, shoulderWidth, chestWidth, waistWidth, hipWidth, legWidth, armWidth } = proportions;
  
  const shoulderY = 70 * scale;
  const chestY = 95 * scale;
  const waistY = 130 * scale;
  const hipY = 155 * scale;
  const legStartY = hipY + 10 * scale;
  
  const halfShoulder = shoulderWidth / 2;
  const halfChest = chestWidth / 2;
  const halfWaist = waistWidth / 2;
  const halfHip = hipWidth / 2;

  const getTopPath = (): string => {
    switch (clothing.top) {
      case 'hoodie':
        return `
          M ${centerX - halfShoulder - 5 * scale} ${shoulderY - 5 * scale}
          L ${centerX + halfShoulder + 5 * scale} ${shoulderY - 5 * scale}
          L ${centerX + halfChest + 8 * scale} ${waistY + 10 * scale}
          L ${centerX - halfChest - 8 * scale} ${waistY + 10 * scale}
          Z
          M ${centerX - 10 * scale} ${waistY + 5 * scale}
          L ${centerX - 10 * scale} ${chestY - 10 * scale}
          L ${centerX + 10 * scale} ${chestY - 10 * scale}
          L ${centerX + 10 * scale} ${waistY + 5 * scale}
          Z
        `;
      case 'tank':
        return `
          M ${centerX - halfShoulder + 15 * scale} ${shoulderY + 5 * scale}
          L ${centerX + halfShoulder - 15 * scale} ${shoulderY + 5 * scale}
          L ${centerX + halfWaist + 5 * scale} ${waistY}
          L ${centerX - halfWaist - 5 * scale} ${waistY}
          Z
        `;
      case 'longsleeve':
        return `
          M ${centerX - halfShoulder - 10 * scale} ${shoulderY - 3 * scale}
          L ${centerX + halfShoulder + 10 * scale} ${shoulderY - 3 * scale}
          L ${centerX + halfShoulder + 10 * scale + armWidth + 20 * scale} ${waistY}
          L ${centerX + halfChest + 5 * scale} ${waistY}
          L ${centerX - halfChest - 5 * scale} ${waistY}
          L ${centerX - halfShoulder - 10 * scale - armWidth - 20 * scale} ${waistY}
          Z
        `;
      case 'polo':
        return `
          M ${centerX - halfShoulder} ${shoulderY}
          L ${centerX + halfShoulder} ${shoulderY}
          L ${centerX + halfChest + 3 * scale} ${waistY + 5 * scale}
          L ${centerX - halfChest - 3 * scale} ${waistY + 5 * scale}
          Z
          M ${centerX - 8 * scale} ${shoulderY + 5 * scale}
          L ${centerX} ${chestY - 15 * scale}
          L ${centerX + 8 * scale} ${shoulderY + 5 * scale}
          Z
        `;
      case 'dress_shirt':
        return `
          M ${centerX - halfShoulder} ${shoulderY}
          L ${centerX + halfShoulder} ${shoulderY}
          L ${centerX + halfChest + 3 * scale} ${waistY + 5 * scale}
          L ${centerX - halfChest - 3 * scale} ${waistY + 5 * scale}
          Z
          M ${centerX - 5 * scale} ${shoulderY + 5 * scale}
          L ${centerX} ${chestY - 10 * scale}
          L ${centerX + 5 * scale} ${shoulderY + 5 * scale}
          Z
        `;
      case 'sweater':
        return `
          M ${centerX - halfShoulder - 5 * scale} ${shoulderY - 5 * scale}
          L ${centerX + halfShoulder + 5 * scale} ${shoulderY - 5 * scale}
          L ${centerX + halfShoulder + 5 * scale + armWidth + 15 * scale} ${waistY + 10 * scale}
          L ${centerX + halfChest + 8 * scale} ${waistY + 10 * scale}
          L ${centerX - halfChest - 8 * scale} ${waistY + 10 * scale}
          L ${centerX - halfShoulder - 5 * scale - armWidth - 15 * scale} ${waistY + 10 * scale}
          Z
        `;
      case 'crop_top':
        return `
          M ${centerX - halfShoulder + 10 * scale} ${shoulderY + 5 * scale}
          L ${centerX + halfShoulder - 10 * scale} ${shoulderY + 5 * scale}
          L ${centerX + halfChest} ${chestY + 10 * scale}
          L ${centerX - halfChest} ${chestY + 10 * scale}
          Z
        `;
      default:
        return `
          M ${centerX - halfShoulder - 3 * scale} ${shoulderY}
          L ${centerX + halfShoulder + 3 * scale} ${shoulderY}
          L ${centerX + halfChest + 3 * scale} ${waistY}
          L ${centerX - halfChest - 3 * scale} ${waistY}
          Z
        `;
    }
  };

  const getBottomPath = (): string => {
    const halfLeg = legWidth / 2;
    
    switch (clothing.bottom) {
      case 'shorts':
        return `
          M ${centerX - halfHip - 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfHip + 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfLeg + 20 * scale} ${legStartY + 25 * scale}
          L ${centerX + halfLeg - 5 * scale} ${legStartY + 25 * scale}
          L ${centerX + 5 * scale} ${legStartY}
          L ${centerX - 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 5 * scale} ${legStartY + 25 * scale}
          L ${centerX - halfLeg - 20 * scale} ${legStartY + 25 * scale}
          Z
        `;
      case 'sweats':
        return `
          M ${centerX - halfHip - 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfHip + 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfLeg + 15 * scale} ${legStartY + 90 * scale}
          L ${centerX + halfLeg - 5 * scale} ${legStartY + 95 * scale}
          L ${centerX + halfLeg - 5 * scale} ${legStartY}
          L ${centerX + 5 * scale} ${legStartY}
          L ${centerX - 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 5 * scale} ${legStartY + 95 * scale}
          L ${centerX - halfLeg - 15 * scale} ${legStartY + 90 * scale}
          Z
        `;
      case 'leggings':
        return `
          M ${centerX - halfHip} ${legStartY - 15 * scale}
          L ${centerX + halfHip} ${legStartY - 15 * scale}
          L ${centerX + halfLeg + 5 * scale} ${legStartY + 90 * scale}
          L ${centerX + halfLeg - 5 * scale} ${legStartY + 95 * scale}
          L ${centerX + halfLeg - 5 * scale} ${legStartY}
          L ${centerX + 3 * scale} ${legStartY}
          L ${centerX - 3 * scale} ${legStartY}
          L ${centerX - halfLeg + 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 5 * scale} ${legStartY + 95 * scale}
          L ${centerX - halfLeg - 5 * scale} ${legStartY + 90 * scale}
          Z
        `;
      case 'skirt':
        return `
          M ${centerX - halfHip} ${legStartY - 15 * scale}
          L ${centerX + halfHip} ${legStartY - 15 * scale}
          L ${centerX + halfHip + 20 * scale} ${legStartY + 40 * scale}
          L ${centerX - halfHip - 20 * scale} ${legStartY + 40 * scale}
          Z
        `;
      case 'chinos':
        return `
          M ${centerX - halfHip - 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfHip + 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfLeg + 10 * scale} ${legStartY + 85 * scale}
          L ${centerX + halfLeg - 3 * scale} ${legStartY + 90 * scale}
          L ${centerX + halfLeg - 3 * scale} ${legStartY}
          L ${centerX + 5 * scale} ${legStartY}
          L ${centerX - 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 3 * scale} ${legStartY}
          L ${centerX - halfLeg + 3 * scale} ${legStartY + 90 * scale}
          L ${centerX - halfLeg - 10 * scale} ${legStartY + 85 * scale}
          Z
        `;
      default:
        return `
          M ${centerX - halfHip - 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfHip + 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + halfLeg + 8 * scale} ${legStartY + 85 * scale}
          L ${centerX + halfLeg - 3 * scale} ${legStartY + 90 * scale}
          L ${centerX + halfLeg - 3 * scale} ${legStartY}
          L ${centerX + 5 * scale} ${legStartY}
          L ${centerX - 5 * scale} ${legStartY}
          L ${centerX - halfLeg + 3 * scale} ${legStartY}
          L ${centerX - halfLeg + 3 * scale} ${legStartY + 90 * scale}
          L ${centerX - halfLeg - 8 * scale} ${legStartY + 85 * scale}
          Z
        `;
    }
  };

  return (
    <G>
      <Path
        d={getTopPath()}
        fill={clothing.topColor}
        stroke={darkenColor(clothing.topColor, 0.15)}
        strokeWidth={1}
      />
      <Path
        d={getBottomPath()}
        fill={clothing.bottomColor}
        stroke={darkenColor(clothing.bottomColor, 0.15)}
        strokeWidth={1}
      />
    </G>
  );
};

export default AvatarClothing;
