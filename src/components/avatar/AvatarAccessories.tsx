import React from 'react';
import Svg, { Path, G, Circle, Ellipse } from 'react-native-svg';
import { AccessoryCustomization } from '../../stores/avatarStore';
import { darkenColor } from './colorUtils';

interface AvatarAccessoriesProps {
  centerX: number;
  headCenterY: number;
  headWidth: number;
  headHeight: number;
  headTop: number;
  accessories: AccessoryCustomization;
}

export const AvatarAccessories: React.FC<AvatarAccessoriesProps> = ({
  centerX,
  headCenterY,
  headWidth,
  headHeight,
  headTop,
  accessories,
}) => {
  const hw = headWidth / 2;
  const hh = headHeight / 2;
  const eyeY = headCenterY - hh * 0.1;
  const eyeSpacing = 13;

  const getGlassesPath = (): string | null => {
    const leftEyeX = centerX - eyeSpacing;
    const rightEyeX = centerX + eyeSpacing;
    const glassesWidth = 18;
    const glassesHeight = 12;

    switch (accessories.glasses) {
      case 'round':
        return `
          M ${leftEyeX - glassesWidth} ${eyeY}
          A ${glassesWidth} ${glassesHeight} 0 1 1 ${leftEyeX + glassesWidth} ${eyeY}
          A ${glassesWidth} ${glassesHeight} 0 1 1 ${leftEyeX - glassesWidth} ${eyeY}
          M ${leftEyeX + glassesWidth} ${eyeY}
          L ${rightEyeX - glassesWidth} ${eyeY}
          M ${rightEyeX - glassesWidth} ${eyeY}
          A ${glassesWidth} ${glassesHeight} 0 1 1 ${rightEyeX + glassesWidth} ${eyeY}
          A ${glassesWidth} ${glassesHeight} 0 1 1 ${rightEyeX - glassesWidth} ${eyeY}
          M ${rightEyeX + glassesWidth} ${eyeY}
          L ${rightEyeX + glassesWidth + 15} ${eyeY - 3}
        `;
      case 'square':
        return `
          M ${leftEyeX - glassesWidth} ${eyeY - glassesHeight}
          L ${leftEyeX + glassesWidth} ${eyeY - glassesHeight}
          L ${leftEyeX + glassesWidth} ${eyeY + glassesHeight}
          L ${leftEyeX - glassesWidth} ${eyeY + glassesHeight}
          Z
          M ${leftEyeX + glassesWidth} ${eyeY}
          L ${rightEyeX - glassesWidth} ${eyeY}
          M ${rightEyeX - glassesWidth} ${eyeY - glassesHeight}
          L ${rightEyeX + glassesWidth} ${eyeY - glassesHeight}
          L ${rightEyeX + glassesWidth} ${eyeY + glassesHeight}
          L ${rightEyeX - glassesWidth} ${eyeY + glassesHeight}
          Z
          M ${rightEyeX + glassesWidth} ${eyeY}
          L ${rightEyeX + glassesWidth + 15} ${eyeY - 3}
        `;
      case 'aviator':
        return `
          M ${leftEyeX - glassesWidth - 3} ${eyeY - glassesHeight - 2}
          Q ${leftEyeX} ${eyeY - glassesHeight - 5} ${leftEyeX + glassesWidth + 2} ${eyeY}
          Q ${leftEyeX} ${eyeY + glassesHeight + 3} ${leftEyeX - glassesWidth - 3} ${eyeY}
          Q ${leftEyeX - glassesWidth - 5} ${eyeY - glassesHeight} ${leftEyeX - glassesWidth - 3} ${eyeY - glassesHeight - 2}
          M ${leftEyeX + glassesWidth + 2} ${eyeY}
          L ${rightEyeX - glassesWidth - 2} ${eyeY}
          M ${rightEyeX + glassesWidth - 2} ${eyeY - glassesHeight - 2}
          Q ${rightEyeX} ${eyeY - glassesHeight - 5} ${rightEyeX - glassesWidth - 2} ${eyeY}
          Q ${rightEyeX} ${eyeY + glassesHeight + 3} ${rightEyeX + glassesWidth + 3} ${eyeY}
          M ${rightEyeX + glassesWidth + 3} ${eyeY}
          L ${rightEyeX + glassesWidth + 18} ${eyeY - 3}
        `;
      case 'sport':
        return `
          M ${centerX - hw * 0.95} ${eyeY - 5}
          L ${centerX + hw * 0.95} ${eyeY - 5}
          L ${centerX + hw * 0.95} ${eyeY + 8}
          L ${centerX - hw * 0.95} ${eyeY + 8}
          Z
          M ${leftEyeX - 5} ${eyeY - 5}
          L ${leftEyeX - 5} ${eyeY + 8}
          M ${rightEyeX + 5} ${eyeY - 5}
          L ${rightEyeX + 5} ${eyeY + 8}
        `;
      case 'cat_eye':
        return `
          M ${leftEyeX - glassesWidth - 5} ${eyeY + 3}
          Q ${leftEyeX - glassesWidth - 8} ${eyeY - glassesHeight - 5} ${leftEyeX + glassesWidth} ${eyeY - glassesHeight + 2}
          Q ${leftEyeX + glassesWidth + 3} ${eyeY} ${leftEyeX + glassesWidth} ${eyeY + glassesHeight - 2}
          Q ${leftEyeX} ${eyeY + glassesHeight + 2} ${leftEyeX - glassesWidth - 5} ${eyeY + 3}
          M ${leftEyeX + glassesWidth} ${eyeY}
          L ${rightEyeX - glassesWidth} ${eyeY}
          M ${rightEyeX + glassesWidth + 5} ${eyeY + 3}
          Q ${rightEyeX + glassesWidth + 8} ${eyeY - glassesHeight - 5} ${rightEyeX - glassesWidth} ${eyeY - glassesHeight + 2}
          Q ${rightEyeX - glassesWidth - 3} ${eyeY} ${rightEyeX - glassesWidth} ${eyeY + glassesHeight - 2}
          Q ${rightEyeX} ${eyeY + glassesHeight + 2} ${rightEyeX + glassesWidth + 5} ${eyeY + 3}
          M ${rightEyeX + glassesWidth + 5} ${eyeY + 1}
          L ${rightEyeX + glassesWidth + 20} ${eyeY - 5}
        `;
      case 'wayfarer':
        return `
          M ${leftEyeX - glassesWidth - 3} ${eyeY - glassesHeight - 3}
          L ${leftEyeX + glassesWidth + 3} ${eyeY - glassesHeight - 3}
          L ${leftEyeX + glassesWidth + 5} ${eyeY + glassesHeight + 2}
          L ${leftEyeX - glassesWidth - 5} ${eyeY + glassesHeight + 2}
          Z
          M ${leftEyeX + glassesWidth + 3} ${eyeY - glassesHeight}
          L ${rightEyeX - glassesWidth - 3} ${eyeY - glassesHeight}
          M ${rightEyeX - glassesWidth - 3} ${eyeY - glassesHeight - 3}
          L ${rightEyeX + glassesWidth + 3} ${eyeY - glassesHeight - 3}
          L ${rightEyeX + glassesWidth + 5} ${eyeY + glassesHeight + 2}
          L ${rightEyeX - glassesWidth - 5} ${eyeY + glassesHeight + 2}
          Z
          M ${rightEyeX + glassesWidth + 5} ${eyeY}
          L ${rightEyeX + glassesWidth + 20} ${eyeY - 5}
        `;
      default:
        return null;
    }
  };

  const getHatPath = (): string | null => {
    const hatY = headTop - 5;
    
    switch (accessories.hat) {
      case 'beanie':
        return `
          M ${centerX - hw * 1.1} ${headCenterY - hh * 0.4}
          Q ${centerX - hw * 1.2} ${headCenterY - hh * 0.9} ${centerX} ${hatY - 15}
          Q ${centerX + hw * 1.2} ${headCenterY - hh * 0.9} ${centerX + hw * 1.1} ${headCenterY - hh * 0.4}
          L ${centerX + hw * 1.15} ${headCenterY - hh * 0.5}
          Q ${centerX} ${headCenterY - hh * 0.3} ${centerX - hw * 1.15} ${headCenterY - hh * 0.5}
          Z
          M ${centerX - hw * 1.1} ${headCenterY - hh * 0.4}
          L ${centerX + hw * 1.1} ${headCenterY - hh * 0.4}
        `;
      case 'cap':
        return `
          M ${centerX - hw * 1.05} ${headCenterY - hh * 0.3}
          Q ${centerX - hw * 1.15} ${headCenterY - hh * 0.8} ${centerX} ${hatY - 8}
          Q ${centerX + hw * 1.15} ${headCenterY - hh * 0.8} ${centerX + hw * 1.05} ${headCenterY - hh * 0.3}
          Q ${centerX + hw * 1.1} ${headCenterY - hh * 0.25} ${centerX + hw * 1.5} ${headCenterY - hh * 0.35}
          L ${centerX + hw * 1.8} ${headCenterY - hh * 0.2}
          L ${centerX + hw * 1.5} ${headCenterY - hh * 0.15}
          Q ${centerX} ${headCenterY - hh * 0.1} ${centerX - hw * 1.05} ${headCenterY - hh * 0.3}
          Z
        `;
      case 'fedora':
        return `
          M ${centerX - hw * 1.4} ${headCenterY - hh * 0.35}
          L ${centerX + hw * 1.4} ${headCenterY - hh * 0.35}
          L ${centerX + hw * 1.3} ${headCenterY - hh * 0.45}
          Q ${centerX + hw * 1.1} ${headCenterY - hh * 1.1} ${centerX} ${hatY - 20}
          Q ${centerX - hw * 1.1} ${headCenterY - hh * 1.1} ${centerX - hw * 1.3} ${headCenterY - hh * 0.45}
          Z
          M ${centerX - hw * 0.8} ${headCenterY - hh * 0.65}
          L ${centerX + hw * 0.8} ${headCenterY - hh * 0.65}
          M ${centerX - hw * 0.3} ${hatY - 20}
          Q ${centerX} ${hatY - 25} ${centerX + hw * 0.3} ${hatY - 20}
        `;
      case 'beret':
        return `
          M ${centerX - hw * 0.8} ${headCenterY - hh * 0.5}
          Q ${centerX - hw * 1.1} ${headCenterY - hh * 0.7} ${centerX - hw * 0.3} ${hatY - 12}
          Q ${centerX + hw * 0.5} ${hatY - 18} ${centerX + hw * 0.9} ${headCenterY - hh * 0.6}
          Q ${centerX + hw * 0.8} ${headCenterY - hh * 0.4} ${centerX - hw * 0.8} ${headCenterY - hh * 0.5}
          Z
          M ${centerX + hw * 0.6} ${hatY - 15}
          Q ${centerX + hw * 0.7} ${hatY - 22} ${centerX + hw * 0.5} ${hatY - 18}
        `;
      case 'bucket':
        return `
          M ${centerX - hw * 1.25} ${headCenterY - hh * 0.25}
          L ${centerX + hw * 1.25} ${headCenterY - hh * 0.25}
          L ${centerX + hw * 1.3} ${headCenterY - hh * 0.4}
          Q ${centerX + hw * 1.1} ${headCenterY - hh * 1.05} ${centerX} ${hatY - 12}
          Q ${centerX - hw * 1.1} ${headCenterY - hh * 1.05} ${centerX - hw * 1.3} ${headCenterY - hh * 0.4}
          Z
        `;
      default:
        return null;
    }
  };

  const getEarringsPath = (): React.ReactNode => {
    const earX = centerX + hw * 0.9;
    const earY = headCenterY;
    
    switch (accessories.earrings) {
      case 'stud':
        return (
          <Circle
            cx={earX}
            cy={earY}
            r={3}
            fill={accessories.earringsColor}
          />
        );
      case 'hoop':
        return (
          <Circle
            cx={earX + 2}
            cy={earY + 5}
            r={8}
            fill="none"
            stroke={accessories.earringsColor}
            strokeWidth={2}
          />
        );
      case 'drop':
        return (
          <G>
            <Circle
              cx={earX}
              cy={earY}
              r={2}
              fill={accessories.earringsColor}
            />
            <Ellipse
              cx={earX}
              cy={earY + 10}
              rx={3}
              ry={5}
              fill={accessories.earringsColor}
            />
          </G>
        );
      case 'dangle':
        return (
          <G>
            <Circle
              cx={earX}
              cy={earY}
              r={2}
              fill={accessories.earringsColor}
            />
            <Path
              d={`M ${earX} ${earY + 3} L ${earX - 3} ${earY + 12} L ${earX + 3} ${earY + 12} Z`}
              fill={accessories.earringsColor}
            />
            <Circle
              cx={earX}
              cy={earY + 15}
              r={2}
              fill={accessories.earringsColor}
            />
          </G>
        );
      default:
        return null;
    }
  };

  const glassesPath = getGlassesPath();
  const hatPath = getHatPath();

  return (
    <G>
      {hatPath && (
        <Path
          d={hatPath}
          fill={accessories.hatColor}
          stroke={darkenColor(accessories.hatColor, 0.2)}
          strokeWidth={1}
        />
      )}
      
      {glassesPath && (
        <Path
          d={glassesPath}
          fill="none"
          stroke={accessories.glassesColor}
          strokeWidth={2}
        />
      )}
      
      {accessories.earrings !== 'none' && getEarringsPath()}
    </G>
  );
};

export default AvatarAccessories;
