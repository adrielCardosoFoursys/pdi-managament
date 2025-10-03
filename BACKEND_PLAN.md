# Planejamento de Backend - Plataforma PDI

## Visão Geral
Este documento detalha o planejamento completo para implementação do backend da Plataforma SaaS de Gestão de Projetos PDI da ANEEL.

## Stack Tecnológica Recomendada

### Core Backend
- **Supabase** como Backend-as-a-Service
  - PostgreSQL como banco de dados principal
  - Auth integrado com RLS (Row Level Security)
  - APIs automáticas (REST/GraphQL)
  - Real-time subscriptions
  - Storage para arquivos

### Arquitetura
```
Frontend (React) → Supabase → PostgreSQL
                ↓
            Edge Functions (Deno)
                ↓
        Integrações Externas
```

## 1. Configuração Inicial do Supabase

### 1.1 Criação do Projeto
```bash
# Instalar CLI do Supabase
npm install -g @supabase/cli

# Inicializar projeto local
supabase init plataforma-pdi
cd plataforma-pdi

# Fazer login e conectar com projeto remoto
supabase login
supabase link --project-ref <your-project-ref>
```

### 1.2 Configuração de Ambiente
```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 2. Schema do Banco de Dados

### 2.1 Estrutura Multi-tenant
```sql
-- Tabela de tenants (empresas)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'enterprise')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
```

### 2.2 Sistema de Usuários
```sql
-- Extensão da tabela de usuários do Supabase
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'executor' CHECK (role IN ('admin', 'gestor', 'consultor', 'executor', 'auditor')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: usuários só veem perfis do seu tenant
CREATE POLICY "Users can view profiles from their tenant" ON user_profiles
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));
```

### 2.3 Tabelas de Parametrização
```sql
-- Macro para criar tabelas de parametrização
CREATE OR REPLACE FUNCTION create_param_table(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE %I (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
      codigo VARCHAR(20) NOT NULL,
      descricao TEXT NOT NULL,
      status VARCHAR(20) DEFAULT ''ativo'' CHECK (status IN (''ativo'', ''inativo'')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(tenant_id, codigo)
    );
    
    ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY %I ON %I
      FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));
  ', table_name, table_name, table_name || '_policy', table_name);
END;
$$ LANGUAGE plpgsql;

-- Criar todas as tabelas de parametrização
SELECT create_param_table('fases_inovacao');
SELECT create_param_table('segmentos');
SELECT create_param_table('temas');
SELECT create_param_table('temas_estrategicos');
SELECT create_param_table('tipos_produto');
SELECT create_param_table('papeis_entidade');
SELECT create_param_table('titulacoes');
SELECT create_param_table('funcoes_equipe');

-- Subtemas (tem relacionamento com temas)
CREATE TABLE subtemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  tema_id UUID REFERENCES temas(id) ON DELETE CASCADE,
  codigo VARCHAR(20) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, codigo)
);

-- Rubricas financeiras (tem sigla)
CREATE TABLE rubricas_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  codigo VARCHAR(20) NOT NULL,
  sigla VARCHAR(10) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, codigo)
);
```

### 2.4 Tabelas Principais do Sistema
```sql
-- Projetos
CREATE TABLE projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  codigo_aneel VARCHAR(20) NOT NULL,
  fase_inovacao_id UUID REFERENCES fases_inovacao(id),
  segmento_id UUID REFERENCES segmentos(id),
  tema_id UUID REFERENCES temas(id),
  tipo_produto_id UUID REFERENCES tipos_produto(id),
  subtema_id UUID REFERENCES subtemas(id),
  tema_estrategico_id UUID REFERENCES temas_estrategicos(id),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  data_encerramento_real DATE,
  duracao INTEGER NOT NULL,
  prorrogacao INTEGER DEFAULT 0,
  escopo TEXT NOT NULL,
  produtos TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'execucao', 'encerrado', 'cancelado')),
  prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('alta', 'media', 'baixa')),
  percentual_evolucao DECIMAL(5,2) DEFAULT 0,
  custo_total_previsto DECIMAL(15,2) DEFAULT 0,
  custo_executado DECIMAL(15,2) DEFAULT 0,
  custo_previsto DECIMAL(15,2) DEFAULT 0,
  principal_responsavel VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, codigo_aneel)
);

