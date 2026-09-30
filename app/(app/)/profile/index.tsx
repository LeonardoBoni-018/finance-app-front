import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { authStore } from '@/store/authStore';
import { formatDateBR } from '@/utils/currency';
import { colors, spacing, typography } from '@/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, accessToken } = authStore();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={{ alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg, gap: spacing.md }}>
        <Avatar name={user?.name || 'Usuário'} size="xl" />
        <Text style={{ ...typography.headline, color: colors.textPrimary }}>{user?.name || 'Usuário'}</Text>
        <Text style={{ ...typography.bodyMedium, color: colors.textSecondary }}>{user?.email || ''}</Text>
        {user?.createdAt && (
          <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>
            Membro desde {formatDateBR(user.createdAt, 'MMMM/yyyy')}
          </Text>
        )}
      </View>

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={{ fontSize: 24 }}>🔐</Text>
            <View>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>Segurança</Text>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Alterar senha, biometria</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Em desenvolvimento')}>
            <Text style={{ ...typography.labelLarge, color: colors.primary }}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={{ fontSize: 24 }}>🔔</Text>
            <View>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>Notificações</Text>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>E-mail, push, lembretes</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Em desenvolvimento')}>
            <Text style={{ ...typography.labelLarge, color: colors.primary }}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={{ fontSize: 24 }}>🎨</Text>
            <View>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>Aparência</Text>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Tema claro/escuro</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Em desenvolvimento')}>
            <Text style={{ ...typography.labelLarge, color: colors.primary }}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }} padding="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={{ fontSize: 24 }}>ℹ️</Text>
            <View>
              <Text style={{ ...typography.titleMedium, color: colors.textPrimary }}>Sobre</Text>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Versão 1.0.0</Text>
            </View>
          </View>
        </View>
      </Card>

      <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <Button variant="destructive" size="lg" fullWidth onPress={handleLogout} testID="logout-button">
          Sair da conta
        </Button>
      </View>
    </ScrollView>
  );
}