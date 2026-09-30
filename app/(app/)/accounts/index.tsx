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
import { accountSchema, type AccountInput } from '@/utils/validation';
import { useAccounts, useCreateAccount } from '@/api/hooks/useAccounts';
import { formatBRL } from '@/utils/currency';
import { colors, spacing, typography, radius } from '@/theme/tokens';

export default function AccountsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: accounts, isLoading, refetch } = useAccounts();
  const { mutate: createAccount, isPending } = useCreateAccount();

  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<AccountInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', type: 'CHECKING' },
  });

  const nameField = useController({ control, name: 'name', rules: { required: 'Nome da conta é obrigatório', maxLength: { value: 100, message: 'Nome muito longo' } } });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createAccount(data);
      setModalVisible(false);
      reset();
    } catch (e) {
      // Error handled by toast in mutation
    }
  });

  const types = [
    { value: 'CHECKING', label: 'Conta Corrente', icon: '🏦' },
    { value: 'SAVINGS', label: 'Poupança', icon: '💰' },
    { value: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: '💳' },
    { value: 'WALLET', label: 'Carteira', icon: '👛' },
  ];

  const handleRefresh = () => refetch();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PageHeader title="Minhas contas" action={
          <TouchableOpacity onPress={() => { setModalVisible(true); }}>
            <Button variant="secondary" size="sm">Nova conta</Button>
          </TouchableOpacity>
        } />

        {accounts?.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl }}>
            <Card padding="xl" style={{ backgroundColor: colors.background, maxWidth: 300, marginHorizontal: spacing.lg }}>
              <View style={{ alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 48 }}>🏦</Text>
                <Text style={{ ...typography.titleMedium, color: colors.textPrimary, textAlign: 'center' }}>
                  Nenhuma conta cadastrada
                </Text>
                <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center' }}>
                  Crie sua primeira conta para começar
                </Text>
                <Button variant="primary" onPress={() => setModalVisible(true)} style={{ marginTop: spacing.sm }}>
                  Criar conta
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: spacing.lg }}>
            {accounts?.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                onPress={() => router.push(`/accounts/${acc.id}`)}
                style={{ marginBottom: spacing.md }}
              >
                <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.primaryContainer,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{types.find(t => t.value === acc.type)?.icon || '🏦'}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>{acc.name}</Text>
                      <Chip variant="default" label={types.find(t => t.value === acc.type)?.label || acc.type} />
                    </View>
                    <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
                      {acc.type === 'CREDIT_CARD' ? 'Limite' : 'Saldo'} {formatBRL(acc.balance)}
                    </Text>
                  </View>
                  <Text style={{ ...typography.titleMedium, color: colors.textPrimary, fontFamily: 'monospace' }}>
                    {formatBRL(acc.balance)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ margin: spacing.lg, borderRadius: radius.xl }}>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...typography.headline, color: colors.textPrimary }}>Nova conta</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 24, color: colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <Input
            value={nameField.field.value}
            onChangeText={nameField.field.onChange}
            onBlur={nameField.field.onBlur}
            label="Nome da conta"
            placeholder="Ex: Conta Corrente Principal"
            error={errors.name?.message}
            testID="account-name"
          />

          <View style={{ gap: spacing.sm }}>
            <Text style={{ ...typography.labelSmall, color: colors.textSecondary }}>Tipo de conta</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {types.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => { setValue('type', t.value); }}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: radius.full,
                      borderWidth: 1,
                      borderColor: watch('type') === t.value ? colors.primary : colors.border,
                      backgroundColor: watch('type') === t.value ? colors.primaryContainer : colors.surface,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{t.icon}</Text>
                  <Text
                    style={{
                      ...typography.labelLarge,
                      color: watch('type') === t.value ? colors.primary : colors.textPrimary,
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {errors.type && (
            <Text style={{ color: colors.expense, ...typography.bodySmall }}>{errors.type.message}</Text>
          )}

          <Button variant="primary" size="lg" fullWidth loading={isPending} onPress={handleSubmit(async (data) => {
            try {
              await createAccount(data);
              setModalVisible(false);
              reset();
            } catch (e) {
              // Error handled by toast in mutation
            }
          })} testID="account-create">
            Criar conta
          </Button>
        </View>
      </Modal>
    </View>
  );
}