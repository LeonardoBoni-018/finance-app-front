import React from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAccounts } from '@/api/hooks/useAccounts';
import { useTransactions } from '@/api/hooks/useTransactions';
import { useReminders } from '@/api/hooks/useReminders';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatBRL, formatBRLSigned, formatRelativeDate } from '@/utils/currency';
import { colors, spacing, typography } from '@/theme/tokens';

export default function HomeScreen() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactions, isLoading: txLoading } = useTransactions({ period: 'current_month' });
  const { data: reminders } = useReminders();

  const totalBalance = accounts?.reduce((sum, a) => sum + (a.balance ?? 0), 0) ?? 0;
  const monthlyIncome = transactions?.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0;
  const monthlyExpense = transactions?.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0;
  const pendingReminders = reminders?.filter(r => r.status === 'PENDING').length ?? 0;

  const recentTx = transactions?.slice(0, 5) ?? [];
  const topAccounts = accounts?.slice(0, 3) ?? [];

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={accountsLoading || txLoading}
          colors={[colors.primary]}
        />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <PageHeader
        title={`Olá, ${accounts?.[0]?.user?.name?.split(' ')[0] || 'Usuário'}`}
        subtitle="Resumo do mês"
      />

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="lg">
        <Text style={{ ...typography.labelLarge, color: colors.textSecondary }}>Saldo consolidado</Text>
        <Text style={{ ...typography.numberTabular, color: colors.textPrimary, marginTop: spacing.xs }}>
          {formatBRL(totalBalance)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, gap: spacing.md }}>
          <View style={{ flex: 1, backgroundColor: colors.incomeContainer, padding: spacing.md, borderRadius: 12 }}>
            <Text style={{ ...typography.labelSmall, color: colors.income }}>Receitas</Text>
            <Text style={{ ...typography.titleMedium, color: colors.income, fontFamily: 'monospace' }}>{formatBRL(monthlyIncome)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: 12 }}>
            <Text style={{ ...typography.labelSmall, color: colors.expense }}>Despesas</Text>
            <Text style={{ ...typography.titleMedium, color: colors.expense, fontFamily: 'monospace' }}>{formatBRL(monthlyExpense)}</Text>
          </View>
        </View>
      </Card>

      <PageHeader title="Minhas contas" action={
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ ...typography.labelLarge, color: colors.primary }}>Ver todas</Text>
        </TouchableOpacity>
      } />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md }}
      >
        {topAccounts.map((acc) => (
          <TouchableOpacity
            key={acc.id}
            onPress={() => {}}
            style={{ width: 180 }}
          >
            <Card padding="md" style={{ minHeight: 120 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>{acc.name}</Text>
                  <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 }}>{acc.type}</Text>
                </View>
              </View>
              <Text style={{ ...typography.numberTabularSmall, color: colors.textPrimary, marginTop: spacing.md, fontFamily: 'monospace' }}>
                {formatBRL(acc.balance)}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
        {!accountsLoading && accounts && accounts.length > 3 && (
          <TouchableOpacity onPress={() => {}} style={{ width: 180 }}>
            <Card padding="md" style={{ minHeight: 120, backgroundColor: colors.background, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...typography.labelLarge, color: colors.primary }}>Ver todas</Text>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs }}>{accounts.length} contas</Text>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>

      <PageHeader title="Últimas transações" action={
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ ...typography.labelLarge, color: colors.primary }}>Ver todas</Text>
        </TouchableOpacity>
      } />

      {recentTx.length === 0 ? (
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Card padding="lg" style={{ backgroundColor: colors.background }}>
            <View style={{ alignItems: 'center', gap: spacing.md }}>
              <Text style={{ fontSize: 32 }}>📝</Text>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>Nenhuma transação ainda</Text>
              <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center' }}>
                Toque no botão + para adicionar sua primeira transação
              </Text>
            </View>
          </Card>
        </View>
      ) : (
        <View style={{ paddingHorizontal: spacing.lg }}>
          {recentTx.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              onPress={() => {}}
              style={{ marginBottom: spacing.sm }}
            >
              <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: tx.category?.color ? `${tx.category.color}20` : colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{tx.category?.icon || (tx.type === 'INCOME' ? '📈' : '📉')}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ ...typography.bodyLarge, color: colors.textPrimary }}>{tx.description}</Text>
                  <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
                    {tx.category?.name || 'Sem categoria'} · {formatRelativeDate(tx.transactionDate)}
                  </Text>
                </View>
                <Text
                  style={[
                    { ...typography.titleMedium, fontFamily: 'monospace' },
                    { color: tx.type === 'INCOME' ? colors.income : colors.expense },
                  ]}
                >
                  {formatBRLSigned(tx.amount, tx.type)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {pendingReminders > 0 && (
        <View style={{ marginTop: spacing.lg, paddingHorizontal: spacing.lg }}>
          <PageHeader title="Lembretes pendentes" action={
            <TouchableOpacity onPress={() => {}}>
              <Text style={{ ...typography.labelLarge, color: colors.primary }}>{pendingReminders} ver</Text>
            </TouchableOpacity>
          } />
          <Card padding="md" style={{ backgroundColor: colors.reminderPendingContainer }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Text style={{ fontSize: 24 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>
                  {pendingReminders} lembrete{pendingReminders > 1 ? 's' : ''} pendente{pendingReminders > 1 ? 's' : ''}
                </Text>
                <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Toque para ver detalhes</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={{ ...typography.labelLarge, color: colors.reminderPending }}>Ver</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}