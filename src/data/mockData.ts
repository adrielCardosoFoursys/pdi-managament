// Dados mock para desenvolvimento do frontend

import { 
  FaseInovacao, 
  Segmento, 
  Tema, 
  Subtema, 
  TemaEstrategico, 
  TipoProduto,
  PapelEntidade,
  Titulacao,
  FuncaoEquipe,
  RubricaFinanceira,
  Projeto,
  Entidade,
  MembroEquipe
} from '@/types';

// Fases de Inovação
export const fasesInovacao: FaseInovacao[] = [
  { id: '1', codigo: 'PA', descricao: 'Pesquisa Aplicada', status: 'ativo', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', codigo: 'DE', descricao: 'Desenvolvimento Experimental', status: 'ativo', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', codigo: 'CS', descricao: 'Cabeça de Série', status: 'ativo', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', codigo: 'LP', descricao: 'Lote Pioneiro', status: 'ativo', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', codigo: 'IM', descricao: 'Inserção de Mercado', status: 'ativo', createdAt: new Date(), updatedAt: new Date() },
];

// Segmentos
export const segmentos: Segmento[] = [
  { id: '1', codigo: 'GER', descricao: 'Geração', status: 'ativo' },
  { id: '2', codigo: 'TRA', descricao: 'Transmissão', status: 'ativo' },
  { id: '3', codigo: 'DIS', descricao: 'Distribuição', status: 'ativo' },
];

// Temas
export const temas: Tema[] = [
  { id: '1', codigo: 'EE', descricao: 'Eficiência Energética', status: 'ativo' },
  { id: '2', codigo: 'MA', descricao: 'Meio Ambiente', status: 'ativo' },
  { id: '3', codigo: 'OP', descricao: 'Operações', status: 'ativo' },
];

// Subtemas (alguns exemplos)
export const subtemas: Subtema[] = [
  { id: '1', codigo: 'FA01', descricao: 'Alternativas energéticas sustentáveis de atendimento a pequenos sistemas isolados', temaId: '2', status: 'ativo' },
  { id: '2', codigo: 'FA02', descricao: 'Geração de energia a partir de resíduos sólidos urbanos', temaId: '2', status: 'ativo' },
  { id: '3', codigo: 'EE01', descricao: 'Novas tecnologias para melhoria da eficiência energética', temaId: '1', status: 'ativo' },
  { id: '4', codigo: 'EE02', descricao: 'Gerenciamento de carga pelo lado da demanda', temaId: '1', status: 'ativo' },
  { id: '5', codigo: 'OP01', descricao: 'Ferramentas de apoio à operação de sistemas elétricos de potência em tempo real', temaId: '3', status: 'ativo' },
];

// Temas Estratégicos PEQuI
export const temasEstrategicos: TemaEstrategico[] = [
  { id: '1', codigo: 'TE1', descricao: 'Modernização e Modicidade Tarifária', status: 'ativo' },
  { id: '2', codigo: 'TE2', descricao: 'Eletrificação da Economia e Eficiência Energética', status: 'ativo' },
  { id: '3', codigo: 'TE3', descricao: 'Digitalização, Padrões, Interoperabilidade e Cibersegurança', status: 'ativo' },
  { id: '4', codigo: 'TE4', descricao: 'Novas Tecnologias de Suporte - Inteligência Artificial, Realidade Virtual e Aumentada e Blockchain', status: 'ativo' },
  { id: '5', codigo: 'TE5', descricao: 'Eletricidade de Baixo Carbono', status: 'ativo' },
  { id: '6', codigo: 'TE6', descricao: 'Armazenamento de Energia', status: 'ativo' },
  { id: '7', codigo: 'TE7', descricao: 'Hidrogênio', status: 'ativo' },
];

// Tipos de Produto
export const tiposProduto: TipoProduto[] = [
  { id: '1', codigo: 'CD', descricao: 'Componente ou Dispositivo', status: 'ativo' },
  { id: '2', codigo: 'CO', descricao: 'Conceito', status: 'ativo' },
  { id: '3', codigo: 'MA', descricao: 'Máquina', status: 'ativo' },
  { id: '4', codigo: 'MT', descricao: 'Material', status: 'ativo' },
  { id: '5', codigo: 'SI', descricao: 'Sistema', status: 'ativo' },
  { id: '6', codigo: 'SW', descricao: 'Software', status: 'ativo' },
];

// Papéis de Entidade
export const papeisEntidade: PapelEntidade[] = [
  { id: '1', codigo: 'PROP', descricao: 'Proponente', status: 'ativo' },
  { id: '2', codigo: 'EXEC', descricao: 'Executora', status: 'ativo' },
  { id: '3', codigo: 'COOP', descricao: 'Cooperada', status: 'ativo' },
  { id: '4', codigo: 'INTE', descricao: 'Interveniente', status: 'ativo' },
];