-- Entidades do projeto
CREATE TABLE entidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  papel VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  sigla VARCHAR(20),
  cnpj VARCHAR(18) NOT NULL,
  municipio VARCHAR(100),
  estado VARCHAR(2),
  regiao VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membros da equipe
CREATE TABLE membros_equipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  ddd VARCHAR(3),
  telefone VARCHAR(20),
  email VARCHAR(255),
  tipo_documento VARCHAR(20) CHECK (tipo_documento IN ('cpf', 'passaporte')),
  documento VARCHAR(50),
  titulacao_id UUID REFERENCES titulacoes(id),
  funcao_id UUID REFERENCES funcoes_equipe(id),
  entidade_vinculada VARCHAR(255),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  curriculo_lattes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Etapas do projeto
CREATE TABLE etapas_projeto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  etapa VARCHAR(255) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  duracao_prevista INTEGER NOT NULL,
  duracao_realizada INTEGER,
  produtos_vinculados TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'planejada' CHECK (status IN ('planejada', 'em_andamento', 'concluida', 'atrasada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Produtos do projeto
CREATE TABLE produtos_projeto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  tipo VARCHAR(255),
  trl_inicial INTEGER CHECK (trl_inicial BETWEEN 1 AND 9),
  trl_final INTEGER CHECK (trl_final BETWEEN 1 AND 9),
  data_entrega DATE NOT NULL,
  anexo TEXT,
  status VARCHAR(20) DEFAULT 'planejado' CHECK (status IN ('planejado', 'em_desenvolvimento', 'concluido', 'atrasado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5 Tabelas Financeiras
```sql
-- Acompanhamento financeiro
CREATE TABLE acompanhamento_financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  financiadora VARCHAR(255),
  executora VARCHAR(255),
  rubrica_id UUID REFERENCES rubricas_financeiras(id),
  mes DATE NOT NULL,
  valor_previsto DECIMAL(15,2) DEFAULT 0,
  valor_realizado DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custos de RH
CREATE TABLE custos_rh (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  membro_equipe_id UUID REFERENCES membros_equipe(id) ON DELETE CASCADE,
  financiadora VARCHAR(255),
  executora VARCHAR(255),
  mes DATE NOT NULL,
  horas_previstas DECIMAL(8,2) DEFAULT 0,
  horas_realizadas DECIMAL(8,2) DEFAULT 0,
  custo_previsto DECIMAL(15,2) DEFAULT 0,
  custo_realizado DECIMAL(15,2) DEFAULT 0,
  custo_hora_previsto DECIMAL(10,2) DEFAULT 0,
  custo_hora_realizado DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detalhamento de despesas
CREATE TABLE detalhamento_despesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  data_despesa DATE NOT NULL,
  numero_nota_fiscal VARCHAR(50),
  etapa_projeto_id UUID REFERENCES etapas_projeto(id),
  tipo_comprovante VARCHAR(50),
  favorecido VARCHAR(255),
  rubrica_id UUID REFERENCES rubricas_financeiras(id),
  cnpj VARCHAR(18),
  descricao TEXT,
  justificativa TEXT,
  anexo TEXT,
  valor DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.6 Tabelas de KRs e Métricas
```sql
-- Métricas de KRs
CREATE TABLE metricas_kr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  kr INTEGER CHECK (kr BETWEEN 1 AND 20),
  peso DECIMAL(5,2) NOT NULL,
  meta DECIMAL(15,2) NOT NULL,
  valor_atual DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'fora_meta' CHECK (status IN ('dentro_meta', 'fora_meta')),
  unidade VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de gestão (diário de bordo)
CREATE TABLE historico_gestao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'info' CHECK (tipo IN ('info', 'alerta', 'erro', 'sucesso')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist de encerramento
CREATE TABLE checklist_encerramento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  obrigatorio BOOLEAN DEFAULT false,
  concluido BOOLEAN DEFAULT false,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  responsavel VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Row Level Security (RLS)

### 3.1 Políticas Globais
```sql
-- Função helper para obter tenant_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar RLS em todas as tabelas principais
DO $$
DECLARE
  table_name TEXT;
  table_names TEXT[] := ARRAY[
    'projetos', 'entidades', 'membros_equipe', 'etapas_projeto',
    'produtos_projeto', 'acompanhamento_financeiro', 'custos_rh',
    'detalhamento_despesas', 'metricas_kr', 'historico_gestao',
    'checklist_encerramento'
  ];
BEGIN
  FOREACH table_name IN ARRAY table_names
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    EXECUTE format('
      CREATE POLICY %I ON %I
        FOR ALL USING (tenant_id = get_user_tenant_id())
    ', table_name || '_tenant_policy', table_name);
  END LOOP;
END $$;
```

### 3.2 Políticas de Roles
```sql
-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas específicas por role (exemplo para projetos)
CREATE POLICY "Admins can do anything on projetos" ON projetos
  FOR ALL USING (has_role('admin'));

CREATE POLICY "Gestores can manage projetos" ON projetos
  FOR ALL USING (has_role('gestor') OR has_role('admin'));

CREATE POLICY "Others can only read projetos" ON projetos
  FOR SELECT USING (tenant_id = get_user_tenant_id());
```

## 4. Edge Functions (Serverless)

### 4.1 Estrutura de Edge Functions
```typescript
// supabase/functions/calculate-ampere/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { projeto_id } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Lógica para calcular AMPERE
    const { data: krs } = await supabase
      .from('metricas_kr')
      .select('*')
      .eq('projeto_id', projeto_id)
    
    const ampere = calculateAmpere(krs)
    
    return new Response(
      JSON.stringify({ ampere }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})

function calculateAmpere(krs: any[]): number {
  // Implementar lógica de cálculo do AMPERE
  return krs.reduce((acc, kr) => acc + (kr.peso * kr.valor_atual), 0)
}
```

### 4.2 Outras Edge Functions Necessárias
```typescript
// supabase/functions/generate-refp/index.ts - Gerar REFP
// supabase/functions/validate-aneel-code/index.ts - Validar código ANEEL
// supabase/functions/import-excel/index.ts - Importar dados via Excel
// supabase/functions/send-notifications/index.ts - Enviar notificações
// supabase/functions/backup-project/index.ts - Backup de projetos
```

## 5. APIs e Integrações

### 5.1 Cliente Supabase no Frontend
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Tipos gerados automaticamente
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']
```

### 5.2 Hooks Personalizados
```typescript
// src/hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (project: Omit<Tables<'projetos'>, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projetos')
        .insert(project)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}
```

## 6. Autenticação e Autorização

### 6.1 Configuração de Auth
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configurar listener de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          // Buscar perfil do usuário
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setProfile(data)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    profile,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

## 7. Storage e Upload de Arquivos

### 7.1 Configuração de Buckets
```sql
-- Criar bucket para anexos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-attachments',
  'project-attachments',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- RLS para storage
CREATE POLICY "Users can upload attachments for their tenant projects" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-attachments' AND
    auth.uid() IN (
      SELECT up.id FROM user_profiles up
      WHERE up.tenant_id = (
        SELECT p.tenant_id FROM projetos p
        WHERE p.id::text = (storage.foldername(name))[1]
      )
    )
  );
```

### 7.2 Hook de Upload
```typescript
// src/hooks/useFileUpload.ts
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)

  const uploadFile = async (file: File, projectId: string, folder: string = 'attachments') => {
    setUploading(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${projectId}/${folder}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('project-attachments')
        .upload(fileName, file)
      
      if (error) throw error
      
      return data.path
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading }
}
```

## 8. Real-time e Notificações

### 8.1 Configuração de Real-time
```typescript
// src/hooks/useRealtimeProjects.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'

export function useRealtimeProjects() {
  const [projects, setProjects] = useState<Tables<'projetos'>[]>([])

  useEffect(() => {
    // Configurar subscription para mudanças em projetos
    const subscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projetos'
        },
        (payload) => {
          console.log('Project changed:', payload)
          // Atualizar estado local
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { projects }
}
```

## 9. Testes

### 9.1 Testes de Integração
```typescript
// tests/integration/projects.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

describe('Projects API', () => {
  let supabase: any
  let testUser: any

  beforeAll(async () => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Criar usuário de teste
    const { data } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true
    })
    testUser = data.user
  })

  it('should create a project', async () => {
    const { data, error } = await supabase
      .from('projetos')
      .insert({
        titulo: 'Projeto Teste',
        codigo_aneel: 'TEST-001',
        // ... outros campos
      })
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data.titulo).toBe('Projeto Teste')
  })

  afterAll(async () => {
    // Limpar dados de teste
    if (testUser) {
      await supabase.auth.admin.deleteUser(testUser.id)
    }
  })
})
```

## 10. Deploy e DevOps

### 10.1 Scripts de Deploy
```json
// package.json
{
  "scripts": {
    "db:reset": "supabase db reset",
    "db:migrate": "supabase db push",
    "db:seed": "supabase seed run",
    "functions:deploy": "supabase functions deploy",
    "deploy:staging": "supabase link --project-ref staging && npm run db:migrate && npm run functions:deploy",
    "deploy:production": "supabase link --project-ref production && npm run db:migrate && npm run functions:deploy"
  }
}
```

### 10.2 Migrations
```sql
-- supabase/migrations/20241001000001_initial_schema.sql
-- Todas as tabelas e configurações iniciais

