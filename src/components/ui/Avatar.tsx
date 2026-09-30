import React from 'react';
import { View, ViewStyle, Image, ImageStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  testID?: string;
}

const sizeMap = {
  xs: { size: 28, fontSize: 10 },
  sm: { size: 36, fontSize: 13 },
  md: { size: 44, fontSize: 16 },
  lg: { size: 56, fontSize: 20 },
  xl: { size: 72, fontSize: 26 },
};

export const Avatar = ({ name, src, size = 'md', style, testID }: AvatarProps) => {
  const { size: avatarSize, fontSize } = sizeMap[size];
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hue = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 140;
  const bgColor = `hsl(${hue}, 55%, 45%)`;
  const textColor = '#FFFFFF';

  if (src) {
    return (
      <View
        style={[
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            overflow: 'hidden',
          },
          style,
        ]}
        testID={testID}
      >
        <Image
          source={{ uri: src }}
          style={{
            width: '100%',
            height: '100%',
          } as ImageStyle}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      testID={testID}
    >
      {initials ? (
        <Text style={{ fontSize, fontWeight: '700', fontFamily: 'Nunito-Bold', color: textColor }}>
          {initials}
        </Text>
      ) : (
        <Text style={{ fontSize: fontSize * 0.8, fontWeight: '700', fontFamily: 'Nunito-Bold', color: textColor }}>
          ?
        </Text>
      )}
    </View>
  );
};