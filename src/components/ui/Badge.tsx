import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'pending' | 'paid' | 'overdue' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  income: { bg: colors.incomeContainer, text: colors.income },
  expense: { bg: colors.expenseContainer, text: colors.expense },
  pending: { bg: colors.reminderPendingContainer, text: colors.reminderPending },
  paid: { bg: colors.reminderPaidContainer, text: colors.reminderPaid },
  overdue: { bg: colors.reminderOverdueContainer, text: colors.reminderOverdue },
  neutral: { bg: colors.background, text: colors.textSecondary },
};

const sizeStyles = {
  sm: { paddingHorizontal: spacing.sm, paddingVertical: 2, fontSize: 10, borderRadius: radius.sm },
  md: { paddingHorizontal: spacing.md, paddingVertical: 4, fontSize: 12, borderRadius: radius.md },
};

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  style,
  textStyle,
  testID,
}: BadgeProps) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <View
      style={[
        {
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
          borderRadius: s.borderRadius,
          backgroundColor: v.bg,
        },
        style,
      ]}
      testID={testID}
    >
      <Text
        style={[
          {
            fontSize: s.fontSize,
            fontWeight: '700',
            fontFamily: 'Nunito-Bold',
            color: v.text,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};