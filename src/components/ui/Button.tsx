import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface ButtonPropsExtended extends Omit<ButtonProps, 'mode' | 'color' | 'style' | 'icon'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  disabled,
  style,
  contentStyle,
  onPress,
  ...props
}: ButtonPropsExtended) => {
  const isDisabled = disabled || loading;

  const variantStyles: Record<string, { backgroundColor: string; color: string; borderColor?: string }> = {
    primary: { backgroundColor: colors.primary, color: colors.textOnPrimary },
    secondary: { backgroundColor: colors.surface, color: colors.primary, borderColor: colors.primary },
    ghost: { backgroundColor: 'transparent', color: colors.primary },
    destructive: { backgroundColor: colors.expense, color: colors.textOnPrimary },
  };

  const sizeStyles: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, borderRadius: radius.sm },
    md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14, borderRadius: radius.md },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16, borderRadius: radius.md },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const mode = variant === 'ghost' ? 'text' : variant === 'secondary' ? 'outlined' : 'contained';

  return (
    <PaperButton
      mode={mode}
      disabled={isDisabled}
      loading={loading}
      onPress={onPress}
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          borderRadius: s.borderRadius,
          backgroundColor: v.backgroundColor,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderColor: v.borderColor,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          minHeight: size === 'sm' ? 36 : size === 'md' ? 44 : 52,
        },
        style as any,
      ]}
      contentStyle={[
        { gap: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        contentStyle,
      ]}
      labelStyle={[
        { fontSize: s.fontSize, fontWeight: '600', color: v.color, fontFamily: 'Nunito-Bold' },
      ]}
      icon={icon}
      {...props}
    >
      {children}
      {iconRight && <>{iconRight}</>}
    </PaperButton>
  );
};

Button.displayName = 'Button';