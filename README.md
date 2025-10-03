# Plataforma SaaS para Gestão de Projetos PDI (ANEEL)

Uma solução completa para gestão de portfólios de Projetos de Desenvolvimento da Infraestrutura (PDI) em conformidade com a regulamentação da ANEEL.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Recharts** para gráficos e visualizações
- **React Hook Form** + **Zod** para formulários
- **Lucide React** para ícones

### Backend (Planejado)
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** com Row Level Security (RLS)
- **Edge Functions** (Deno) para lógicas customizadas
- **Real-time subscriptions** para atualizações em tempo real

## 📋 Funcionalidades Implementadas

### ✅ Onda 0 - MVP Completo
- [x] **Dashboard** com visão geral dos projetos
- [x] **Portfólio de Projetos** com visualização em cards e lista
- [x] **Administração de Parâmetros** (CRUDs centralizados)
- [x] **Sistema de Layout** responsivo com sidebar e header
- [x] **Dados Mock** para desenvolvimento
- [x] **Componentes UI** base com shadcn/ui

### ✅ Onda 1 - Funcionalidades Avançadas
- [x] **Cadastro e Gestão Completa de Projetos** com formulários validados
- [x] **Gestão de Entidades e Equipe** com CRUDs completos
- [x] **Acompanhamento Financeiro** com controle de despesas
- [x] **Relatórios e Cronogramas** com gráficos interativos
- [x] **Sistema de Status e Aprovações** para despesas
- [x] **Geração Automática de REFP** (Relatório de Execução Financeira)

### 🔄 Próximas Implementações
- [ ] Sistema de KRs e cálculo do AMPERE
- [ ] Checklist de encerramento de projetos
- [ ] Sistema de notificações e alertas
- [ ] Integração com backend (Supabase)
- [ ] Autenticação e controle de acesso por roles

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── layout/          # Header, Sidebar, Layout
│   ├── forms/           # Formulários específicos (futuro)
│   ├── tables/          # Componentes de tabela (futuro)
│   └── charts/          # Componentes de gráficos (futuro)
├── pages/               # Páginas da aplicação
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Portfolio.tsx    # Portfólio de projetos
│   ├── Projetos.tsx     # Gestão completa de projetos
│   ├── EntidadesEquipe.tsx # Gestão de entidades e equipe
│   ├── Financeiro.tsx   # Acompanhamento financeiro
│   ├── Relatorios.tsx   # Relatórios e cronogramas
│   └── Administracao.tsx # Administração de parâmetros
├── data/                # Dados mock
├── types/               # Definições TypeScript
├── lib/                 # Utilitários
└── hooks/               # Custom hooks (futuro)
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>
cd plataforma-gestao-pdi

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### Build para Produção
```bash
# Gerar build
npm run build

# Preview do build
npm run preview
```

## 📊 Funcionalidades Principais

### Dashboard
- Visão geral com métricas principais
- Gráficos de distribuição por status
- Evolução dos projetos (físico vs financeiro)
- Lista de projetos ativos

### Portfólio
- Visualização em cards ou lista
- Filtros e busca
- Estatísticas resumidas
- Status em tempo real

### Gestão de Projetos
- Formulário completo de cadastro com validação
- Edição e exclusão de projetos
- Filtros por status e busca textual
- Visualização detalhada de projetos
- Cálculo automático de duração

### Entidades & Equipe
- Cadastro de entidades participantes
- Gestão completa da equipe do projeto
- Controle de titulações e funções
- Vinculação com projetos
- Informações de contato e Currículo Lattes

### Acompanhamento Financeiro
- Controle de acompanhamento por rubrica
- Gestão detalhada de despesas
- Sistema de aprovação/rejeição
- Cálculos de desvio e execução
- Resumos financeiros por projeto

### Relatórios & Cronogramas
- Cronograma físico vs financeiro
- Gráficos de distribuição de orçamento
- Evolução mensal dos projetos
- Dashboard consolidado
- Geração automática de REFP
- Export para Excel/CSV

### Administração
- Gestão centralizada de parâmetros
- CRUDs para todas as listas de referência
- Controle de status (ativo/inativo)
- Histórico de alterações

## 🗂️ Parâmetros Configuráveis

O sistema permite configurar os seguintes parâmetros via interface:

- **Fases de Inovação**: Pesquisa Aplicada, Desenvolvimento Experimental, etc.
- **Segmentos**: Geração, Transmissão, Distribuição
- **Temas e Subtemas**: Conforme classificação ANEEL
- **Temas Estratégicos PEQuI**: TE1 a TE7
- **Tipos de Produto**: Componentes, Sistemas, Software, etc.
- **Papéis de Entidade**: Proponente, Executora, Cooperada, etc.
- **Titulações e Funções**: Para gestão de equipe
- **Rubricas Financeiras**: AC, CM, MC, MP, etc.

## 📈 Roadmap

### Próximas Ondas
1. **Onda 1**: Gestão completa de projetos e equipes
2. **Onda 2**: Sistema financeiro avançado e KRs
3. **Onda 3**: Relatórios automáticos e integrações

### Integrações Planejadas
- **ERP**: Integração via API REST
- **MS Project**: Importação/exportação XML
- **Power BI**: Conector para dashboards
- **PINSE**: Envio automático para ANEEL

## 🔒 Segurança e Compliance

### Implementado
- Interface segura com validação client-side
- Estrutura preparada para multi-tenancy
- Componentes com controle de acesso por role

### Planejado (Backend)
- **LGPD**: Criptografia, RBAC, logs de auditoria
- **ISO 27001**: MFA, backups, disaster recovery
- **Multi-tenant**: Isolamento completo por empresa
- **Row Level Security**: Políticas de acesso no banco

## 📝 Planejamento do Backend

Um planejamento detalhado para implementação do backend está disponível em [`BACKEND_PLAN.md`](./BACKEND_PLAN.md), incluindo:

- Schema completo do banco de dados
- Configuração de autenticação e autorização
- Row Level Security (RLS) policies
- Edge Functions para lógicas customizadas
- Sistema de upload e storage
- Real-time subscriptions
- Estratégias de backup e disaster recovery
- Cronograma de implementação

## 🎯 Personas Atendidas

- **Gestor de PDI**: Visão de portfólio, simulações, alertas
- **Consultor de PDI**: Cadastro técnico, rastreabilidade
- **Executor**: Interface simplificada para atualizações
- **Auditor**: Dados auditáveis, histórico imutável

## 📊 Métricas de Sucesso

- **Adoção**: 3 grandes distribuidoras em 12 meses
- **Eficiência**: 80% menos tempo em relatórios
- **Compliance**: 100% dos projetos com checklist completo
- **Substituição**: 90% dos dados direto na plataforma

## 🤝 Contribuição

Este é um projeto em desenvolvimento. Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença proprietária. Todos os direitos reservados.