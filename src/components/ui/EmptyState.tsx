import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, typography } from '@/theme/tokens';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'warning' | 'success' | 'error';
  style?: ViewStyle;
  testID?: string;
}

const variantIcons = {
  default: <Text style={{ fontSize: 48 }}>🔔</Text>,
  warning: <Text style={{ fontSize: 48, color: '#F59E0B' }}>⚠️</Text>,
  success: <Text style={{ fontSize: 48, color: '#16A34A' }}>✅</Text>,
  error: <Text style={{ fontSize: 48, color: '#B3261E' }}>❌</Text>,
};

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  style,
  testID,
}: EmptyStateProps) => (
  <View
    style={[
      {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
        gap: spacing.md,
      },
      style,
    ]}
    testID={testID}
  >
    {icon ?? variantIcons[variant]}
    <Text style={{ ...typography.headline, color: colors.textPrimary, textAlign: 'center' }}>{title}</Text>
    {description && (
      <Text style={{ ...typography.bodyLarge, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
        {description}
      </Text>
    )}
    {actionLabel && onAction && (
      <Text
        onPress={onAction}
        style={{
          ...typography.labelLarge,
          color: colors.primary,
          textDecorationLine: 'underline',
          marginTop: spacing.sm,
        }}
        accessibilityRole="button"
      >
        {actionLabel}
      </Text>
    )}
  </View>
);