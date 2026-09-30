import React from 'react';
import { View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography, shadow } from '@/theme/tokens';

export interface ChipProps {
  label: string;
  variant?: 'default' | 'income' | 'expense' | 'pending' | 'paid' | 'overdue' | 'primary';
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const variantColors: Record<string, { bg: string; text: string; border?: string }> = {
  default: { bg: colors.background, text: colors.textPrimary, border: colors.border },
  income: { bg: colors.incomeContainer, text: colors.income },
  expense: { bg: colors.expenseContainer, text: colors.expense },
  pending: { bg: colors.reminderPendingContainer, text: colors.reminderPending },
  paid: { bg: colors.reminderPaidContainer, text: colors.reminderPaid },
  overdue: { bg: colors.reminderOverdueContainer, text: colors.reminderOverdue },
  primary: { bg: colors.primaryContainer, text: colors.primary },
};

export const Chip = ({
  label,
  variant = 'default',
  icon,
  selected,
  onPress,
  style,
  labelStyle,
  testID,
}: ChipProps) => {
  const v = variantColors[variant];
  const isSelected = selected || onPress;

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: radius.full,
            backgroundColor: isSelected ? v.text : v.bg,
            borderWidth: v.border ? 1 : 0,
            borderColor: v.border,
            ...shadow.card,
          },
          style,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        testID={testID}
      >
        {icon && <View style={{ marginRight: spacing.xs }}>{icon}</View>}
        <Text
          style={[
            {
              fontSize: typography.labelSmall.fontSize,
              fontWeight: '600',
              fontFamily: 'Nunito-Bold',
              color: isSelected ? colors.textOnPrimary : v.text,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.full,
          backgroundColor: isSelected ? v.text : v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          ...shadow.card,
        },
        style,
      ]}
      testID={testID}
    >
      {icon && <View style={{ marginRight: spacing.xs }}>{icon}</View>}
      <Text
        style={[
          {
            fontSize: typography.labelSmall.fontSize,
            fontWeight: '600',
            fontFamily: 'Nunito-Bold',
            color: isSelected ? colors.textOnPrimary : v.text,
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

Chip.displayName = 'Chip';