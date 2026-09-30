import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, Modal } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PageHeader } from '@/components/layout/PageHeader';
import { DatePicker } from '@/components/forms/DatePicker';
import { CategoryPicker } from '@/components/forms/CategoryPicker';
import { useTransactions } from '@/api/hooks/useTransactions';
import { useCreateTransaction } from '@/api/hooks/useTransactions';
import { useAccounts } from '@/api/hooks/useAccounts';
import { useCategories } from '@/api/hooks/useCategories';
import { transactionSchema, type TransactionInput } from '@/utils/validation';
import { formatBRL, formatBRLSigned, formatRelativeDate } from '@/utils/currency';
import { colors, spacing, typography, radius } from '@/theme/tokens';

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const accountId = Number(id);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: accounts } = useAccounts();
  const account = accounts?.find(a => a.id === accountId);
  const { data: transactions, isLoading: txLoading, refetch } = useTransactions();
  const { data: categories } = useCategories();
  const { mutate: createTx, isPending } = useCreateTransaction();

  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      type: 'EXPENSE' as const,
      transactionDate: new Date().toISOString().split('T')[0],
      accountId,
      categoryId: null,
    },
  });

  const descField = useController({ control, name: 'description', rules: { required: 'Descrição é obrigatória', maxLength: { value: 150, message: 'Descrição muito longa' } } });
  const amountField = useController({ control, name: 'amount', rules: { required: 'Valor é obrigatório' } });
  const categoryField = useController({ control, name: 'categoryId' });
  const dateField = useController({ control, name: 'transactionDate' });

  const income = transactions?.filter(t => t.type === 'INCOME').reduce((s, t) => s + (t.amount ?? 0), 0) ?? 0;
  const expense = transactions?.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + (t.amount ?? 0), 0) ?? 0;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const amount = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
      await createTx({ ...data, amount, type: watch('type') ?? 'EXPENSE', accountId });
      setModalVisible(false);
      reset({ type: 'EXPENSE', transactionDate: new Date().toISOString().split('T')[0] });
    } catch (e) {
      // error handled
    }
  });

  const handleRefresh = () => refetch();

  if (!account) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={txLoading} onRefresh={handleRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PageHeader
          title={account?.name || 'Conta'}
          subtitle={`${account?.type} · Saldo ${formatBRL(account?.balance ?? 0)}`}
        />

        <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
            <View style={{ flex: 1, backgroundColor: colors.incomeContainer, padding: spacing.md, borderRadius: radius.md }}>
              <Text style={{ ...typography.labelSmall, color: colors.income }}>Receitas</Text>
              <Text style={{ ...typography.titleMedium, color: colors.income, fontFamily: 'monospace' }}>{formatBRL(income)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: radius.md }}>
              <Text style={{ ...typography.labelSmall, color: colors.expense }}>Despesas</Text>
              <Text style={{ ...typography.titleMedium, color: colors.expense, fontFamily: 'monospace' }}>{formatBRL(expense)}</Text>
            </View>
          </View>
        </Card>

        {transactions?.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.lg }}>
            <Card padding="xl" style={{ backgroundColor: colors.background }}>
              <View style={{ alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 48 }}>📝</Text>
                <Text style={{ ...typography.titleMedium, color: colors.textPrimary, textAlign: 'center' }}>
                  Nenhuma transação nesta conta
                </Text>
                <Button variant="primary" onPress={() => setModalVisible(true)}>
                  Adicionar transação
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: spacing.lg }}>
            {Object.entries(
              transactions?.reduce((acc, tx) => {
                const date = tx.transactionDate;
                acc[date] = acc[date] || [];
                acc[date].push(tx);
                return acc;
              }, {} as Record<string, typeof transactions>) || {}
            )
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, txs]) => (
                <View key={date} style={{ marginBottom: spacing.lg }}>
                  <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
                    {formatRelativeDate(date)}
                  </Text>
                  {txs.map((tx) => (
                    <TouchableOpacity key={tx.id} style={{ marginBottom: spacing.sm }}>
                      <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: tx.category?.color ? `${tx.category.color}20` : (tx.type === 'INCOME' ? colors.incomeContainer : colors.expenseContainer),
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>{tx.category?.icon || (tx.type === 'INCOME' ? '📈' : '📉')}</Text>
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={{ ...typography.bodyLarge, color: colors.textPrimary }}>{tx.description}</Text>
                          <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>{tx.category?.name || 'Sem categoria'}</Text>
                        </View>
                        <Text style={[{ ...typography.titleMedium, fontFamily: 'monospace' }, { color: tx.type === 'INCOME' ? colors.income : colors.expense }]}>
                          {formatBRLSigned(tx.amount, tx.type)}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ margin: spacing.lg, borderRadius: radius.xl }}>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...typography.headline, color: colors.textPrimary }}>Nova transação</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 24, color: colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
            <Chip label="Despesa" variant="expense" selected={watch('type') === 'EXPENSE'} onPress={() => setValue('type', 'EXPENSE')} />
            <Chip label="Receita" variant="income" selected={watch('type') === 'INCOME'} onPress={() => setValue('type', 'INCOME')} />
          </View>

          <MoneyInput
            value={amountField.field.value}
            onChangeText={amountField.field.onChange}
            label="Valor"
            error={errors.amount?.message}
            testID="tx-amount"
          />

          <Input
            value={descField.field.value}
            onChangeText={descField.field.onChange}
            onBlur={descField.field.onBlur}
            label="Descrição"
            placeholder="Ex: Supermercado, Salário..."
            error={errors.description?.message}
            testID="tx-description"
          />

          <CategoryPicker
            label="Categoria"
            value={categoryField.field.value}
            onChange={categoryField.field.onChange}
            categories={categories?.map(c => ({ id: c.id, name: c.name, icon: c.icon ?? undefined, color: c.color ?? undefined, type: c.type })) ?? []}
            filterType={watch('type')}
            testID="tx-category"
          />

          <DatePicker
            label="Data"
            value={dateField.field.value}
            onChange={(d) => dateField.field.onChange(d ? d.toISOString().split('T')[0] : '')}
            error={errors.transactionDate?.message}
            testID="tx-date"
          />

          <Button variant="primary" size="lg" fullWidth loading={isPending} onPress={handleSubmit(async (data) => {
            try {
              const amount = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
              await createTx({ ...data, amount, type: watch('type') ?? 'EXPENSE', accountId });
              setModalVisible(false);
              reset({ type: 'EXPENSE', transactionDate: new Date().toISOString().split('T')[0] });
            } catch (e) {
              // error handled
            }
          })} style={{ marginTop: spacing.md }} testID="tx-submit">
            Salvar transação
          </Button>
        </View>
      </Modal>
    </View>
  );
}