// Titulações
export const titulacoes: Titulacao[] = [
  { id: '1', codigo: 'DR', descricao: 'Doutor', status: 'ativo' },
  { id: '2', codigo: 'ESP', descricao: 'Especialista', status: 'ativo' },
  { id: '3', codigo: 'MSC', descricao: 'Mestre', status: 'ativo' },
  { id: '4', codigo: 'PDR', descricao: 'Pós-doutor', status: 'ativo' },
  { id: '5', codigo: 'SUP', descricao: 'Superior', status: 'ativo' },
  { id: '6', codigo: 'SUP_JR', descricao: 'Superior Jr.', status: 'ativo' },
  { id: '7', codigo: 'TEC', descricao: 'Técnico', status: 'ativo' },
];

// Funções na Equipe
export const funcoesEquipe: FuncaoEquipe[] = [
  { id: '1', codigo: 'AUX', descricao: 'Auxiliar Técnico', status: 'ativo' },
  { id: '2', codigo: 'COORD', descricao: 'Coordenador', status: 'ativo' },
  { id: '3', codigo: 'DOUT', descricao: 'Doutorando', status: 'ativo' },
  { id: '4', codigo: 'GER', descricao: 'Gerente', status: 'ativo' },
  { id: '5', codigo: 'GRAD', descricao: 'Graduando', status: 'ativo' },
  { id: '6', codigo: 'MEST', descricao: 'Mestrando', status: 'ativo' },
  { id: '7', codigo: 'PESQ', descricao: 'Pesquisador', status: 'ativo' },
  { id: '8', codigo: 'PESQ_VIS', descricao: 'Pesquisador-visitante', status: 'ativo' },
  { id: '9', codigo: 'POS_DOUT', descricao: 'Pós-doutorando', status: 'ativo' },
  { id: '10', codigo: 'PROF', descricao: 'Professor', status: 'ativo' },
];

// Rubricas Financeiras
export const rubricasFinanceiras: RubricaFinanceira[] = [
  { id: '1', codigo: 'AC', descricao: 'Aquisição de Componentes', sigla: 'AC', status: 'ativo' },
  { id: '2', codigo: 'CM', descricao: 'Consultoria e Serviços de Manutenção', sigla: 'CM', status: 'ativo' },
  { id: '3', codigo: 'MC', descricao: 'Materiais de Consumo', sigla: 'MC', status: 'ativo' },
  { id: '4', codigo: 'MP', descricao: 'Mão de Obra Própria', sigla: 'MP', status: 'ativo' },
  { id: '5', codigo: 'OU', descricao: 'Outros', sigla: 'OU', status: 'ativo' },
  { id: '6', codigo: 'RH', descricao: 'Recursos Humanos', sigla: 'RH', status: 'ativo' },
  { id: '7', codigo: 'ST', descricao: 'Serviços de Terceiros', sigla: 'ST', status: 'ativo' },
  { id: '8', codigo: 'SU', descricao: 'Serviços de Utilidade Pública', sigla: 'SU', status: 'ativo' },
  { id: '9', codigo: 'VD', descricao: 'Viagens e Deslocamentos', sigla: 'VD', status: 'ativo' },
];

