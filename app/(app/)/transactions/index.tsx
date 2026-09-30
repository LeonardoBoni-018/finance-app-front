import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTransactions } from '@/api/hooks/useTransactions';
import { useAccounts } from '@/api/hooks/useAccounts';
import { formatBRL, formatBRLSigned, formatRelativeDate, formatDateBR } from '@/utils/currency';
import { colors, spacing, typography, radius } from '@/theme/tokens';

export default function TransactionsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'current_month' | 'last_30d' | 'last_90d'>('current_month');

  const { data: accounts } = useAccounts();
  const { data: allTransactions, isLoading, refetch } = useTransactions();
  
  const transactions = allTransactions?.filter(tx => {
    if (period === 'current_month') {
      const txDate = new Date(tx.transactionDate);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (period === 'last_30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(tx.transactionDate) >= thirtyDaysAgo;
    }
    if (period === 'last_90d') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return new Date(tx.transactionDate) >= ninetyDaysAgo;
    }
    return true;
  }) ?? [];

  const income = transactions?.filter(t => t.type === 'INCOME').reduce((s, t) => s + (t.amount ?? 0), 0) ?? 0;
  const expense = transactions?.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + (t.amount ?? 0), 0) ?? 0;
  const balance = income - expense;

  const grouped = transactions?.reduce((acc, tx) => {
    const dateKey = formatDateBR(tx.transactionDate);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>) ?? {};

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleRefresh = () => refetch();

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[colors.primary]} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <PageHeader title="Transações" subtitle={`Período: ${period === 'current_month' ? 'Mês atual' : period === 'last_30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'}`} />

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <Chip label="Mês atual" variant="primary" selected={period === 'current_month'} onPress={() => setPeriod('current_month')} />
          <Chip label="30 dias" variant="default" selected={period === 'last_30d'} onPress={() => setPeriod('last_30d')} />
          <Chip label="90 dias" variant="default" selected={period === 'last_90d'} onPress={() => setPeriod('last_90d')} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
          <View style={{ flex: 1, backgroundColor: colors.incomeContainer, padding: spacing.md, borderRadius: radius.md }}>
            <Text style={{ ...typography.labelSmall, color: colors.income }}>Receitas</Text>
            <Text style={{ ...typography.titleMedium, color: colors.income, fontFamily: 'monospace' }}>{formatBRL(income)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: radius.md }}>
            <Text style={{ ...typography.labelSmall, color: colors.expense }}>Despesas</Text>
            <Text style={{ ...typography.titleMedium, color: colors.expense, fontFamily: 'monospace' }}>{formatBRL(expense)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.primaryContainer, padding: spacing.md, borderRadius: radius.md }}>
            <Text style={{ ...typography.labelSmall, color: colors.primary }}>Saldo</Text>
            <Text style={{ ...typography.titleMedium, color: balance >= 0 ? colors.income : colors.expense, fontFamily: 'monospace' }}>
              {formatBRLSigned(balance)}
            </Text>
          </View>
        </View>
      </Card>

      {transactions?.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl }}>
          <Card padding="xl" style={{ backgroundColor: colors.background, maxWidth: 300 }}>
            <View style={{ alignItems: 'center', gap: spacing.md }}>
              <Text style={{ fontSize: 48 }}>📝</Text>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary, textAlign: 'center' }}>
                Nenhuma transação neste período
              </Text>
              <Button variant="primary" onPress={() => router.push('/transactions/new')}>
                Adicionar transação
              </Button>
            </View>
          </Card>
        </View>
      ) : (
        <View style={{ paddingHorizontal: spacing.lg }}>
          {sortedDates.map((date) => (
            <View key={date} style={{ marginBottom: spacing.lg }}>
              <Text style={{ ...typography.labelSmall, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
                {formatRelativeDate(date)}
              </Text>
              {grouped[date].map((tx) => (
                <TouchableOpacity
                  key={tx.id}
                  onPress={() => router.push(`/accounts/${tx.accountId}`)}
                  style={{ marginBottom: spacing.sm }}
                >
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
                      <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
                        {tx.category?.name || 'Sem categoria'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 2 }}>
                      <Text
                        style={[
                          { ...typography.titleMedium, fontFamily: 'monospace' },
                          { color: tx.type === 'INCOME' ? colors.income : colors.expense },
                        ]}
                      >
                        {formatBRLSigned(tx.amount, tx.type)}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}