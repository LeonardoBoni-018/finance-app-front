import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { CategoryResponseDTO } from '@/api/types/api';

interface CategoryOption {
  id: number;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: 'INCOME' | 'EXPENSE';
}

export interface CategoryPickerProps {
  value: number | null;
  onChange: (value: number | null) => void;
  categories: CategoryResponseDTO[];
  filterType?: 'INCOME' | 'EXPENSE';
  placeholder?: string;
  label?: string;
  error?: string;
  style?: ViewStyle;
  testID?: string;
}

export const CategoryPicker = ({
  value,
  onChange,
  categories,
  filterType,
  placeholder = 'Selecione uma categoria',
  label,
  error,
  style,
  testID,
}: CategoryPickerProps) => {
  const hasError = !!error;
  const filtered = filterType ? categories.filter((c) => c.type === filterType) : categories;

  return (
    <View style={style} testID={testID}>
      {label && <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.xs }}>{label}</Text>}
      <TouchableOpacity
        onPress={() => {
          const first = filtered[0];
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
          {value && (() => {
            const cat = categories.find((c) => c.id === value);
            if (cat?.color) {
              return <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: cat.color }} />;
            }
            return null;
          })()}
          <Text style={{ ...typography.bodyLarge, color: value ? colors.textPrimary : colors.textDisabled }}>
            {value ? categories.find((c) => c.id === value)?.name : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      {hasError && <Text style={{ ...typography.bodySmall, color: colors.expense, marginTop: spacing.xs }}>{error}</Text>}
    </View>
  );
};