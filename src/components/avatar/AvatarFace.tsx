import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';
import { FaceCustomization, EyeCustomization, NoseCustomization, MouthCustomization, FaceShape } from '../../stores/avatarStore';
import { darkenColor } from './colorUtils';

interface AvatarFaceProps {
  centerX: number;
  centerY: number;
  size: number;
  skinTone: string;
  face: FaceCustomization;
  eyes: EyeCustomization;
  nose: NoseCustomization;
  mouth: MouthCustomization;
}

export const AvatarFace: React.FC<AvatarFaceProps> = ({
  centerX,
  centerY,
  size,
  skinTone,
  face,
  eyes,
  nose,
  mouth,
}) => {
  const faceWidth = size;
  const faceHeight = getFaceHeight(face.shape, size);
  
  const getFacePath = (): string => {
    const hw = faceWidth / 2;
    const hh = faceHeight / 2;
    const jawMod = face.jawline === 'narrow' ? 0.85 : face.jawline === 'wide' ? 1.15 : 1;
    const cheekMod = face.cheeks === 'flat' ? 0.9 : face.cheeks === 'full' ? 1.1 : 1;
    
    switch (face.shape) {
      case 'round':
        return `
          M ${centerX} ${centerY - hh}
          C ${centerX + hw * 1.1} ${centerY - hh * 0.7} ${centerX + hw * 1.1} ${centerY + hh * 0.7} ${centerX} ${centerY + hh}
          C ${centerX - hw * 1.1} ${centerY + hh * 0.7} ${centerX - hw * 1.1} ${centerY - hh * 0.7} ${centerX} ${centerY - hh}
          Z
        `;
      case 'square':
        return `
          M ${centerX - hw} ${centerY - hh * 0.8}
          L ${centerX + hw} ${centerY - hh * 0.8}
          Q ${centerX + hw * 1.05} ${centerY} ${centerX + hw * jawMod} ${centerY + hh * 0.7}
          L ${centerX - hw * jawMod} ${centerY + hh * 0.7}
          Q ${centerX - hw * 1.05} ${centerY} ${centerX - hw} ${centerY - hh * 0.8}
          Z
        `;
      case 'heart':
        return `
          M ${centerX} ${centerY - hh}
          C ${centerX + hw * 1.2} ${centerY - hh * 0.5} ${centerX + hw * cheekMod} ${centerY} ${centerX + hw * 0.3} ${centerY + hh * 0.6}
          Q ${centerX} ${centerY + hh * 0.9} ${centerX - hw * 0.3} ${centerY + hh * 0.6}
          C ${centerX - hw * cheekMod} ${centerY} ${centerX - hw * 1.2} ${centerY - hh * 0.5} ${centerX} ${centerY - hh}
          Z
        `;
      case 'oblong':
        return `
          M ${centerX} ${centerY - hh * 1.1}
          C ${centerX + hw * 0.9} ${centerY - hh * 0.9} ${centerX + hw * 0.9} ${centerY + hh * 0.9} ${centerX} ${centerY + hh * 1.1}
          C ${centerX - hw * 0.9} ${centerY + hh * 0.9} ${centerX - hw * 0.9} ${centerY - hh * 0.9} ${centerX} ${centerY - hh * 1.1}
          Z
        `;
      default:
        return `
          M ${centerX} ${centerY - hh}
          C ${centerX + hw * 1.1} ${centerY - hh * 0.6} ${centerX + hw * cheekMod} ${centerY + hh * 0.2} ${centerX + hw * 0.4 * jawMod} ${centerY + hh * 0.8}
          Q ${centerX} ${centerY + hh * 1.1} ${centerX - hw * 0.4 * jawMod} ${centerY + hh * 0.8}
          C ${centerX - hw * cheekMod} ${centerY + hh * 0.2} ${centerX - hw * 1.1} ${centerY - hh * 0.6} ${centerX} ${centerY - hh}
          Z
        `;
    }
  };

  const eyeSpacing = eyes.spacing === 'close' ? 8 : eyes.spacing === 'wide' ? 18 : 13;
  const eyeSize = eyes.size === 'small' ? 4 : eyes.size === 'large' ? 8 : 6;
  const eyeY = centerY - faceHeight * 0.1;
  const leftEyeX = centerX - eyeSpacing;
  const rightEyeX = centerX + eyeSpacing;

  const getEyePath = (x: number): string => {
    switch (eyes.shape) {
      case 'round':
        return `M ${x - eyeSize} ${eyeY} A ${eyeSize} ${eyeSize} 0 1 1 ${x + eyeSize} ${eyeY} A ${eyeSize} ${eyeSize} 0 1 1 ${x - eyeSize} ${eyeY}`;
      case 'hooded':
        return `M ${x - eyeSize} ${eyeY} Q ${x} ${eyeY + eyeSize * 0.3} ${x + eyeSize} ${eyeY} Q ${x} ${eyeY - eyeSize * 0.8} ${x - eyeSize} ${eyeY}`;
      case 'upturned':
        return `M ${x - eyeSize} ${eyeY + 2} Q ${x} ${eyeY - eyeSize * 0.3} ${x + eyeSize} ${eyeY - 3}`;
      case 'downturned':
        return `M ${x - eyeSize} ${eyeY - 2} Q ${x} ${eyeY + eyeSize * 0.3} ${x + eyeSize} ${eyeY + 3}`;
      default:
        return `M ${x - eyeSize} ${eyeY} Q ${x} ${eyeY - eyeSize * 0.5} ${x + eyeSize} ${eyeY} Q ${x} ${eyeY + eyeSize * 0.3} ${x - eyeSize} ${eyeY}`;
    }
  };

  const browOffset = eyes.browThickness === 'thin' ? 1 : eyes.browThickness === 'thick' ? 3 : 2;
  const browY = eyeY - eyeSize - 6;

  const getBrowPath = (x: number, isLeft: boolean): string => {
    const dir = isLeft ? 1 : -1;
    switch (eyes.browShape) {
      case 'straight':
        return `M ${x - eyeSize - 2} ${browY} L ${x + eyeSize + 2} ${browY}`;
      case 'curved':
        return `M ${x - eyeSize - 2} ${browY + 2} Q ${x} ${browY - 4} ${x + eyeSize + 2} ${browY + 2}`;
      default:
        return `M ${x - eyeSize - 2} ${browY + 2} Q ${x} ${browY} ${x + eyeSize + 2} ${browY - 2}`;
    }
  };

  const noseY = centerY + faceHeight * 0.05;
  const noseWidth = nose.shape === 'small' ? 4 : nose.shape === 'large' ? 10 : nose.shape === 'wide' ? 10 : 6;
  const noseHeight = nose.shape === 'small' ? 8 : nose.shape === 'large' ? 16 : 12;

  const mouthY = centerY + faceHeight * 0.35;
  const mouthWidth = mouth.width === 'narrow' ? 8 : mouth.width === 'wide' ? 18 : 12;
  const lipThickness = mouth.lipThickness === 'thin' ? 2 : mouth.lipThickness === 'full' ? 6 : 4;

  const getMouthPath = (): string => {
    const w = mouthWidth;
    const h = lipThickness;
    switch (mouth.expression) {
      case 'smile':
        return `M ${centerX - w} ${mouthY} Q ${centerX} ${mouthY + h + 4} ${centerX + w} ${mouthY} Q ${centerX} ${mouthY - h} ${centerX - w} ${mouthY}`;
      case 'smirk':
        return `M ${centerX - w} ${mouthY + 1} Q ${centerX - w/2} ${mouthY + h} ${centerX + w/2} ${mouthY + h} Q ${centerX + w} ${mouthY + h - 1} ${centerX + w} ${mouthY + 2}`;
      default:
        return `M ${centerX - w} ${mouthY} Q ${centerX} ${mouthY + h} ${centerX + w} ${mouthY} Q ${centerX} ${mouthY - h} ${centerX - w} ${mouthY}`;
    }
  };

  const lashLength = eyes.lashLength === 'short' ? 2 : eyes.lashLength === 'long' ? 5 : 3;

  return (
    <G>
      <Path
        d={getFacePath()}
        fill={skinTone}
        stroke={darkenColor(skinTone, 0.12)}
        strokeWidth={1}
      />
      
      {face.freckles && (
        <G>
          {generateFreckles(centerX, centerY + 5, faceWidth * 0.3)}
        </G>
      )}
      
      <Path
        d={getBrowPath(leftEyeX, true)}
        fill="none"
        stroke="#2C1810"
        strokeWidth={browOffset + 1}
        strokeLinecap="round"
      />
      <Path
        d={getBrowPath(rightEyeX, false)}
        fill="none"
        stroke="#2C1810"
        strokeWidth={browOffset + 1}
        strokeLinecap="round"
      />
      
      <Path
        d={getEyePath(leftEyeX)}
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth={0.5}
      />
      <Circle cx={leftEyeX} cy={eyeY} r={eyeSize * 0.5} fill={eyes.color} />
      <Circle cx={leftEyeX + eyeSize * 0.15} cy={eyeY - eyeSize * 0.15} r={eyeSize * 0.15} fill="#FFFFFF" />
      
      <Path
        d={getEyePath(rightEyeX)}
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth={0.5}
      />
      <Circle cx={rightEyeX} cy={eyeY} r={eyeSize * 0.5} fill={eyes.color} />
      <Circle cx={rightEyeX + eyeSize * 0.15} cy={eyeY - eyeSize * 0.15} r={eyeSize * 0.15} fill="#FFFFFF" />
      
      {eyes.lashLength !== 'short' && (
        <G>
          {generateLashes(leftEyeX, eyeY, eyeSize, lashLength)}
          {generateLashes(rightEyeX, eyeY, eyeSize, lashLength)}
        </G>
      )}
      
      <Path
        d={`M ${centerX} ${noseY - noseHeight} Q ${centerX + noseWidth} ${noseY} ${centerX + noseWidth * 0.3} ${noseY + 3} L ${centerX - noseWidth * 0.3} ${noseY + 3} Q ${centerX - noseWidth} ${noseY} ${centerX} ${noseY - noseHeight}`}
        fill={darkenColor(skinTone, 0.08)}
        stroke={darkenColor(skinTone, 0.12)}
        strokeWidth={0.5}
      />
      
      <Path
        d={getMouthPath()}
        fill={mouth.expression === 'smile' ? '#E57373' : darkenColor(skinTone, 0.2)}
        stroke={darkenColor(skinTone, 0.25)}
        strokeWidth={0.5}
      />
    </G>
  );
};

