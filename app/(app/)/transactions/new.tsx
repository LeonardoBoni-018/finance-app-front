import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PageHeader } from '@/components/layout/PageHeader';
import { DatePicker } from '@/components/forms/DatePicker';
import { CategoryPicker } from '@/components/forms/CategoryPicker';
import { AccountPicker } from '@/components/forms/AccountPicker';
import { transactionSchema, type TransactionInput } from '@/utils/validation';
import { useCreateTransaction } from '@/api/hooks/useTransactions';
import { useAccounts } from '@/api/hooks/useAccounts';
import { useCategories } from '@/api/hooks/useCategories';
import { colors, spacing, typography, radius } from '@/theme/tokens';

export default function NewTransactionScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const { mutate: createTx, isPending } = useCreateTransaction();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      type,
      transactionDate: new Date().toISOString().split('T')[0],
      accountId: null,
      categoryId: null,
    },
  });

  const descField = useController({ control, name: 'description', rules: { required: 'Descrição é obrigatória', maxLength: { value: 150, message: 'Descrição muito longa' } } });
  const amountField = useController({ control, name: 'amount', rules: { required: 'Valor é obrigatório' } });
  const accountField = useController({ control, name: 'accountId' });
  const categoryField = useController({ control, name: 'categoryId' });
  const dateField = useController({ control, name: 'transactionDate' });

  const watchedType = watch('type');
  const watchedAmount = watch('amount');

  React.useEffect(() => {
    if (watchedType !== type) {
      setType(watchedType);
    }
  }, [watchedType]);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      const amount = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
      await createTx({
        ...data,
        amount,
        type: watchedType,
        accountId: data.accountId,
        categoryId: data.categoryId || undefined,
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar transação');
    }
  });

  const accountOptions = accounts?.map(a => ({
    id: a.id,
    name: a.name,
    type: a.type,
    balance: a.balance,
  })) ?? [];

  const categoryOptions = categories?.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon ?? undefined,
    color: c.color ?? undefined,
    type: c.type,
  })) ?? [];

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <PageHeader title="Nova transação" action={
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ ...typography.labelLarge, color: colors.primary }}>Cancelar</Text>
        </TouchableOpacity>
      } />

      <Card style={{ marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <Chip
            label="Despesa"
            variant="expense"
            selected={type === 'EXPENSE'}
            onPress={() => { setType('EXPENSE'); setValue('type', 'EXPENSE'); }}
          />
          <Chip
            label="Receita"
            variant="income"
            selected={type === 'INCOME'}
            onPress={() => { setType('INCOME'); setValue('type', 'INCOME'); }}
          />
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
          placeholder="Ex: Supermercado, Salário, Uber..."
          error={errors.description?.message}
          testID="tx-description"
        />

        <AccountPicker
          value={accountField.field.value}
          onChange={accountField.field.onChange}
          accounts={accountOptions}
          error={errors.accountId?.message}
          testID="tx-account"
        />

        <CategoryPicker
          value={categoryField.field.value}
          onChange={categoryField.field.onChange}
          categories={categoryOptions}
          filterType={watchedType}
          testID="tx-category"
        />

        <DatePicker
          label="Data"
          value={dateField.field.value}
          onChange={(d) => dateField.field.onChange(d ? d.toISOString().split('T')[0] : '')}
          error={errors.transactionDate?.message}
          testID="tx-date"
        />

        {error && (
          <View style={{ backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.sm }}>
            <Text style={{ color: colors.expense, ...typography.bodyMedium }}>{error}</Text>
          </View>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isPending}
          onPress={onSubmit}
          style={{ marginTop: spacing.md }}
          testID="tx-submit"
        >
          Salvar transação
        </Button>
      </Card>
    </ScrollView>
  );
}