// Tipos principais da plataforma PDI

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'gestor' | 'consultor' | 'executor' | 'auditor';
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
}

// Parâmetros configuráveis
export interface FaseInovacao {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
  createdAt: Date;
  updatedAt: Date;
}

export interface Segmento {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface Tema {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface Subtema {
  id: string;
  codigo: string;
  descricao: string;
  temaId: string;
  status: 'ativo' | 'inativo';
}

export interface TemaEstrategico {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface TipoProduto {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface PapelEntidade {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface Titulacao {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface FuncaoEquipe {
  id: string;
  codigo: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface RubricaFinanceira {
  id: string;
  codigo: string;
  descricao: string;
  sigla: string;
  status: 'ativo' | 'inativo';
}

// Projeto e suas entidades relacionadas
export interface Projeto {
  id: string;
  titulo: string;
  codigoANEEL: string;
  faseInovacaoId: string;
  segmentoId: string;
  temaId: string;
  tipoProdutoId: string;
  subtemaId: string;
  temaEstrategicoId: string;
  dataInicio: Date;
  dataFim: Date;
  dataEncerramentoReal?: Date;
  duracao: number;
  prorrogacao?: number;
  escopo: string;
  produtos: string[];
  status: 'planejamento' | 'execucao' | 'encerrado' | 'cancelado';
  prioridade: 'alta' | 'media' | 'baixa';
  percentualEvolucao: number;
  custoTotalPrevisto: number;
  custoExecutado: number;
  custoPrevisto: number;
  principalResponsavel: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entidade {
  id: string;
  projetoId: string;
  papel: string;
  nome: string;
  sigla: string;
  cnpj: string;
  municipio: string;
  estado: string;
  regiao: string;
}

export interface MembroEquipe {
  id: string;
  projetoId: string;
  nome: string;
  ddd: string;
  telefone: string;
  email: string;
  tipoDocumento: 'cpf' | 'passaporte';
  documento: string;
  titulacaoId: string;
  funcaoId: string;
  entidadeVinculada: string;
  dataInicio: Date;
  dataFim?: Date;
  curriculoLattes?: string;
}

export interface EtapaProjeto {
  id: string;
  projetoId: string;
  etapa: string;
  dataInicio: Date;
  dataFim: Date;
  duracaoPrevista: number;
  duracaoRealizada?: number;
  produtosVinculados: string[];
  status: 'planejada' | 'em_andamento' | 'concluida' | 'atrasada';
}

export interface ProdutoProjeto {
  id: string;
  projetoId: string;
  descricao: string;
  tipo: string;
  trlInicial: number;
  trlFinal: number;
  dataEntrega: Date;
  anexo?: string;
  status: 'planejado' | 'em_desenvolvimento' | 'concluido' | 'atrasado';
}

// Financeiro
export interface AcompanhamentoFinanceiro {
  id: string;
  projetoId: string;
  financiadora: string;
  executora: string;
  rubrica: string;
  mes: string;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface CustoRH {
  id: string;
  projetoId: string;
  membroEquipeId: string;
  financiadora: string;
  executora: string;
  mes: string;
  horasPrevistas: number;
  horasRealizadas: number;
  custoPrevisto: number;
  custoRealizado: number;
  custoHoraPrevisto: number;
  custoHoraRealizado: number;
}

export interface DetalhamentoDespesa {
  id: string;
  projetoId: string;
  dataDespesa: Date;
  numeroNotaFiscal: string;
  etapaProjetoId: string;
  tipoComprovante: string;
  favorecido: string;
  rubrica: string;
  cnpj: string;
  descricao: string;
  justificativa: string;
  anexo?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  valor: number;
}

// KRs e Métricas
export interface MetricaKR {
  id: string;
  projetoId: string;
  kr: number; // 1 a 20
  peso: number;
  meta: number;
  valorAtual: number;
  status: 'dentro_meta' | 'fora_meta';
  unidade: string;
}

// Histórico e Auditoria
export interface HistoricoGestao {
  id: string;
  projetoId: string;
  data: Date;
  usuario: string;
  descricao: string;
  tipo: 'info' | 'alerta' | 'erro' | 'sucesso';
}

export interface ChecklistEncerramento {
  id: string;
  projetoId: string;
  item: string;
  obrigatorio: boolean;
  concluido: boolean;
  dataConlusao?: Date;
  responsavel?: string;
  observacoes?: string;
}

// Tipos para formulários
export type ProjetoFormData = Omit<Projeto, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>;
export type EntidadeFormData = Omit<Entidade, 'id' | 'projetoId'>;
export type MembroEquipeFormData = Omit<MembroEquipe, 'id' | 'projetoId'>;
