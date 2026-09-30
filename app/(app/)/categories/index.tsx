import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Text, Modal } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCategories, useCreateCategory } from '@/api/hooks/useCategories';
import { categorySchema, type CategoryInput } from '@/utils/validation';
import { colors, spacing, typography, radius } from '@/theme/tokens';

export default function CategoriesScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'INCOME' | 'EXPENSE' | 'ALL'>('ALL');

  const { data: categories, isLoading, refetch } = useCategories(filterType === 'ALL' ? undefined : filterType);
  const { mutate: createCategory, isPending } = useCreateCategory();

  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'EXPENSE', icon: '', color: '#16A34A' },
  });

  const nameField = useController({ control, name: 'name', rules: { required: 'Nome da categoria é obrigatório', maxLength: { value: 60, message: 'Nome muito longo' } } });
  const iconField = useController({ control, name: 'icon' });
  const colorField = useController({ control, name: 'color', rules: { pattern: { value: /^#[A-Fa-f0-9]{6}$/, message: 'Cor deve ser hexadecimal (ex: #FF5733)' } } });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createCategory(data);
      setModalVisible(false);
      reset({ type: 'EXPENSE', color: '#16A34A' });
    } catch (e) {
      // error handled
    }
  });

  const handleRefresh = () => refetch();

  const defaultCategories = [
    { name: 'Alimentação', type: 'EXPENSE', icon: '🍔', color: '#EF4444' },
    { name: 'Transporte', type: 'EXPENSE', icon: '🚌', color: '#3B82F6' },
    { name: 'Moradia', type: 'EXPENSE', icon: '🏠', color: '#8B5CF6' },
    { name: 'Saúde', type: 'EXPENSE', icon: '🏥', color: '#EC4899' },
    { name: 'Lazer', type: 'EXPENSE', icon: '🎮', color: '#F59E0B' },
    { name: 'Salário', type: 'INCOME', icon: '💰', color: '#16A34A' },
    { name: 'Freelance', type: 'INCOME', icon: '💻', color: '#059669' },
    { name: 'Investimentos', type: 'INCOME', icon: '📈', color: '#0D9488' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PageHeader title="Categorias" action={
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Button variant="secondary" size="sm">Nova</Button>
          </TouchableOpacity>
        } />

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <Chip label="Todas" variant="primary" selected={filterType === 'ALL'} onPress={() => setFilterType('ALL')} />
          <Chip label="Receitas" variant="income" selected={filterType === 'INCOME'} onPress={() => setFilterType('INCOME')} />
          <Chip label="Despesas" variant="expense" selected={filterType === 'EXPENSE'} onPress={() => setFilterType('EXPENSE')} />
        </View>

        {categories?.length === 0 && defaultCategories.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl }}>
            <Card padding="xl" style={{ backgroundColor: colors.background, maxWidth: 300, marginHorizontal: spacing.lg }}>
              <View style={{ alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 48 }}>🏷️</Text>
                <Text style={{ ...typography.titleMedium, color: colors.textPrimary, textAlign: 'center' }}>
                  Nenhuma categoria
                </Text>
                <Button variant="primary" onPress={() => setModalVisible(true)} style={{ marginTop: spacing.sm }}>
                  Criar categoria
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
              Cadastradas
            </Text>
            {categories?.map((cat) => (
              <TouchableOpacity key={cat.id} style={{ marginBottom: spacing.sm }}>
                <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: cat.color ? `${cat.color}20` : colors.primaryContainer,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{cat.icon || '🏷️'}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>{cat.name}</Text>
                      <Chip variant={cat.type === 'INCOME' ? 'income' : 'expense'} label={cat.type === 'INCOME' ? 'Receita' : 'Despesa'} />
                    </View>
                    <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
                      {cat.color ? `Cor: ${cat.color}` : 'Cor padrão'}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            {defaultCategories.map((cat) => (
              <TouchableOpacity key={`${cat.type}-${cat.name}`} style={{ marginBottom: spacing.sm }}>
                <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: 0.6 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${cat.color}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Text style={{ ...typography.titleMedium, color: colors.textSecondary }}>{cat.name}</Text>
                      <Chip variant={cat.type === 'INCOME' ? 'income' : 'expense'} label={cat.type === 'INCOME' ? 'Receita' : 'Despesa'} />
                    </View>
                    <Text style={{ ...typography.bodySmall, color: colors.textDisabled }}>Sugestão padrão</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ margin: spacing.lg, borderRadius: radius.xl }}>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...typography.headline, color: colors.textPrimary }}>Nova categoria</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 24, color: colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <Input
            value={nameField.field.value}
            onChangeText={nameField.field.onChange}
            onBlur={nameField.field.onBlur}
            label="Nome da categoria"
            placeholder="Ex: Alimentação, Transporte..."
            error={errors.name?.message}
            testID="category-name"
          />

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
            <Chip label="Despesa" variant="expense" selected={watch('type') === 'EXPENSE'} onPress={() => setValue('type', 'EXPENSE')} />
            <Chip label="Receita" variant="income" selected={watch('type') === 'INCOME'} onPress={() => setValue('type', 'INCOME')} />
          </View>

          <Input
            value={iconField.field.value}
            onChangeText={iconField.field.onChange}
            onBlur={iconField.field.onBlur}
            label="Ícone (emoji)"
            placeholder="🍔, 🚌, 💰..."
            testID="category-icon"
          />

          <Input
            value={colorField.field.value}
            onChangeText={colorField.field.onChange}
            onBlur={colorField.field.onBlur}
            label="Cor (hex)"
            placeholder="#16A34A"
            error={errors.color?.message}
            testID="category-color"
          />

          <Button variant="primary" size="lg" fullWidth loading={isPending} onPress={handleSubmit(async (data) => {
            try {
              await createCategory(data);
              setModalVisible(false);
              reset({ type: 'EXPENSE', color: '#16A34A' });
            } catch (e) {
              // error handled
            }
          })} style={{ marginTop: spacing.md }} testID="category-create">
            Criar categoria
          </Button>
        </View>
      </Modal>
    </View>
  );
}