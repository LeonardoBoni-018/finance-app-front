export const colors = {
  background: '#F6F6F3',
  surface: '#FFFFFF',
  border: '#E5E5DF',
  divider: '#E5E5DF',
  textPrimary: '#1A1A18',
  textSecondary: '#6B6B64',
  textDisabled: '#A8A8A0',
  textOnPrimary: '#FFFFFF',
  textOnSurface: '#1A1A18',
  primary: '#16A34A',
  primaryContainer: '#DCFCE7',
  primaryHover: '#15803D',
  income: '#16A34A',
  incomeContainer: '#DCFCE7',
  expense: '#B3261E',
  expenseContainer: '#FEF2F2',
  reminderPending: '#F59E0B',
  reminderPendingContainer: '#FFFBEB',
  reminderPaid: '#16A34A',
  reminderPaidContainer: '#DCFCE7',
  reminderOverdue: '#B3261E',
  reminderOverdueContainer: '#FEF2F2',
  overlay: 'rgba(0,0,0,0.32)',
  scrim: 'rgba(0,0,0,0.5)',
  surfaceDisabled: '#F5F5F0',
  onSurfaceDisabled: '#CACAC5',
  backdrop: 'rgba(0,0,0,0.5)',
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#FFFFFF',
    level3: '#FFFFFF',
    level4: '#FFFFFF',
    level5: '#FFFFFF',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fab: {
    shadowColor: '#16A34A',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const;

export const typography = {
  displayLarge: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  headline: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, letterSpacing: -0.25 },
  titleLarge: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  titleMedium: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  labelLarge: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  labelSmall: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.5 },
  numberTabular: { fontSize: 28, fontWeight: '700' as const, fontFamily: 'monospace', lineHeight: 36 },
  numberTabularSmall: { fontSize: 16, fontWeight: '600' as const, fontFamily: 'monospace', lineHeight: 22 },
} as const;

export const breakpoints = {
  sm: 360,
  md: 420,
  lg: 768,
} as const;

export const zIndex = {
  dropdown: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
} as const;