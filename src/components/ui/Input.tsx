import React, { forwardRef, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
import { ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface InputProps extends Omit<TextInputProps, 'mode' | 'style' | 'label' | 'error' | 'theme' | 'onChangeText'> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showPasswordToggle?: boolean;
  containerStyle?: ViewStyle;
  onChangeText?: (text: string) => void;
  value?: string;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      showPasswordToggle = false,
      containerStyle,
      style,
      theme: _theme,
      onChangeText,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSecure = props.secureTextEntry && !showPassword;
    const hasError = !!error;

    const RightIcon = showPasswordToggle ? (
      <RNTextInput
        style={{ padding: spacing.sm }}
        editable={false}
        onFocus={() => setShowPassword(!showPassword)}
        accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? '👁️' : '🔒'}
      </RNTextInput>
    ) : iconRight;

    return (
      <TextInput
        ref={ref}
        mode="outlined"
        label={label}
        error={error}
        helperText={!hasError ? helperText : undefined}
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            marginBottom: spacing.xs,
          },
          containerStyle,
        ]}
        inputStyle={[
          { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
          style,
        ]}
        labelStyle={{ fontSize: typography.labelSmall.fontSize, color: colors.textSecondary, fontFamily: 'Nunito-Medium' }}
        outlineColor={hasError ? colors.expense : colors.border}
        activeOutlineColor={hasError ? colors.expense : colors.primary}
        placeholderTextColor={colors.textDisabled}
        selectionColor={colors.primary}
        underlineColor="transparent"
        right={RightIcon}
        left={iconLeft ? <>{iconLeft}</> : undefined}
        onChangeText={onChangeText}
        value={value}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';