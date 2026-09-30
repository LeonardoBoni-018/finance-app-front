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
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { DatePicker } from '@/components/forms/DatePicker';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { useReminders, useCreateReminder, useMarkReminderPaid } from '@/api/hooks/useReminders';
import { reminderSchema, type ReminderInput } from '@/utils/validation';
import { formatBRL, formatRelativeDate, isOverdue } from '@/utils/currency';
import { colors, spacing, typography, radius } from '@/theme/tokens';

const statusColors = {
  PENDING: { bg: colors.reminderPendingContainer, text: colors.reminderPending, label: 'Pendente' },
  PAID: { bg: colors.reminderPaidContainer, text: colors.reminderPaid, label: 'Pago' },
  OVERDUE: { bg: colors.reminderOverdueContainer, text: colors.reminderOverdue, label: 'Vencido' },
} as const;

export default function RemindersScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: reminders, isLoading, refetch } = useReminders();
  const { mutate: createReminder, isPending: creating } = useCreateReminder();
  const { mutate: markPaid } = useMarkReminderPaid();

  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ReminderInput>({
    resolver: zodResolver(reminderSchema),
    defaultValues: { title: '', description: '', amount: '', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  });

  const titleField = useController({ control, name: 'title', rules: { required: 'Título é obrigatório', maxLength: { value: 150, message: 'Título muito longo' } } });
  const descField = useController({ control, name: 'description' });
  const amountField = useController({ control, name: 'amount' });
  const dateField = useController({ control, name: 'dueDate' });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const amount = data.amount ? parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.')) : undefined;
      await createReminder({ ...data, amount });
      setModalVisible(false);
      reset({ dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
    } catch (e) {
      // error handled
    }
  });

  const pendingCount = reminders?.filter(r => r.status === 'PENDING').length ?? 0;

  const handleRefresh = () => refetch();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[colors.primary]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PageHeader title="Lembretes" subtitle={`${pendingCount} pendente${pendingCount !== 1 ? 's' : ''}`} action={
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Button variant="secondary" size="sm">Novo lembrete</Button>
          </TouchableOpacity>
        } />

        {reminders?.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.lg }}>
            <Card padding="xl" style={{ backgroundColor: colors.background, maxWidth: 300, marginHorizontal: spacing.lg }}>
              <View style={{ alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 48 }}>🔔</Text>
                <Text style={{ ...typography.titleMedium, color: colors.textPrimary, textAlign: 'center' }}>
                  Nenhum lembrete por aqui
                </Text>
                <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center' }}>
                  Crie lembretes para não esquecer de pagar contas
                </Text>
                <Button variant="primary" onPress={() => setModalVisible(true)} style={{ marginTop: spacing.sm }}>
                  Criar lembrete
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: spacing.lg }}>
            {reminders?.map((reminder) => {
              const status = reminder.status;
              const s = statusColors[status as keyof typeof statusColors] || statusColors.PENDING;
              const overdue = reminder.status === 'PENDING' && isOverdue(reminder.dueDate);

              return (
                <TouchableOpacity key={reminder.id} style={{ marginBottom: spacing.md }}>
                  <Card padding="md" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: s.text, marginTop: 8, flexShrink: 0 }} />
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>{reminder.title}</Text>
                        <Badge variant={overdue ? 'overdue' : status.toLowerCase() as any}>{s.label}</Badge>
                      </View>
                      {reminder.description && (
                        <Text style={{ ...typography.bodyMedium, color: colors.textSecondary }}>{reminder.description}</Text>
                      )}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        {reminder.amount && (
                          <Text style={{ ...typography.bodyMedium, color: colors.textPrimary, fontFamily: 'monospace' }}>
                            {formatBRL(reminder.amount)}
                          </Text>
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                          <Text style={{ fontSize: 14 }}>📅</Text>
                          <Text style={{ ...typography.bodySmall, color: overdue ? colors.reminderOverdue : colors.textSecondary }}>
                            Vence {formatRelativeDate(reminder.dueDate)}
                            {overdue && ' • VENCIDO'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {reminder.status === 'PENDING' && (
                      <TouchableOpacity onPress={() => markPaid(reminder.id)}>
                        <Badge variant={overdue ? 'overdue' : 'pending'} size="sm">Marcar pago</Badge>
                      </TouchableOpacity>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ margin: spacing.lg, borderRadius: radius.xl }}>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...typography.headline, color: colors.textPrimary }}>Novo lembrete</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 24, color: colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <Input
            value={titleField.field.value}
            onChangeText={titleField.field.onChange}
            onBlur={titleField.field.onBlur}
            label="Título"
            placeholder="Ex: Conta de luz, Cartão de crédito..."
            error={errors.title?.message}
            testID="reminder-title"
          />

          <Input
            value={descField.field.value}
            onChangeText={descField.field.onChange}
            onBlur={descField.field.onBlur}
            label="Descrição (opcional)"
            placeholder="Detalhes..."
            multiline
            numberOfLines={3}
            testID="reminder-description"
          />

          <MoneyInput
            value={amountField.field.value}
            onChangeText={amountField.field.onChange}
            label="Valor (opcional)"
            testID="reminder-amount"
          />

          <DatePicker
            label="Data de vencimento"
            value={dateField.field.value}
            onChange={dateField.field.onChange}
            error={errors.dueDate?.message}
            testID="reminder-date"
          />

          <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
            Você receberá um e-mail 3 dias antes do vencimento.
          </Text>

          <Button variant="primary" size="lg" fullWidth loading={creating} onPress={handleSubmit(async (data) => {
            try {
              const amount = data.amount ? parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.')) : undefined;
              await createReminder({ ...data, amount });
              setModalVisible(false);
              reset({ dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
            } catch (e) {
              // error handled
            }
          })} style={{ marginTop: spacing.md }} testID="reminder-create">
            Criar lembrete
          </Button>
        </View>
      </Modal>
    </View>
  );
}