import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { AccountResponseDTO } from '@/api/types/api';

export interface AccountOption {
  id: number;
  name: string;
  type: string;
  balance: number;
}

export interface AccountPickerProps {
  value: number | null;
  onChange: (value: number | null) => void;
  accounts: AccountResponseDTO[];
  placeholder?: string;
  label?: string;
  error?: string;
  showBalance?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const AccountPicker = ({
  value,
  onChange,
  accounts,
  placeholder = 'Selecione uma conta',
  label,
  error,
  showBalance = true,
  style,
  testID,
}: AccountPickerProps) => {
  const hasError = !!error;

  return (
    <View style={style} testID={testID}>
      {label && <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.xs }}>{label}</Text>}
      <TouchableOpacity
        onPress={() => {
          const first = accounts[0];
          onChange(first?.id ?? null);
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
            borderColor: hasError ? colors.expense : colors.border,
            minHeight: 44,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ ...typography.bodyLarge, color: value ? colors.textPrimary : colors.textDisabled }}>
            {value ? accounts.find((a) => a.id === value)?.name : placeholder}
          </Text>
        </View>
        {showBalance && value && (() => {
          const acc = accounts.find((a) => a.id === value);
          return acc ? (
            <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, fontFamily: 'monospace' }}>
              {acc.balance >= 0 ? '+' : '−'}{Math.abs(acc.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          ) : null;
        })()}
      </TouchableOpacity>
      {hasError && <Text style={{ ...typography.bodySmall, color: colors.expense, marginTop: spacing.xs }}>{error}</Text>}
    </View>
  );
};