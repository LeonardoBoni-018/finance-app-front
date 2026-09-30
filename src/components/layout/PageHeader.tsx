import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, typography } from '@/theme/tokens';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const PageHeader = ({ title, subtitle, action, style, testID }: PageHeaderProps) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
      },
      style,
    ]}
    testID={testID}
  >
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text style={{ ...typography.headline, color: colors.textPrimary }}>{title}</Text>
      {subtitle && <Text style={{ ...typography.bodyMedium, color: colors.textSecondary }}>{subtitle}</Text>}
    </View>
    {action}
  </View>
);