# FinanceApp Mobile

Front-end mobile do FinanceApp construído com **React Native (Expo) + TypeScript**, consumindo a API Spring Boot.

## 🚀 Stack Principal

| Camada | Tecnologia |
|--------|------------|
| Framework | Expo SDK 51 + React Native 0.76 |
| Linguagem | TypeScript (strict) |
| Navegação | Expo Router (file-based) + React Navigation |
| Estado Global | Zustand + Immer |
| Server State | TanStack Query v5 |
| HTTP | Axios + interceptors (JWT, refresh, ProblemDetails) |
| Formulários | React Hook Form + Zod |
| UI | React Native Paper (Material 3) + Reanimated 3 |
| Ícones | Lucide React Native |
| Datas/Moeda | date-fns + Intl.NumberFormat (pt-BR) |
| Armazenamento Seguro | expo-secure-store |
| Testes | Vitest + React Native Testing Library + MSW |
| Lint/Format | Biome |
| CI/CD | GitHub Actions + EAS Build |

## 📁 Estrutura de Pastas

```
finance-app/
├── app/                    # Expo Router (rotas)
│   ├── (auth)/             # Login, Cadastro
│   ├── (app)/              # App autenticado (tabs + telas)
│   │   ├── index.tsx       # Home/Resumo
│   │   ├── accounts/       # Contas (lista, nova, detalhe)
│   │   ├── transactions/   # Transações (lista, nova)
│   │   ├── reminders/      # Lembretes (lista, novo)
│   │   ├── categories/     # Categorias
│   │   └── profile/        # Perfil
│   ├── _layout.tsx         # Root layout (providers)
│   └── +not-found.tsx
├── src/
│   ├── api/                # Camada de integração
│   │   ├── client.ts       # Axios + interceptors
│   │   ├── endpoints.ts    # URLs da API
│   │   ├── hooks/          # TanStack Query hooks
│   │   └── types/          # Tipos da API (OpenAPI)
│   ├── components/         # Design System
│   │   ├── ui/             # Primitivos (Button, Input, Card, etc.)
│   │   ├── forms/          # Compostos (MoneyInput, DatePicker, etc.)
│   │   └── layout/         # Layout (PageHeader)
│   ├── hooks/              # Hooks transversais
│   ├── store/              # Zustand stores (auth, ui, settings)
│   ├── utils/              # Funções puras (currency, date, validation, error)
│   ├── constants/          # Enums, config
│   ├── theme/              # Tokens + Paper theme
│   └── types/              # Tipos globais
├── assets/                 # Fontes, imagens
├── app.config.ts           # Expo config
├── eas.json                # EAS Build profiles
└── package.json
```

## 🛠️ Setup Inicial

```bash
# 1. Instalar dependências
cd J:\Projetos\finance-app
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da sua API (ex: http://10.0.2.2:8080)

# 3. Gerar tipos da API (backend deve estar rodando)
npm run generate:api

# 4. Iniciar desenvolvimento
npm start
```

## 📱 Executando

```bash
# Expo CLI
npm start          # Abre Metro bundler
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Navegador
```

## ✅ Qualidade de Código

```bash
npm run lint       # Biome check + fix
npm run typecheck  # TypeScript strict
npm run test       # Vitest (unit + integration)
npm run test:watch # Watch mode
```

## 🔐 Autenticação

- JWT armazenado no **expo-secure-store** (criptografado no device)
- Interceptor Axios injeta `Authorization: Bearer <token>`
- Refresh token automático em 401 (se API suportar)
- Logout limpa storage seguro

## 🎨 Design System (Tokens)

Definidos em `src/theme/tokens.ts`:
- Cores: fundo off-white `#F6F6F3`, primária verde `#16A34A`, semânticas (receita/despesa/lembretes)
- Tipografia: Nunito (system stack), números tabulares monospace
- Espaçamento: grid de 4px, raios 8/12/16/24/999
- Sombras: suaves (0 2 12px rgba(0,0,0,0.05))

## 📦 Build Produção (EAS)

```bash
# Preview (internal distribution)
eas build --platform all --profile preview

# Produção (stores)
eas build --platform all --profile production

# Submeter às lojas
eas submit --platform all --profile production
```

## 🔗 API Backend

Consome a API Spring Boot em `J:\Projetos\finance\demo`:
- Auth: `POST /api/auth/login`, `POST /api/users`
- Contas: `GET/POST /api/accounts`
- Transações: `GET/POST /api/transactions`, `GET /api/accounts/{id}/transactions`
- Categorias: `GET/POST /api/categories`
- Lembretes: `GET/POST /api/reminders`, `PATCH /api/reminders/{id}/pay`
- Perfil: `GET /api/users/me`

## 📝 Licença

Projeto privado - FinanceApp