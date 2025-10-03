# Troubleshooting - Plataforma PDI

## Problema com Dependências do Radix UI

### Problema
Erro: `Failed to resolve import "@radix-ui/react-label" from "src/components/ui/label.tsx"`

### Causa
As dependências do Radix UI não foram instaladas corretamente devido a problemas com o npm.

### Solução

#### Opção 1: Reinstalar dependências (Recomendado)
```bash
# Parar o servidor de desenvolvimento (Ctrl+C)

# Limpar cache do npm
npm cache clean --force

# Remover node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar dependências
npm install

# Iniciar servidor
npm run dev
```

#### Opção 2: Usar yarn (Alternativa)
```bash
# Instalar yarn se não tiver
npm install -g yarn

# Remover node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Instalar com yarn
yarn install

# Iniciar servidor
yarn dev
```

#### Opção 3: Instalação manual das dependências específicas
```bash
npm install @radix-ui/react-label@^2.1.0
npm install @radix-ui/react-dialog@^1.1.3
npm install @radix-ui/react-select@^2.1.4
npm install @radix-ui/react-tabs@^1.1.1
npm install @radix-ui/react-slot@^1.2.3
```

### Verificação
Após resolver o problema de dependências, execute:
```bash
npm run dev
```

O servidor deve iniciar sem erros e você pode acessar:
- http://localhost:5173

## Funcionalidades Disponíveis

Após resolver o problema, você terá acesso a todas as funcionalidades implementadas:

### ✅ Páginas Funcionais
- **Dashboard** - Visão geral com métricas e gráficos
- **Portfólio** - Lista de projetos com filtros
- **Projetos** - CRUD completo de projetos
- **Entidades & Equipe** - Gestão de participantes
- **Financeiro** - Acompanhamento e despesas
- **Relatórios** - Gráficos e geração de REFP
- **Administração** - Gestão de parâmetros

### 🎯 Recursos Implementados
- Formulários com validação completa
- Gráficos interativos com Recharts
- Sistema de filtros e busca
- Modais para formulários complexos
- Estados de loading e feedback
- Dados mock realistas
- Interface responsiva

## Próximos Passos

1. **Resolver dependências** usando uma das opções acima
2. **Testar todas as funcionalidades** navegando pelas páginas
3. **Implementar backend** seguindo o `BACKEND_PLAN.md`
4. **Conectar frontend com APIs** reais do Supabase

## Suporte

Se o problema persistir:
1. Verifique se tem Node.js 18+ instalado
2. Tente usar npm version 9+ ou yarn
3. Verifique se não há processos npm em execução
4. Em último caso, use uma nova instalação do Node.js