function getFaceHeight(shape: FaceShape, size: number): number {
  switch (shape) {
    case 'round': return size * 0.9;
    case 'oblong': return size * 1.15;
    case 'square': return size * 0.95;
    default: return size;
  }
}

function generateFreckles(cx: number, cy: number, spread: number): React.ReactNode {
  const freckles: React.ReactNode[] = [];
  const positions = [
    [-0.8, -0.3], [-0.5, -0.1], [-0.2, -0.4],
    [0.2, -0.4], [0.5, -0.1], [0.8, -0.3],
    [-0.6, 0.2], [0.6, 0.2], [-0.4, 0.4], [0.4, 0.4],
  ];
  positions.forEach(([dx, dy], i) => {
    freckles.push(
      <Circle
        key={`freckle-${i}`}
        cx={cx + dx * spread}
        cy={cy + dy * spread}
        r={1}
        fill="#C49A6C"
        opacity={0.6}
      />
    );
  });
  return freckles;
}

function generateLashes(x: number, y: number, size: number, length: number): React.ReactNode {
  const lashes: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = -30 + i * 15;
    const rad = (angle * Math.PI) / 180;
    const startX = x - size + (i * size * 0.5);
    const startY = y - size * 0.3;
    lashes.push(
      <Path
        key={`lash-${i}`}
        d={`M ${startX} ${startY} L ${startX + Math.sin(rad) * length} ${startY - Math.cos(rad) * length}`}
        stroke="#1A1A1A"
        strokeWidth={1}
        strokeLinecap="round"
      />
    );
  }
  return lashes;
}

export default AvatarFace;