// Estados brasileiros
export const estados = [
  { sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
  { sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
  { sigla: 'AP', nome: 'Amapá', regiao: 'Norte' },
  { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
  { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
  { sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
  { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  { sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
  { sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
  { sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
  { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
  { sigla: 'PA', nome: 'Pará', regiao: 'Norte' },
  { sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
  { sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
  { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
  { sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
  { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
  { sigla: 'RO', nome: 'Rondônia', regiao: 'Norte' },
  { sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
  { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
  { sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
  { sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
  { sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
];

// Projetos mock
export const projetos: Projeto[] = [
  {
    id: '1',
    titulo: 'Sistema de Monitoramento Inteligente de Redes de Distribuição',
    codigoANEEL: '2024-0001/0001',
    faseInovacaoId: '2',
    segmentoId: '3',
    temaId: '3',
    tipoProdutoId: '5',
    subtemaId: '5',
    temaEstrategicoId: '3',
    dataInicio: new Date('2024-01-15'),
    dataFim: new Date('2026-01-15'),
    duracao: 24,
    escopo: 'Desenvolvimento de sistema inteligente para monitoramento em tempo real de redes de distribuição de energia elétrica, utilizando IoT e IA para predição de falhas.',
    produtos: ['Sistema de Software', 'Relatório Técnico', 'Artigo Científico'],
    status: 'execucao',
    prioridade: 'alta',
    percentualEvolucao: 35,
    custoTotalPrevisto: 2500000,
    custoExecutado: 875000,
    custoPrevisto: 1200000,
    principalResponsavel: 'Dr. João Silva',
    tenantId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: '2',
    titulo: 'Desenvolvimento de Materiais Supercondutores para Transmissão',
    codigoANEEL: '2024-0002/0001',
    faseInovacaoId: '1',
    segmentoId: '2',
    temaId: '1',
    tipoProdutoId: '4',
    subtemaId: '1',
    temaEstrategicoId: '1',
    dataInicio: new Date('2024-03-01'),
    dataFim: new Date('2027-03-01'),
    duracao: 36,
    escopo: 'Pesquisa e desenvolvimento de novos materiais supercondutores de alta temperatura para aplicação em linhas de transmissão de energia elétrica.',
    produtos: ['Material Supercondutor', 'Patente', 'Relatório Final'],
    status: 'execucao',
    prioridade: 'alta',
    percentualEvolucao: 15,
    custoTotalPrevisto: 4200000,
    custoExecutado: 630000,
    custoPrevisto: 1050000,
    principalResponsavel: 'Dra. Maria Santos',
    tenantId: '1',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: '3',
    titulo: 'Otimização de Sistemas de Armazenamento de Energia',
    codigoANEEL: '2024-0003/0001',
    faseInovacaoId: '3',
    segmentoId: '1',
    temaId: '1',
    tipoProdutoId: '5',
    subtemaId: '3',
    temaEstrategicoId: '6',
    dataInicio: new Date('2024-06-01'),
    dataFim: new Date('2025-12-01'),
    duracao: 18,
    escopo: 'Desenvolvimento de algoritmos de otimização para sistemas de armazenamento de energia em plantas de geração renovável.',
    produtos: ['Software de Otimização', 'Protótipo', 'Metodologia'],
    status: 'execucao',
    prioridade: 'media',
    percentualEvolucao: 25,
    custoTotalPrevisto: 1800000,
    custoExecutado: 450000,
    custoPrevisto: 720000,
    principalResponsavel: 'Dr. Carlos Oliveira',
    tenantId: '1',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-10-01'),
  }
];

// Entidades mock
export const entidades: Entidade[] = [
  {
    id: '1',
    projetoId: '1',
    papel: 'Proponente',
    nome: 'Companhia Energética do Estado',
    sigla: 'CEE',
    cnpj: '12.345.678/0001-90',
    municipio: 'São Paulo',
    estado: 'SP',
    regiao: 'Sudeste'
  },
  {
    id: '2',
    projetoId: '1',
    papel: 'Executora',
    nome: 'Instituto de Pesquisas Tecnológicas',
    sigla: 'IPT',
    cnpj: '98.765.432/0001-10',
    municipio: 'São Paulo',
    estado: 'SP',
    regiao: 'Sudeste'
  }
];

// Membros da equipe mock
export const membrosEquipe: MembroEquipe[] = [
  {
    id: '1',
    projetoId: '1',
    nome: 'Dr. João Silva',
    ddd: '11',
    telefone: '999887766',
    email: 'joao.silva@cee.com.br',
    tipoDocumento: 'cpf',
    documento: '123.456.789-00',
    titulacaoId: '1',
    funcaoId: '4',
    entidadeVinculada: 'CEE',
    dataInicio: new Date('2024-01-15'),
    curriculoLattes: 'http://lattes.cnpq.br/1234567890123456'
  },
  {
    id: '2',
    projetoId: '1',
    nome: 'Dra. Ana Costa',
    ddd: '11',
    telefone: '988776655',
    email: 'ana.costa@ipt.br',
    tipoDocumento: 'cpf',
    documento: '987.654.321-00',
    titulacaoId: '1',
    funcaoId: '2',
    entidadeVinculada: 'IPT',
    dataInicio: new Date('2024-01-15'),
    curriculoLattes: 'http://lattes.cnpq.br/0987654321098765'
  }
];

// TRL (Technology Readiness Level)
export const trlOptions = [
  { value: 1, label: 'TRL 1 - Princípios básicos observados' },
  { value: 2, label: 'TRL 2 - Conceito de tecnologia formulado' },
  { value: 3, label: 'TRL 3 - Prova de conceito experimental' },
  { value: 4, label: 'TRL 4 - Tecnologia validada em laboratório' },
  { value: 5, label: 'TRL 5 - Tecnologia validada em ambiente relevante' },
  { value: 6, label: 'TRL 6 - Tecnologia demonstrada em ambiente relevante' },
  { value: 7, label: 'TRL 7 - Demonstração do sistema no ambiente operacional' },
  { value: 8, label: 'TRL 8 - Sistema completo e qualificado' },
  { value: 9, label: 'TRL 9 - Sistema atual comprovado em ambiente operacional' }
];

// Status de produtos
export const statusProdutos = [
  { value: 'planejado', label: 'Planejado' },
  { value: 'em_desenvolvimento', label: 'Em Desenvolvimento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'atrasado', label: 'Atrasado' }
];

// Tipos de comprovante
export const tiposComprovante = [
  { value: 'nota_fiscal', label: 'Nota Fiscal' },
  { value: 'recibo', label: 'Recibo' },
  { value: 'cupom_fiscal', label: 'Cupom Fiscal' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'timesheet', label: 'Timesheet' }
];
