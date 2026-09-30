import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
  testID?: string;
}

export const DatePicker = ({
  value,
  onChange,
  label,
  placeholder = 'Selecionar data',
  error,
  style,
  testID,
}: DatePickerProps) => {
  const hasError = !!error;

  const formatDisplay = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <View style={style} testID={testID}>
      {label && <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.xs }}>{label}</Text>}
      <TouchableOpacity
        onPress={() => {
          const today = new Date();
          const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
          onChange(newDate.toISOString().split('T')[0]);
        }}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: error ? colors.expense : colors.border,
            minHeight: 44,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ fontSize: 20 }}>📅</Text>
          <Text style={{ ...typography.bodyLarge, color: value ? colors.textPrimary : colors.textDisabled }}>
            {value ? formatDisplay(value) : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      {hasError && <Text style={{ ...typography.bodySmall, color: colors.expense, marginTop: spacing.xs }}>{error}</Text>}
    </View>
  );
};

const formatDisplay = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};