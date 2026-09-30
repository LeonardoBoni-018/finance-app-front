import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { registerSchema, type RegisterInput } from '@/utils/validation';
import { useRegister } from '@/api/hooks/useAuth';
import { colors, spacing, typography } from '@/theme/tokens';

export default function RegisterScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const nameField = useController({ control, name: 'name', rules: { required: 'Nome é obrigatório', minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' } } });
  const emailField = useController({ control, name: 'email', rules: { required: 'E-mail é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' } } });
  const passwordField = useController({ control, name: 'password', rules: { required: 'Senha é obrigatória', minLength: { value: 8, message: 'Senha deve ter pelo menos 8 caracteres' } } });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await register(data);
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar conta');
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
            <Text style={{ ...typography.headline, color: colors.textPrimary, marginTop: spacing.md }}>Criar conta</Text>
            <Text style={{ ...typography.bodyMedium, color: colors.textSecondary, marginTop: spacing.xs }}>Comece a organizar suas finanças hoje</Text>
          </View>

          <View style={{ gap: spacing.md }}>
            <Input
              value={nameField.field.value}
              onChangeText={nameField.field.onChange}
              onBlur={nameField.field.onBlur}
              label="Nome completo"
              placeholder="João da Silva"
              autoCapitalize="words"
              autoComplete="name"
              error={errors.name?.message}
              testID="register-name"
            />
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
              testID="register-email"
            />
            <Input
              value={passwordField.field.value}
              onChangeText={passwordField.field.onChange}
              onBlur={passwordField.field.onBlur}
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              secureTextEntry
              autoComplete="new-password"
              showPasswordToggle
              error={errors.password?.message}
              helperText="Mínimo 8 caracteres"
              testID="register-password"
            />

            {error && (
              <View style={{ backgroundColor: colors.expenseContainer, padding: spacing.md, borderRadius: 12 }}>
                <Text style={{ color: colors.expense, ...typography.bodyMedium }}>{error}</Text>
              </View>
            )}

            <Button variant="primary" size="lg" fullWidth loading={isPending} onPress={handleSubmit(async (data) => {
              setError(null);
              try {
                await register(data);
                router.replace('/');
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Erro ao criar conta');
              }
            })} testID="register-submit">
              Criar conta
            </Button>
          </View>
        </Card>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <Text style={{ ...typography.bodyMedium, color: colors.textSecondary }}>
            Já tem conta?{' '}
            <Text
              onPress={() => router.push('/login')}
              style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
            >
              Entrar
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}