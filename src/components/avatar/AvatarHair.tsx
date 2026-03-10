import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { HairCustomization } from '../../stores/avatarStore';
import { darkenColor } from './colorUtils';

interface AvatarHairProps {
  centerX: number;
  headTop: number;
  headCenterY: number;
  headWidth: number;
  headHeight: number;
  hair: HairCustomization;
}

export const AvatarHair: React.FC<AvatarHairProps> = ({
  centerX,
  headTop,
  headCenterY,
  headWidth,
  headHeight,
  hair,
}) => {
  if (hair.style === 'bald') {
    return null;
  }

  const hw = headWidth / 2;
  const hh = headHeight / 2;
  
  const getHairStylePath = (): string => {
    const texture = hair.texture;
    const waveMod = texture === 'wavy' ? 5 : texture === 'curly' ? 8 : texture === 'coily' ? 12 : 0;
    
    switch (hair.style) {
      case 'short':
        return `
          M ${centerX - hw * 0.9} ${headCenterY - hh * 0.3}
          Q ${centerX - hw * 1.05} ${headCenterY - hh * 0.8} ${centerX} ${headTop - 3}
          Q ${centerX + hw * 1.05} ${headCenterY - hh * 0.8} ${centerX + hw * 0.9} ${headCenterY - hh * 0.3}
          Q ${centerX + hw * 0.95} ${headCenterY - hh * 1.1} ${centerX} ${headTop - 8}
          Q ${centerX - hw * 0.95} ${headCenterY - hh * 1.1} ${centerX - hw * 0.9} ${headCenterY - hh * 0.3}
          Z
        `;
      
      case 'medium':
        return `
          M ${centerX - hw * 0.85} ${headCenterY + hh * 0.5}
          Q ${centerX - hw * 1.05 - waveMod} ${headCenterY - hh * 0.5} ${centerX - hw * 0.9} ${headCenterY - hh * 0.8}
          Q ${centerX - hw} ${headCenterY - hh * 1.15} ${centerX} ${headTop - 10}
          Q ${centerX + hw} ${headCenterY - hh * 1.15} ${centerX + hw * 0.9} ${headCenterY - hh * 0.8}
          Q ${centerX + hw * 1.05 + waveMod} ${headCenterY - hh * 0.5} ${centerX + hw * 0.85} ${headCenterY + hh * 0.5}
          Q ${centerX + hw * 0.9} ${headCenterY + hh * 0.8} ${centerX + hw * 0.5} ${headCenterY + hh * 1.1}
          Q ${centerX} ${headCenterY + hh * 0.9} ${centerX - hw * 0.5} ${headCenterY + hh * 1.1}
          Q ${centerX - hw * 0.9} ${headCenterY + hh * 0.8} ${centerX - hw * 0.85} ${headCenterY + hh * 0.5}
          Z
        `;
      
      case 'long':
        return `
          M ${centerX - hw * 0.7} ${headCenterY + hh * 1.5}
          Q ${centerX - hw * 1.1 - waveMod} ${headCenterY + hh * 0.5} ${centerX - hw * 1.05 - waveMod} ${headCenterY - hh * 0.3}
          Q ${centerX - hw * 1.1} ${headCenterY - hh * 1.1} ${centerX} ${headTop - 12}
          Q ${centerX + hw * 1.1} ${headCenterY - hh * 1.1} ${centerX + hw * 1.05 + waveMod} ${headCenterY - hh * 0.3}
          Q ${centerX + hw * 1.1 + waveMod} ${headCenterY + hh * 0.5} ${centerX + hw * 0.7} ${headCenterY + hh * 1.5}
          L ${centerX + hw * 0.5} ${headCenterY + hh * 1.3}
          Q ${centerX} ${headCenterY + hh * 1.1} ${centerX - hw * 0.5} ${headCenterY + hh * 1.3}
          Z
        `;
      
      case 'curly':
        return `
          M ${centerX - hw * 1.1} ${headCenterY + hh * 0.8}
          C ${centerX - hw * 1.25} ${headCenterY} ${centerX - hw * 1.2} ${headCenterY - hh * 0.8} ${centerX - hw * 0.9} ${headCenterY - hh * 1.1}
          C ${centerX - hw * 0.5} ${headTop - 20} ${centerX + hw * 0.5} ${headTop - 20} ${centerX + hw * 0.9} ${headCenterY - hh * 1.1}
          C ${centerX + hw * 1.2} ${headCenterY - hh * 0.8} ${centerX + hw * 1.25} ${headCenterY} ${centerX + hw * 1.1} ${headCenterY + hh * 0.8}
          C ${centerX + hw * 1.15} ${headCenterY + hh * 1.2} ${centerX} ${headCenterY + hh * 1.3} ${centerX - hw * 1.15} ${headCenterY + hh * 0.8}
          Z
        `;
      
      case 'wavy':
        return `
          M ${centerX - hw * 0.9} ${headCenterY + hh * 1.2}
          Q ${centerX - hw * 1.1 - waveMod} ${headCenterY + hh * 0.3} ${centerX - hw * 1.05 - waveMod * 0.5} ${headCenterY - hh * 0.5}
          Q ${centerX - hw * 1.1} ${headCenterY - hh * 1.1} ${centerX} ${headTop - 10}
          Q ${centerX + hw * 1.1} ${headCenterY - hh * 1.1} ${centerX + hw * 1.05 + waveMod * 0.5} ${headCenterY - hh * 0.5}
          Q ${centerX + hw * 1.1 + waveMod} ${headCenterY + hh * 0.3} ${centerX + hw * 0.9} ${headCenterY + hh * 1.2}
          Q ${centerX} ${headCenterY + hh * 1.4} ${centerX - hw * 0.9} ${headCenterY + hh * 1.2}
          Z
        `;
      
      case 'spiky':
        return `
          M ${centerX - hw * 0.8} ${headCenterY - hh * 0.4}
          L ${centerX - hw * 0.6} ${headTop - 25}
          L ${centerX - hw * 0.3} ${headCenterY - hh * 0.6}
          L ${centerX} ${headTop - 30}
          L ${centerX + hw * 0.3} ${headCenterY - hh * 0.6}
          L ${centerX + hw * 0.6} ${headTop - 25}
          L ${centerX + hw * 0.8} ${headCenterY - hh * 0.4}
          Q ${centerX + hw} ${headCenterY - hh * 1.1} ${centerX} ${headTop - 12}
          Q ${centerX - hw} ${headCenterY - hh * 1.1} ${centerX - hw * 0.8} ${headCenterY - hh * 0.4}
          Z
        `;
      
      case 'ponytail':
        return `
          M ${centerX - hw * 0.85} ${headCenterY - hh * 0.2}
          Q ${centerX - hw * 1.05} ${headCenterY - hh * 0.8} ${centerX} ${headTop - 8}
          Q ${centerX + hw * 1.05} ${headCenterY - hh * 0.8} ${centerX + hw * 0.85} ${headCenterY - hh * 0.2}
          Q ${centerX + hw * 0.95} ${headCenterY - hh * 1.05} ${centerX} ${headTop - 10}
          Q ${centerX - hw * 0.95} ${headCenterY - hh * 1.05} ${centerX - hw * 0.85} ${headCenterY - hh * 0.2}
          Z
          M ${centerX + hw * 0.3} ${headTop - 5}
          Q ${centerX + hw * 0.8} ${headTop - 15} ${centerX + hw * 0.6} ${headCenterY + hh * 1.8}
          Q ${centerX + hw * 0.3} ${headCenterY + hh * 1.6} ${centerX + hw * 0.5} ${headCenterY + hh * 1.2}
          Q ${centerX + hw * 0.4} ${headTop} ${centerX + hw * 0.3} ${headTop - 5}
          Z
        `;
      
      case 'bun':
        return `
          M ${centerX - hw * 0.85} ${headCenterY - hh * 0.2}
          Q ${centerX - hw * 1.05} ${headCenterY - hh * 0.8} ${centerX} ${headTop - 8}
          Q ${centerX + hw * 1.05} ${headCenterY - hh * 0.8} ${centerX + hw * 0.85} ${headCenterY - hh * 0.2}
          Q ${centerX + hw * 0.95} ${headCenterY - hh * 1.05} ${centerX} ${headTop - 10}
          Q ${centerX - hw * 0.95} ${headCenterY - hh * 1.05} ${centerX - hw * 0.85} ${headCenterY - hh * 0.2}
          Z
        `;
      
      case 'afro':
        return `
          M ${centerX - hw * 1.35} ${headCenterY}
          C ${centerX - hw * 1.5} ${headCenterY - hh * 0.5} ${centerX - hw * 1.4} ${headCenterY - hh * 1.3} ${centerX} ${headTop - 25}
          C ${centerX + hw * 1.4} ${headCenterY - hh * 1.3} ${centerX + hw * 1.5} ${headCenterY - hh * 0.5} ${centerX + hw * 1.35} ${headCenterY}
          C ${centerX + hw * 1.45} ${headCenterY + hh * 0.6} ${centerX + hw * 1.2} ${headCenterY + hh * 1.2} ${centerX} ${headCenterY + hh * 1.35}
          C ${centerX - hw * 1.2} ${headCenterY + hh * 1.2} ${centerX - hw * 1.45} ${headCenterY + hh * 0.6} ${centerX - hw * 1.35} ${headCenterY}
          Z
        `;
      
      case 'mohawk':
        return `
          M ${centerX - hw * 0.15} ${headCenterY - hh * 0.3}
          L ${centerX - hw * 0.1} ${headTop - 35}
          L ${centerX} ${headTop - 40}
          L ${centerX + hw * 0.1} ${headTop - 35}
          L ${centerX + hw * 0.15} ${headCenterY - hh * 0.3}
          Q ${centerX + hw * 0.2} ${headCenterY - hh * 0.8} ${centerX} ${headCenterY - hh * 0.9}
          Q ${centerX - hw * 0.2} ${headCenterY - hh * 0.8} ${centerX - hw * 0.15} ${headCenterY - hh * 0.3}
          Z
        `;
      
      case 'undercut':
        return `
          M ${centerX - hw * 0.5} ${headCenterY - hh * 0.5}
          Q ${centerX - hw * 0.7} ${headCenterY - hh * 0.9} ${centerX} ${headTop - 15}
          Q ${centerX + hw * 0.7} ${headCenterY - hh * 0.9} ${centerX + hw * 0.5} ${headCenterY - hh * 0.5}
          Q ${centerX + hw * 0.6} ${headCenterY - hh * 1.05} ${centerX} ${headTop - 12}
          Q ${centerX - hw * 0.6} ${headCenterY - hh * 1.05} ${centerX - hw * 0.5} ${headCenterY - hh * 0.5}
          Z
        `;
      
      default:
        return `
          M ${centerX - hw * 0.9} ${headCenterY - hh * 0.3}
          Q ${centerX - hw * 1.05} ${headCenterY - hh * 0.8} ${centerX} ${headTop - 3}
          Q ${centerX + hw * 1.05} ${headCenterY - hh * 0.8} ${centerX + hw * 0.9} ${headCenterY - hh * 0.3}
          Q ${centerX + hw * 0.95} ${headCenterY - hh * 1.1} ${centerX} ${headTop - 8}
          Q ${centerX - hw * 0.95} ${headCenterY - hh * 1.1} ${centerX - hw * 0.9} ${headCenterY - hh * 0.3}
          Z
        `;
    }
  };

  const getFacialHairPath = (): string | null => {
    const mouthY = headCenterY + hh * 0.55;
    const chinY = headCenterY + hh * 0.85;
    
    switch (hair.facialHair) {
      case 'stubble':
        return null;
      case 'mustache':
        return `
          M ${centerX - hw * 0.35} ${mouthY - 5}
          Q ${centerX} ${mouthY + 2} ${centerX + hw * 0.35} ${mouthY - 5}
          Q ${centerX} ${mouthY - 3} ${centerX - hw * 0.35} ${mouthY - 5}
          Z
        `;
      case 'goatee':
        return `
          M ${centerX - hw * 0.2} ${mouthY + 5}
          Q ${centerX} ${chinY + 10} ${centerX + hw * 0.2} ${mouthY + 5}
          Q ${centerX} ${chinY + 5} ${centerX - hw * 0.2} ${mouthY + 5}
          Z
        `;
      case 'beard':
        return `
          M ${centerX - hw * 0.7} ${headCenterY + hh * 0.2}
          Q ${centerX - hw * 0.8} ${chinY} ${centerX - hw * 0.4} ${chinY + 12}
          Q ${centerX} ${chinY + 18} ${centerX + hw * 0.4} ${chinY + 12}
          Q ${centerX + hw * 0.8} ${chinY} ${centerX + hw * 0.7} ${headCenterY + hh * 0.2}
          L ${centerX + hw * 0.5} ${headCenterY + hh * 0.25}
          Q ${centerX} ${chinY + 10} ${centerX - hw * 0.5} ${headCenterY + hh * 0.25}
          Z
        `;
      case 'full':
        return `
          M ${centerX - hw * 0.85} ${headCenterY + hh * 0.1}
          Q ${centerX - hw * 1.05} ${chinY - 5} ${centerX - hw * 0.5} ${chinY + 15}
          Q ${centerX} ${chinY + 25} ${centerX + hw * 0.5} ${chinY + 15}
          Q ${centerX + hw * 1.05} ${chinY - 5} ${centerX + hw * 0.85} ${headCenterY + hh * 0.1}
          L ${centerX + hw * 0.6} ${headCenterY + hh * 0.15}
          Q ${centerX} ${chinY + 18} ${centerX - hw * 0.6} ${headCenterY + hh * 0.15}
          Z
        `;
      default:
        return null;
    }
  };

  const facialHairPath = getFacialHairPath();

  return (
    <G>
      <Path
        d={getHairStylePath()}
        fill={hair.color}
        stroke={darkenColor(hair.color, 0.2)}
        strokeWidth={1}
      />
      
      {hair.style === 'bun' && (
        <Circle
          cx={centerX}
          cy={headTop - 20}
          r={headWidth * 0.28}
          fill={hair.color}
          stroke={darkenColor(hair.color, 0.2)}
          strokeWidth={1}
        />
      )}
      
      {hair.highlights && (
        <Path
          d={getHairStylePath()}
          fill={hair.highlights}
          opacity={0.3}
        />
      )}
      
      {hair.facialHair === 'stubble' && (
        <G>
          {generateStubble(centerX, headCenterY + hh * 0.5, headWidth * 0.6)}
        </G>
      )}
      
      {facialHairPath && (
        <Path
          d={facialHairPath}
          fill={hair.facialHairColor}
          stroke={darkenColor(hair.facialHairColor, 0.15)}
          strokeWidth={0.5}
        />
      )}
    </G>
  );
};

function generateStubble(cx: number, cy: number, width: number): React.ReactNode {
  const stubble: React.ReactNode[] = [];
  const density = 40;
  for (let i = 0; i < density; i++) {
    const x = cx - width / 2 + Math.random() * width;
    const y = cy - 10 + Math.random() * 25;
    stubble.push(
      <Circle
        key={`stubble-${i}`}
        cx={x}
        cy={y}
        r={0.5}
        fill="#1A1A1A"
        opacity={0.5}
      />
    );
  }
  return stubble;
}

export default AvatarHair;
