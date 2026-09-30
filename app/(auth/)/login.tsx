import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { loginSchema, type LoginInput } from '@/utils/validation';
import { useLogin } from '@/api/hooks/useAuth';
import { colors, spacing, typography } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const emailField = useController({ control, name: 'email', rules: { required: 'E-mail é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' } } });
  const passwordField = useController({ control, name: 'password', rules: { required: 'Senha é obrigatória' } });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await login(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao fazer login');
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
      keyboardVerticalOffset={0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
        <Card style={{ marginBottom: spacing.lg }} padding="lg">
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textOnPrimary }}>📊</Text>
            </View>
            <Text style={{ ...typography.headline, color: colors.textPrimary, marginTop: spacing.md }}>FinanceApp</Text>
            <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, marginTop: spacing.xs }}>Gerencie suas finanças com simplicidade</Text>
          </View>

          <View style={{ gap: spacing.md }}>
            <Input
              value={emailField.field.value}
              onChangeText={emailField.field.onChange}
              onBlur={emailField.field.onBlur}
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email?.message}
              testID="login-email"
            />
            <Input
              value={passwordField.field.value}
              onChangeText={passwordField.field.onChange}
              onBlur={passwordField.field.onBlur}
              label="Senha"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              showPasswordToggle
              error={errors.password?.message}
              testID="login-password"
            />

            {error && (
              <View style={{ backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: 12 }}>
                <Text style={{ color: colors.expense, ...typography.bodyMedium }}>{error}</Text>
              </View>
            )}

            <Button variant="primary" size="lg" fullWidth loading={isPending} onPress={onSubmit} testID="login-submit">
              Entrar
            </Button>
          </View>
        </Card>

        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ ...typography.bodyMedium, color: colors.textSecondary }}>
            Não tem conta?{' '}
            <Text
              onPress={() => router.push('/register')}
              style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
            >
              Criar conta
            </Text>
          </Text>
          <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}