-- supabase/migrations/20241001000002_seed_data.sql
-- Dados iniciais (parâmetros padrão)

-- supabase/migrations/20241001000003_rls_policies.sql
-- Políticas de segurança
```

## 11. Monitoramento e Analytics

### 11.1 Configuração de Logs
```typescript
// src/lib/logger.ts
import { supabase } from './supabase'

export async function logEvent(
  event: string,
  data: any,
  level: 'info' | 'warning' | 'error' = 'info'
) {
  await supabase
    .from('system_logs')
    .insert({
      event,
      data,
      level,
      timestamp: new Date().toISOString()
    })
}
```

## 12. Backup e Disaster Recovery

### 12.1 Estratégia de Backup
```bash
# Script de backup automático
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/plataforma-pdi"

# Backup do banco de dados
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup dos arquivos do storage
aws s3 sync s3://supabase-storage-bucket "$BACKUP_DIR/storage_$DATE"

# Manter apenas os últimos 30 backups
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "storage_*" -mtime +30 -exec rm -rf {} \;
```

## 13. Cronograma de Implementação

### Fase 1 (2 semanas)
- [ ] Configurar projeto Supabase
- [ ] Implementar schema básico
- [ ] Configurar autenticação
- [ ] Implementar RLS

### Fase 2 (3 semanas)
- [ ] APIs de parametrização
- [ ] CRUD de projetos
- [ ] Sistema de upload
- [ ] Edge functions básicas

### Fase 3 (3 semanas)
- [ ] Módulos financeiros
- [ ] Sistema de KRs
- [ ] Real-time updates
- [ ] Relatórios

### Fase 4 (2 semanas)
- [ ] Testes de integração
- [ ] Deploy em staging
- [ ] Otimizações de performance
- [ ] Deploy em produção

## 14. Estimativa de Custos (Supabase)

### Plano Pro ($25/mês por projeto)
- 8GB de banco de dados
- 100GB de storage
- 2M de edge function invocations
- Adequado para até 500 projetos simultâneos

### Plano Team ($599/mês por organização)
- 32GB de banco de dados
- 250GB de storage
- 10M de edge function invocations
- Adequado para múltiplas empresas

## Conclusão

Este planejamento fornece uma base sólida para implementar o backend da Plataforma PDI usando Supabase. A arquitetura proposta é:

- **Escalável**: Multi-tenant com RLS
- **Segura**: Autenticação robusta e políticas de acesso
- **Flexível**: Edge functions para lógicas customizadas
- **Confiável**: Backup automático e disaster recovery
- **Observável**: Logs e monitoramento integrados

O próximo passo seria começar pela Fase 1, configurando o projeto Supabase e implementando o schema básico.
