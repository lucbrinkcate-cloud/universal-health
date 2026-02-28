import React from 'react';
import Svg, { Path, Ellipse, G, Defs, LinearGradient, RadialGradient, Stop, Circle } from 'react-native-svg';
import { AvatarCustomization, BodyView } from '../../stores/avatarStore';

interface ImprovedAvatarProps {
  customization: AvatarCustomization;
  size?: number;
  bodyView?: BodyView;
  showBody?: boolean;
}

export const ImprovedAvatar: React.FC<ImprovedAvatarProps> = ({
  customization,
  size = 300,
  bodyView = 'front',
  showBody = true,
}) => {
  const scale = size / 300;
  const centerX = 150 * scale;
  const centerY = 100 * scale;

  const headSize = 50 * scale;
  const headCenterX = centerX;
  const headCenterY = 55 * scale;
  const headWidth = headSize * 1.2;
  const headHeight = headSize * 1.3;

  const neckY = headCenterY + headHeight / 2 - 2 * scale;
  const neckWidth = 18 * scale;
  
  const shoulderY = neckY + 12 * scale;
  const shoulderWidth = 90 * scale;
  
  const chestY = shoulderY + 30 * scale;
  const chestWidth = 80 * scale;
  
  const waistY = chestY + 35 * scale;
  const waistWidth = 60 * scale;
  
  const hipY = waistY + 25 * scale;
  const hipWidth = 75 * scale;
  
  const legStartY = hipY;
  const legEndY = legStartY + 85 * scale;
  
  const armStartY = shoulderY;
  const armEndY = armStartY + 70 * scale;

  const skinColor = customization.skinTone;
  const hairColor = customization.hair.color;
  const clothingTop = customization.clothing.top;
  const clothingTopColor = customization.clothing.topColor;
  const clothingBottom = customization.clothing.bottom;
  const clothingBottomColor = customization.clothing.bottomColor;
  const glassesStyle = customization.accessories.glasses;
  const glassesColor = customization.accessories.glassesColor;
  const hairStyle = customization.hair.style;

  const darken = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const lighten = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getHairPath = () => {
    const hw = headWidth / 2;
    const hh = headHeight / 2;
    const topY = headCenterY - hh * 0.8;
    
    switch (hairStyle) {
      case 'short':
        return `
          M ${headCenterX - hw * 0.9} ${headCenterY - hh * 0.2}
          Q ${headCenterX - hw * 1.05} ${headCenterY - hh * 0.7} ${headCenterX} ${topY - 5 * scale}
          Q ${headCenterX + hw * 1.05} ${headCenterY - hh * 0.7} ${headCenterX + hw * 0.9} ${headCenterY - hh * 0.2}
          Q ${headCenterX + hw * 0.95} ${headCenterY - hh * 1.0} ${headCenterX} ${topY - 10 * scale}
          Q ${headCenterX - hw * 0.95} ${headCenterY - hh * 1.0} ${headCenterX - hw * 0.9} ${headCenterY - hh * 0.2}
          Z
        `;
      case 'medium':
        return `
          M ${headCenterX - hw * 0.85} ${headCenterY + hh * 0.6}
          Q ${headCenterX - hw * 1.05} ${headCenterY - hh * 0.3} ${headCenterX - hw * 0.95} ${headCenterY - hh * 0.7}
          Q ${headCenterX - hw} ${headCenterY - hh * 1.1} ${headCenterX} ${topY - 12 * scale}
          Q ${headCenterX + hw} ${headCenterY - hh * 1.1} ${headCenterX + hw * 0.95} ${headCenterY - hh * 0.7}
          Q ${headCenterX + hw * 1.05} ${headCenterY - hh * 0.3} ${headCenterX + hw * 0.85} ${headCenterY + hh * 0.6}
          Q ${headCenterX + hw * 0.9} ${headCenterY + hh * 0.9} ${headCenterX} ${headCenterY + hh * 1.0}
          Q ${headCenterX - hw * 0.9} ${headCenterY + hh * 0.9} ${headCenterX - hw * 0.85} ${headCenterY + hh * 0.6}
          Z
        `;
      case 'long':
        return `
          M ${headCenterX - hw * 0.7} ${headCenterY + hh * 1.8}
          Q ${headCenterX - hw * 1.1} ${headCenterY + hh * 0.5} ${headCenterX - hw * 1.05} ${headCenterY - hh * 0.2}
          Q ${headCenterX - hw * 1.1} ${headCenterY - hh * 1.1} ${headCenterX} ${topY - 15 * scale}
          Q ${headCenterX + hw * 1.1} ${headCenterY - hh * 1.1} ${headCenterX + hw * 1.05} ${headCenterY - hh * 0.2}
          Q ${headCenterX + hw * 1.1} ${headCenterY + hh * 0.5} ${headCenterX + hw * 0.7} ${headCenterY + hh * 1.8}
          L ${headCenterX + hw * 0.4} ${headCenterY + hh * 1.5}
          Q ${headCenterX} ${headCenterY + hh * 1.2} ${headCenterX - hw * 0.4} ${headCenterY + hh * 1.5}
          Z
        `;
      case 'curly':
        return `
          M ${headCenterX - hw * 1.15} ${headCenterY + hh * 0.9}
          C ${headCenterX - hw * 1.35} ${headCenterY} ${headCenterX - hw * 1.25} ${headCenterY - hh * 0.9} ${headCenterX - hw * 0.9} ${headCenterY - hh * 1.15}
          C ${headCenterX - hw * 0.4} ${headCenterY - hh * 1.4} ${headCenterX + hw * 0.4} ${headCenterY - hh * 1.4} ${headCenterX + hw * 0.9} ${headCenterY - hh * 1.15}
          C ${headCenterX + hw * 1.25} ${headCenterY - hh * 0.9} ${headCenterX + hw * 1.35} ${headCenterY} ${headCenterX + hw * 1.15} ${headCenterY + hh * 0.9}
          C ${headCenterX + hw * 1.2} ${headCenterY + hh * 1.3} ${headCenterX} ${headCenterY + hh * 1.4} ${headCenterX - hw * 1.2} ${headCenterY + hh * 0.9}
          Z
        `;
      case 'afro':
        return `
          M ${headCenterX - hw * 1.4} ${headCenterY}
          C ${headCenterX - hw * 1.6} ${headCenterY - hh * 0.5} ${headCenterX - hw * 1.5} ${headCenterY - hh * 1.4} ${headCenterX} ${topY - 30 * scale}
          C ${headCenterX + hw * 1.5} ${headCenterY - hh * 1.4} ${headCenterX + hw * 1.6} ${headCenterY - hh * 0.5} ${headCenterX + hw * 1.4} ${headCenterY}
          C ${headCenterX + hw * 1.5} ${headCenterY + hh * 0.7} ${headCenterX + hw * 1.25} ${headCenterY + hh * 1.25} ${headCenterX} ${headCenterY + hh * 1.4}
          C ${headCenterX - hw * 1.25} ${headCenterY + hh * 1.25} ${headCenterX - hw * 1.5} ${headCenterY + hh * 0.7} ${headCenterX - hw * 1.4} ${headCenterY}
          Z
        `;
      default:
        return `
          M ${headCenterX - hw * 0.9} ${headCenterY - hh * 0.2}
          Q ${headCenterX - hw * 1.05} ${headCenterY - hh * 0.7} ${headCenterX} ${topY - 5 * scale}
          Q ${headCenterX + hw * 1.05} ${headCenterY - hh * 0.7} ${headCenterX + hw * 0.9} ${headCenterY - hh * 0.2}
          Q ${headCenterX + hw * 0.95} ${headCenterY - hh * 1.0} ${headCenterX} ${topY - 10 * scale}
          Q ${headCenterX - hw * 0.95} ${headCenterY - hh * 1.0} ${headCenterX - hw * 0.9} ${headCenterY - hh * 0.2}
          Z
        `;
    }
  };

  const getFacePath = () => {
    const hw = headWidth / 2;
    const hh = headHeight / 2;
    return `
      M ${headCenterX} ${headCenterY - hh}
      C ${headCenterX + hw * 1.05} ${headCenterY - hh * 0.6} ${headCenterX + hw * 1.0} ${headCenterY + hh * 0.15} ${headCenterX + hw * 0.35} ${headCenterY + hh * 0.75}
      Q ${headCenterX} ${headCenterY + hh * 1.05} ${headCenterX - hw * 0.35} ${headCenterY + hh * 0.75}
      C ${headCenterX - hw * 1.0} ${headCenterY + hh * 0.15} ${headCenterX - hw * 1.05} ${headCenterY - hh * 0.6} ${headCenterX} ${headCenterY - hh}
      Z
    `;
  };

  const getEyePath = (x: number) => {
    const hw = headWidth / 2;
    const hh = headHeight / 2;
    const eyeSize = 6 * scale;
    return `
      M ${x - eyeSize} ${headCenterY - hh * 0.05}
      A ${eyeSize} ${eyeSize * 0.7} 0 1 1 ${x + eyeSize} ${headCenterY - hh * 0.05}
      A ${eyeSize} ${eyeSize * 0.7} 0 1 1 ${x - eyeSize} ${headCenterY - hh * 0.05}
    `;
  };

  const getGlassesPath = () => {
    const hw = headWidth / 2;
    const hh = headHeight / 2;
    const eyeY = headCenterY - hh * 0.05;
    const leftEyeX = headCenterX - 15 * scale;
    const rightEyeX = headCenterX + 15 * scale;
    const glassesWidth = 14 * scale;
    const glassesHeight = 10 * scale;
    
    switch (glassesStyle) {
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
          L ${rightEyeX + glassesWidth + 12} ${eyeY - 3}
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
          L ${rightEyeX + glassesWidth + 12} ${eyeY - 3}
        `;
      case 'aviator':
        return `
          M ${leftEyeX - glassesWidth - 2} ${eyeY - glassesHeight - 2}
          Q ${leftEyeX} ${eyeY - glassesHeight - 5} ${leftEyeX + glassesWidth + 2} ${eyeY}
          Q ${leftEyeX} ${eyeY + glassesHeight + 3} ${leftEyeX - glassesWidth - 2} ${eyeY}
          Q ${leftEyeX - glassesWidth - 5} ${eyeY - glassesHeight} ${leftEyeX - glassesWidth - 2} ${eyeY - glassesHeight - 2}
          M ${leftEyeX + glassesWidth + 2} ${eyeY}
          L ${rightEyeX - glassesWidth - 2} ${eyeY}
          M ${rightEyeX + glassesWidth - 2} ${eyeY - glassesHeight - 2}
          Q ${rightEyeX} ${eyeY - glassesHeight - 5} ${rightEyeX - glassesWidth - 2} ${eyeY}
          Q ${rightEyeX} ${eyeY + glassesHeight + 3} ${rightEyeX + glassesWidth + 2} ${eyeY}
          M ${rightEyeX + glassesWidth + 2} ${eyeY}
          L ${rightEyeX + glassesWidth + 15} ${eyeY - 3}
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
          L ${rightEyeX + glassesWidth + 18} ${eyeY - 5}
        `;
      default:
        return null;
    }
  };

  const getTopPath = () => {
    const shirtY = shoulderY;
    switch (clothingTop) {
      case 'hoodie':
        return `
          M ${centerX - shoulderWidth / 2 - 8 * scale} ${shoulderY - 5 * scale}
          L ${centerX + shoulderWidth / 2 + 8 * scale} ${shoulderY - 5 * scale}
          L ${centerX + chestWidth / 2 + 10 * scale} ${waistY + 15 * scale}
          L ${centerX - chestWidth / 2 - 10 * scale} ${waistY + 15 * scale}
          Z
          M ${centerX - 12 * scale} ${waistY + 8 * scale}
          L ${centerX - 12 * scale} ${chestY - 10 * scale}
          L ${centerX + 12 * scale} ${chestY - 10 * scale}
          L ${centerX + 12 * scale} ${waistY + 8 * scale}
          Z
        `;
      case 'tank':
        return `
          M ${centerX - shoulderWidth / 2 + 18 * scale} ${shoulderY + 5 * scale}
          L ${centerX + shoulderWidth / 2 - 18 * scale} ${shoulderY + 5 * scale}
          L ${centerX + waistWidth / 2 + 8 * scale} ${waistY}
          L ${centerX - waistWidth / 2 - 8 * scale} ${waistY}
          Z
        `;
      default:
        return `
          M ${centerX - shoulderWidth / 2 - 5 * scale} ${shoulderY}
          L ${centerX + shoulderWidth / 2 + 5 * scale} ${shoulderY}
          L ${centerX + chestWidth / 2 + 5 * scale} ${waistY}
          L ${centerX - chestWidth / 2 - 5 * scale} ${waistY}
          Z
        `;
    }
  };

  const getBottomPath = () => {
    const legInset = 5 * scale;
    switch (clothingBottom) {
      case 'shorts':
        return `
          M ${centerX - hipWidth / 2 - 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 2 + 5 * scale} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 4 + 15 * scale} ${legStartY + 25 * scale}
          L ${centerX + legInset} ${legStartY}
          L ${centerX - legInset} ${legStartY}
          L ${centerX - hipWidth / 4 - 15 * scale} ${legStartY + 25 * scale}
          Z
        `;
      case 'skirt':
        return `
          M ${centerX - hipWidth / 2} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 2} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 2 + 25 * scale} ${legStartY + 45 * scale}
          L ${centerX - hipWidth / 2 - 25 * scale} ${legStartY + 45 * scale}
          Z
        `;
      default:
        return `
          M ${centerX - hipWidth / 2 - 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 2 + 3 * scale} ${legStartY - 15 * scale}
          L ${centerX + hipWidth / 4 + 10 * scale} ${legEndY}
          L ${centerX + legInset} ${legEndY + 5 * scale}
          L ${centerX + legInset} ${legStartY}
          L ${centerX - legInset} ${legStartY}
          L ${centerX - legInset} ${legEndY + 5 * scale}
          L ${centerX - hipWidth / 4 - 10 * scale} ${legEndY}
          Z
        `;
    }
  };

  const getBodyPath = () => {
    const armWidth = 14 * scale;
    const armInset = 8 * scale;
    
    return `
      M ${centerX - neckWidth / 2} ${neckY}
      L ${centerX - neckWidth / 2} ${shoulderY}
      Q ${centerX - shoulderWidth / 2 - 5 * scale} ${shoulderY} ${centerX - shoulderWidth / 2 - armInset} ${armStartY + 15 * scale}
      L ${centerX - shoulderWidth / 2 - armInset - armWidth} ${armEndY - 15 * scale}
      Q ${centerX - shoulderWidth / 2 - armInset - armWidth - 5 * scale} ${armEndY} ${centerX - shoulderWidth / 2 - armInset - armWidth + 8 * scale} ${armEndY + 8 * scale}
      L ${centerX - shoulderWidth / 2 - armInset - armWidth + 20 * scale} ${armEndY + 8 * scale}
      Q ${centerX - shoulderWidth / 2 - armInset - armWidth + 25 * scale} ${armEndY} ${centerX - shoulderWidth / 2 - armInset - 5 * scale} ${armStartY + 15 * scale}
      L ${centerX - shoulderWidth / 2 - 5 * scale} ${shoulderY}
      Q ${centerX - shoulderWidth / 2 - 3 * scale} ${shoulderY - 3 * scale} ${centerX - 3 * scale} ${shoulderY - 5 * scale}
      L ${centerX + 3 * scale} ${shoulderY - 5 * scale}
      Q ${centerX + shoulderWidth / 2 + 3 * scale} ${shoulderY - 3 * scale} ${centerX + shoulderWidth / 2 + 5 * scale} ${shoulderY}
      L ${centerX + shoulderWidth / 2 + armInset + 5 * scale} ${armStartY + 15 * scale}
      Q ${centerX + shoulderWidth / 2 + armInset + armWidth - 25 * scale} ${armEndY} ${centerX + shoulderWidth / 2 + armInset + armWidth - 20 * scale} ${armEndY + 8 * scale}
      L ${centerX + shoulderWidth / 2 + armInset + armWidth - 8 * scale} ${armEndY + 8 * scale}
      Q ${centerX + shoulderWidth / 2 + armInset + armWidth + 5 * scale} ${armEndY} ${centerX + shoulderWidth / 2 + armInset + armWidth} ${armEndY - 15 * scale}
      L ${centerX + shoulderWidth / 2 + armInset} ${armStartY + 15 * scale}
      Q ${centerX + shoulderWidth / 2 + 5 * scale} ${shoulderY} ${centerX + shoulderWidth / 2} ${shoulderY}
      L ${centerX + neckWidth / 2} ${shoulderY}
      L ${centerX + neckWidth / 2} ${neckY}
      Z
      
      M ${centerX - hipWidth / 2 + 8 * scale} ${hipY}
      L ${centerX - hipWidth / 2 + 8 * scale - 10 * scale} ${legEndY - 10 * scale}
      L ${centerX - hipWidth / 2 + 8 * scale - 10 * scale - 12 * scale} ${legEndY + 5 * scale}
      L ${centerX - hipWidth / 2 + 8 * scale + 12 * scale} ${legEndY + 5 * scale}
      L ${centerX - hipWidth / 2 + 8 * scale + 10 * scale} ${legEndY - 10 * scale}
      L ${centerX - 3 * scale} ${hipY}
      L ${centerX + 3 * scale} ${hipY}
      L ${centerX + hipWidth / 2 - 8 * scale - 10 * scale} ${legEndY - 10 * scale}
      L ${centerX + hipWidth / 2 - 8 * scale - 10 * scale - 12 * scale} ${legEndY + 5 * scale}
      L ${centerX + hipWidth / 2 - 8 * scale + 12 * scale} ${legEndY + 5 * scale}
      L ${centerX + hipWidth / 2 - 8 * scale + 10 * scale} ${legEndY - 10 * scale}
      L ${centerX + hipWidth / 2 - 8 * scale} ${hipY}
      Z
    `;
  };

  return (
    <Svg width={size} height={size * 1.4} viewBox={`0 0 ${size} ${size * 1.4}`}>
      <Defs>
        <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={lighten(skinColor, 0.08)} />
          <Stop offset="100%" stopColor={skinColor} />
        </LinearGradient>
        <LinearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={lighten(clothingTopColor, 0.1)} />
          <Stop offset="100%" stopColor={clothingTopColor} />
        </LinearGradient>
        <RadialGradient id="hairHighlight" cx="30%" cy="30%" r="70%">
          <Stop offset="0%" stopColor={lighten(hairColor, 0.2)} />
          <Stop offset="100%" stopColor={hairColor} />
        </RadialGradient>
      </Defs>

      {showBody && (
        <G>
          <Path
            d={getBodyPath()}
            fill="url(#skinGradient)"
            stroke={darken(skinColor, 0.15)}
            strokeWidth={1.5}
          />
          <Path
            d={getTopPath()}
            fill="url(#shirtGradient)"
            stroke={darken(clothingTopColor, 0.2)}
            strokeWidth={1}
          />
          <Path
            d={getBottomPath()}
            fill={clothingBottomColor}
            stroke={darken(clothingBottomColor, 0.2)}
            strokeWidth={1}
          />
        </G>
      )}

      <Path
        d={getFacePath()}
        fill="url(#skinGradient)"
        stroke={darken(skinColor, 0.12)}
        strokeWidth={1}
      />

      <G>
        <Circle cx={headCenterX - 14 * scale} cy={headCenterY - headHeight * 0.05} r={5 * scale} fill="#FFFFFF" />
        <Circle cx={headCenterX - 14 * scale} cy={headCenterY - headHeight * 0.05} r={2.5 * scale} fill={customization.eyes.color} />
        <Circle cx={headCenterX - 14 * scale + 1 * scale} cy={headCenterY - headHeight * 0.08} r={1 * scale} fill="#FFFFFF" />
        
        <Circle cx={headCenterX + 14 * scale} cy={headCenterY - headHeight * 0.05} r={5 * scale} fill="#FFFFFF" />
        <Circle cx={headCenterX + 14 * scale} cy={headCenterY - headHeight * 0.05} r={2.5 * scale} fill={customization.eyes.color} />
        <Circle cx={headCenterX + 14 * scale + 1 * scale} cy={headCenterY - headHeight * 0.08} r={1 * scale} fill="#FFFFFF" />
      </G>

      <G>
        <Path
          d={`M ${headCenterX - 22 * scale} ${headCenterY - headHeight * 0.28} Q ${headCenterX - 14 * scale} ${headCenterY - headHeight * 0.38} ${headCenterX - 6 * scale} ${headCenterY - headHeight * 0.28}`}
          stroke="#2C1810"
          strokeWidth={2.5 * scale}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${headCenterX + 6 * scale} ${headCenterY - headHeight * 0.28} Q ${headCenterX + 14 * scale} ${headCenterY - headHeight * 0.38} ${headCenterX + 22 * scale} ${headCenterY - headHeight * 0.28}`}
          stroke="#2C1810"
          strokeWidth={2.5 * scale}
          fill="none"
          strokeLinecap="round"
        />
      </G>

      <Path
        d={`M ${headCenterX - 4 * scale} ${headCenterY + headHeight * 0.18} Q ${headCenterX} ${headCenterY + headHeight * 0.28} ${headCenterX + 4 * scale} ${headCenterY + headHeight * 0.18}`}
        stroke={darken(skinColor, 0.15)}
        strokeWidth={1.5 * scale}
        fill="none"
      />

      {hairStyle !== 'bald' && (
        <Path
          d={getHairPath()}
          fill="url(#hairHighlight)"
          stroke={darken(hairColor, 0.15)}
          strokeWidth={1}
        />
      )}

      {glassesStyle !== 'none' && getGlassesPath() && (
        <Path
          d={getGlassesPath()!}
          fill="none"
          stroke={glassesColor}
          strokeWidth={2 * scale}
        />
      )}
    </Svg>
  );
};

export default ImprovedAvatar;
