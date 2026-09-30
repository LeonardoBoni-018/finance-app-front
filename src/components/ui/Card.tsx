import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme/tokens';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: CardPadding;
  elevated?: boolean;
  onPress?: () => void;
  testID?: string;
}

export const Card = ({
  children,
  style,
  padding = 'md',
  elevated = false,
  onPress,
  testID,
  ...props
}: CardProps) => {
  const paddingMap = { none: 0, sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xxl };
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: paddingMap[padding],
            ...(elevated ? shadow.elevated : shadow.card),
          },
          style,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        testID={testID}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: paddingMap[padding],
          ...(elevated ? shadow.elevated : shadow.card),
        },
        style,
      ]}
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

Card.displayName = 'Card';