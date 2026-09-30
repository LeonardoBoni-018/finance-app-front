import React, { forwardRef } from 'react';
import { TextInput } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
import { ViewStyle } from 'react-native';
import { formatBRL, parseBRL } from '@/utils/currency';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface MoneyInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const MoneyInput = forwardRef<RNTextInput, MoneyInputProps>(
  ({ value, onChangeText, placeholder = 'R$ 0,00', label, error, disabled, style, testID, ...props }, ref) => {
    const hasError = !!error;

    const handleChange = (text: string) => {
      const digits = text.replace(/\D/g, '');
      if (!digits) {
        onChangeText('');
        return;
      }
      const formatted = (parseInt(digits, 10) / 100).toFixed(2);
      const formattedStr = `R$ ${formatted.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
      onChangeText(formattedStr);
    };

    const displayValue = value || '';

    return (
      <TextInput
        ref={ref}
        mode="outlined"
        label={label}
        value={displayValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            marginBottom: spacing.xs,
          },
          style,
        ]}
        inputStyle={[
          {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            fontSize: typography.numberTabular.fontSize,
            fontFamily: 'monospace',
            textAlign: 'right',
            color: colors.textPrimary,
          },
        ]}
        labelStyle={{ fontSize: typography.labelSmall.fontSize, color: colors.textSecondary, fontFamily: 'Nunito-Medium' }}
        outlineColor={hasError ? colors.expense : colors.border}
        activeOutlineColor={hasError ? colors.expense : colors.primary}
        placeholderTextColor={colors.textDisabled}
        selectionColor={colors.primary}
        underlineColor="transparent"
        keyboardType="numeric"
        textAlign="right"
        testID={testID}
        {...props}
      />
    );
  }
);

MoneyInput.displayName = 'MoneyInput';