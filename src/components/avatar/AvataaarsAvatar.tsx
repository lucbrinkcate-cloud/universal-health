import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAvatarStore } from '../../stores/avatarStore';
import { ImprovedAvatar } from './ImprovedAvatar';

interface AvataaarsAvatarProps {
  size?: number;
}

export const AvataaarsAvatar: React.FC<AvataaarsAvatarProps> = ({ size = 280 }) => {
  const { customization } = useAvatarStore();

  return (
    <View style={[styles.container, { width: size, height: size * 1.4 }]}>
      <ImprovedAvatar 
        customization={customization} 
        size={size} 
        showBody={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AvataaarsAvatar;
