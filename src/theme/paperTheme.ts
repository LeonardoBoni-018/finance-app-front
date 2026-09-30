import { MD3Theme } from 'react-native-paper';
import { colors, spacing, radius, typography } from './tokens';

const baseFont = {
  fontFamily: 'Nunito-Regular',
  fontWeight: '400' as const,
};

const mediumFont = {
  fontFamily: 'Nunito-Medium',
  fontWeight: '500' as const,
};

const boldFont = {
  fontFamily: 'Nunito-Bold',
  fontWeight: '700' as const,
};

const semiBoldFont = {
  fontFamily: 'Nunito-SemiBold',
  fontWeight: '600' as const,
};

const defaultFont = {
  fontFamily: 'Nunito-Regular',
  fontWeight: '400' as const,
  fontSize: 14,
  lineHeight: 20,
  letterSpacing: 0.25,
};

export const paperTheme: MD3Theme = {
  version: 3,
  isV3: true,
  dark: false,
  colors: {
    primary: colors.primary,
    onPrimary: colors.textOnPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.textPrimary,
    secondary: colors.primary,
    onSecondary: colors.textOnPrimary,
    secondaryContainer: colors.primaryContainer,
    onSecondaryContainer: colors.textPrimary,
    tertiary: colors.reminderPending,
    onTertiary: colors.textOnPrimary,
    tertiaryContainer: colors.reminderPendingContainer,
    onTertiaryContainer: colors.textPrimary,
    error: colors.expense,
    onError: colors.textOnPrimary,
    errorContainer: colors.expenseContainer,
    onErrorContainer: colors.textPrimary,
    background: colors.background,
    onBackground: colors.textPrimary,
    surface: colors.surface,
    onSurface: colors.textOnSurface,
    surfaceVariant: colors.background,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    outlineVariant: colors.divider,
    shadow: '#000000',
    scrim: colors.scrim,
    inverseSurface: colors.textPrimary,
    inverseOnSurface: colors.background,
    inversePrimary: colors.primaryContainer,
    surfaceDisabled: colors.surfaceDisabled,
    onSurfaceDisabled: colors.onSurfaceDisabled,
    backdrop: colors.backdrop,
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
  },
  roundness: radius.md,
  animation: { scale: 1.0 },
  fonts: {
    displayLarge: { ...boldFont, fontSize: typography.displayLarge.fontSize, lineHeight: typography.displayLarge.lineHeight, letterSpacing: typography.displayLarge.letterSpacing },
    displayMedium: { ...boldFont, fontSize: 28, lineHeight: 36, letterSpacing: 0 },
    displaySmall: { ...boldFont, fontSize: 22, lineHeight: 28, letterSpacing: 0 },
    headlineLarge: { ...semiBoldFont, fontSize: typography.headline.fontSize, lineHeight: typography.headline.lineHeight, letterSpacing: typography.headline.letterSpacing },
    headlineMedium: { ...semiBoldFont, fontSize: 20, lineHeight: 28, letterSpacing: 0 },
    headlineSmall: { ...semiBoldFont, fontSize: 18, lineHeight: 24, letterSpacing: 0 },
    titleLarge: { ...semiBoldFont, fontSize: typography.titleLarge.fontSize, lineHeight: typography.titleLarge.lineHeight, letterSpacing: 0 },
    titleMedium: { ...semiBoldFont, fontSize: typography.titleMedium.fontSize, lineHeight: typography.titleMedium.lineHeight, letterSpacing: 0 },
    titleSmall: { ...mediumFont, fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    bodyLarge: { ...baseFont, fontSize: typography.bodyLarge.fontSize, lineHeight: typography.bodyLarge.lineHeight, letterSpacing: 0.5 },
    bodyMedium: { ...baseFont, fontSize: typography.bodyMedium.fontSize, lineHeight: typography.bodyMedium.lineHeight, letterSpacing: 0.25 },
    bodySmall: { ...baseFont, fontSize: typography.bodySmall.fontSize, lineHeight: typography.bodySmall.lineHeight, letterSpacing: 0.4 },
    labelLarge: { ...mediumFont, fontSize: typography.labelLarge.fontSize, lineHeight: typography.labelLarge.lineHeight, letterSpacing: 0.1 },
    labelMedium: { ...mediumFont, fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
    labelSmall: { ...mediumFont, fontSize: typography.labelSmall.fontSize, lineHeight: typography.labelSmall.lineHeight, letterSpacing: typography.labelSmall.letterSpacing },
  },
};