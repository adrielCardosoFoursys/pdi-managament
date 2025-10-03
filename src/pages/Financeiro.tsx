import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  projetos,
  rubricasFinanceiras,
  tiposComprovante
} from '@/data/mockData';
import { 
  DollarSign, 
  Plus, 
  Search,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AcompanhamentoFinanceiro {
  id: string;
  projetoId: string;
  financiadora: string;
  executora: string;
  rubricaId: string;
  mes: string;
  valorPrevisto: number;
  valorRealizado: number;
}

interface DetalhamentoDespesa {
  id: string;
  projetoId: string;
  dataDespesa: string;
  numeroNotaFiscal: string;
  etapaProjetoId?: string;
  tipoComprovante: string;
  favorecido: string;
  rubricaId: string;
  cnpj: string;
  descricao: string;
  justificativa: string;
  anexo?: string;
  valor: number;
  status: 'pendente' | 'aprovada' | 'rejeitada';
}

const mockAcompanhamento: AcompanhamentoFinanceiro[] = [
  {
    id: '1',
    projetoId: '1',
    financiadora: 'CPFL Energia',
    executora: 'Instituto de Pesquisas Tecnológicas',
    rubricaId: '6', // RH
    mes: '2024-10',
    valorPrevisto: 50000,
    valorRealizado: 45000
  },
  {
    id: '2',
    projetoId: '1',
    financiadora: 'CPFL Energia',
    executora: 'Instituto de Pesquisas Tecnológicas',
    rubricaId: '1', // AC
    mes: '2024-10',
    valorPrevisto: 30000,
    valorRealizado: 28000
  },
  {
    id: '3',
    projetoId: '2',
    financiadora: 'Transmissora Aliança',
    executora: 'UNICAMP',
    rubricaId: '6', // RH
    mes: '2024-10',
    valorPrevisto: 80000,
    valorRealizado: 75000
  }
];

const mockDespesas: DetalhamentoDespesa[] = [
  {
    id: '1',
    projetoId: '1',
    dataDespesa: '2024-10-15',
    numeroNotaFiscal: '12345',
    tipoComprovante: 'Nota Fiscal',
    favorecido: 'João Silva',
    rubricaId: '6',
    cnpj: '12.345.678/0001-90',
    descricao: 'Consultoria técnica especializada',
    justificativa: 'Necessário para desenvolvimento do módulo de IA',
    valor: 15000,
    status: 'aprovada'
  },
  {
    id: '2',
    projetoId: '1',
    dataDespesa: '2024-10-20',
    numeroNotaFiscal: '67890',
    tipoComprovante: 'Nota Fiscal',
    favorecido: 'TechSupply Ltda',
    rubricaId: '1',
    cnpj: '98.765.432/0001-10',
    descricao: 'Equipamentos de medição',
    justificativa: 'Sensores IoT para monitoramento da rede',
    valor: 28000,
    status: 'pendente'
  }
];

export function Financeiro() {
  const [acompanhamentos, setAcompanhamentos] = useState<AcompanhamentoFinanceiro[]>(mockAcompanhamento);
  const [despesas, setDespesas] = useState<DetalhamentoDespesa[]>(mockDespesas);
  const [selectedProjeto, setSelectedProjeto] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAcompanhamentoFormOpen, setIsAcompanhamentoFormOpen] = useState(false);
  const [isDespesaFormOpen, setIsDespesaFormOpen] = useState(false);
  const [selectedAcompanhamento, setSelectedAcompanhamento] = useState<AcompanhamentoFinanceiro | null>(null);
  const [selectedDespesa, setSelectedDespesa] = useState<DetalhamentoDespesa | null>(null);

  // Form states
  const [acompanhamentoForm, setAcompanhamentoForm] = useState({
    projetoId: '',
    financiadora: '',
    executora: '',
    rubricaId: '',
    mes: '',
    valorPrevisto: 0,
    valorRealizado: 0
  });

  const [despesaForm, setDespesaForm] = useState({
    projetoId: '',
    dataDespesa: '',
    numeroNotaFiscal: '',
    tipoComprovante: '',
    favorecido: '',
    rubricaId: '',
    cnpj: '',
    descricao: '',
    justificativa: '',
    valor: 0
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'default';
      case 'pendente': return 'secondary';
      case 'rejeitada': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovada': return 'Aprovada';
      case 'pendente': return 'Pendente';
      case 'rejeitada': return 'Rejeitada';
      default: return status;
    }
  };

  const filteredAcompanhamentos = acompanhamentos.filter(acomp => {
    const projeto = projetos.find(p => p.id === acomp.projetoId);
    const matchesSearch = projeto?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acomp.financiadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acomp.executora.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProjeto = selectedProjeto === 'todos' || acomp.projetoId === selectedProjeto;
    
    return matchesSearch && matchesProjeto;
  });

  const filteredDespesas = despesas.filter(despesa => {
    const projeto = projetos.find(p => p.id === despesa.projetoId);
    const matchesSearch = projeto?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         despesa.favorecido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         despesa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         despesa.numeroNotaFiscal.includes(searchTerm);
    
    const matchesProjeto = selectedProjeto === 'todos' || despesa.projetoId === selectedProjeto;
    
    return matchesSearch && matchesProjeto;
  });

  const handleCreateAcompanhamento = () => {
    const newAcompanhamento: AcompanhamentoFinanceiro = {
      ...acompanhamentoForm,
      id: Date.now().toString()
    };
    setAcompanhamentos([...acompanhamentos, newAcompanhamento]);
    setAcompanhamentoForm({
      projetoId: '',
      financiadora: '',
      executora: '',
      rubricaId: '',
      mes: '',
      valorPrevisto: 0,
      valorRealizado: 0
    });
    setIsAcompanhamentoFormOpen(false);
  };

  const handleCreateDespesa = () => {
    const newDespesa: DetalhamentoDespesa = {
      ...despesaForm,
      id: Date.now().toString(),
      status: 'pendente'
    };
    setDespesas([...despesas, newDespesa]);
    setDespesaForm({
      projetoId: '',
      dataDespesa: '',
      numeroNotaFiscal: '',
      tipoComprovante: '',
      favorecido: '',
      rubricaId: '',
      cnpj: '',
      descricao: '',
      justificativa: '',
      valor: 0
    });
    setIsDespesaFormOpen(false);
  };

  const handleDeleteAcompanhamento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este acompanhamento?')) {
      setAcompanhamentos(acompanhamentos.filter(a => a.id !== id));
    }
  };

  const handleDeleteDespesa = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      setDespesas(despesas.filter(d => d.id !== id));
    }
  };

  const handleApprovarDespesa = (id: string) => {
    setDespesas(despesas.map(d => 
      d.id === id ? { ...d, status: 'aprovada' } : d
    ));
  };

  const handleRejeitarDespesa = (id: string) => {
    setDespesas(despesas.map(d => 
      d.id === id ? { ...d, status: 'rejeitada' } : d
    ));
  };

  // Cálculos de resumo
  const totalPrevisto = filteredAcompanhamentos.reduce((acc, a) => acc + a.valorPrevisto, 0);
  const totalRealizado = filteredAcompanhamentos.reduce((acc, a) => acc + a.valorRealizado, 0);
  const desvio = totalRealizado - totalPrevisto;
  const percentualExecucao = totalPrevisto > 0 ? (totalRealizado / totalPrevisto) * 100 : 0;

  const AcompanhamentoCard = ({ acompanhamento }: { acompanhamento: AcompanhamentoFinanceiro }) => {
    const projeto = projetos.find(p => p.id === acompanhamento.projetoId);
    const rubrica = rubricasFinanceiras.find(r => r.id === acompanhamento.rubricaId);
    const desvioItem = acompanhamento.valorRealizado - acompanhamento.valorPrevisto;
    const percentualItem = acompanhamento.valorPrevisto > 0 ? 
      (acompanhamento.valorRealizado / acompanhamento.valorPrevisto) * 100 : 0;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-1">
                {projeto?.titulo || 'Projeto não encontrado'}
              </CardTitle>
              <CardDescription className="text-sm">
                {rubrica?.sigla} - {rubrica?.descricao}
              </CardDescription>
            </div>
            <Badge variant={desvioItem >= 0 ? 'default' : 'destructive'}>
              {percentualItem.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Financiadora:</strong> {acompanhamento.financiadora}</p>
            <p><strong>Executora:</strong> {acompanhamento.executora}</p>
            <p><strong>Período:</strong> {format(new Date(acompanhamento.mes), 'MMM/yyyy', { locale: ptBR })}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Previsto</p>
              <p className="font-semibold text-blue-600">{formatCurrency(acompanhamento.valorPrevisto)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Realizado</p>
              <p className="font-semibold text-green-600">{formatCurrency(acompanhamento.valorRealizado)}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Desvio:</span>
              <span className={`font-medium ${desvioItem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {desvioItem >= 0 ? '+' : ''}{formatCurrency(desvioItem)}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedAcompanhamento(acompanhamento);
                setAcompanhamentoForm(acompanhamento);
                setIsAcompanhamentoFormOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteAcompanhamento(acompanhamento.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const DespesaCard = ({ despesa }: { despesa: DetalhamentoDespesa }) => {
    const projeto = projetos.find(p => p.id === despesa.projetoId);
    const rubrica = rubricasFinanceiras.find(r => r.id === despesa.rubricaId);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-1">
                {despesa.descricao}
              </CardTitle>
              <CardDescription className="text-sm">
                NF: {despesa.numeroNotaFiscal} • {despesa.favorecido}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge variant={getStatusColor(despesa.status)}>
                {getStatusLabel(despesa.status)}
              </Badge>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(despesa.valor)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Projeto:</strong> {projeto?.titulo}</p>
            <p><strong>Rubrica:</strong> {rubrica?.sigla} - {rubrica?.descricao}</p>
            <p><strong>Data:</strong> {format(new Date(despesa.dataDespesa), 'dd/MM/yyyy')}</p>
            <p><strong>CNPJ:</strong> {formatCNPJ(despesa.cnpj)}</p>
            <p><strong>Tipo:</strong> {despesa.tipoComprovante}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm"><strong>Justificativa:</strong></p>
            <p className="text-sm text-muted-foreground">{despesa.justificativa}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-2">
              {despesa.status === 'pendente' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleApprovarDespesa(despesa.id)}
                  >
                    Aprovar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleRejeitarDespesa(despesa.id)}
                  >
                    Rejeitar
                  </Button>
                </>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedDespesa(despesa);
                  setDespesaForm(despesa);
                  setIsDespesaFormOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDeleteDespesa(despesa.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Acompanhamento Financeiro</h2>
          <p className="text-muted-foreground">
            Gerencie o acompanhamento financeiro e despesas dos projetos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Projetos</SelectItem>
                  {projetos.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Previsto</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrevisto)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Realizado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRealizado)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Desvio</p>
                <p className={`text-2xl font-bold ${desvio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {desvio >= 0 ? '+' : ''}{formatCurrency(desvio)}
                </p>
              </div>
              {desvio >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-600" /> : 
                <TrendingDown className="h-8 w-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">% Execução</p>
                <p className="text-2xl font-bold">{percentualExecucao.toFixed(1)}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {Math.round(percentualExecucao)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="acompanhamento" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="acompanhamento" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Acompanhamento ({filteredAcompanhamentos.length})
          </TabsTrigger>
          <TabsTrigger value="despesas" className="flex items-center">
            <Receipt className="mr-2 h-4 w-4" />
            Despesas ({filteredDespesas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="acompanhamento" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAcompanhamentoFormOpen} onOpenChange={setIsAcompanhamentoFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedAcompanhamento(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Acompanhamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedAcompanhamento ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Projeto *</Label>
                    <Select 
                      value={acompanhamentoForm.projetoId} 
                      onValueChange={(value) => setAcompanhamentoForm({...acompanhamentoForm, projetoId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projetos.map((projeto) => (
                          <SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="financiadora">Financiadora *</Label>
                      <Input
                        id="financiadora"
                        value={acompanhamentoForm.financiadora}
                        onChange={(e) => setAcompanhamentoForm({...acompanhamentoForm, financiadora: e.target.value})}
                        placeholder="Nome da financiadora"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="executora">Executora *</Label>
                      <Input
                        id="executora"
                        value={acompanhamentoForm.executora}
                        onChange={(e) => setAcompanhamentoForm({...acompanhamentoForm, executora: e.target.value})}
                        placeholder="Nome da executora"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rubrica *</Label>
                      <Select 
                        value={acompanhamentoForm.rubricaId} 
                        onValueChange={(value) => setAcompanhamentoForm({...acompanhamentoForm, rubricaId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a rubrica" />
                        </SelectTrigger>
                        <SelectContent>
                          {rubricasFinanceiras.map((rubrica) => (
                            <SelectItem key={rubrica.id} value={rubrica.id}>
                              {rubrica.sigla} - {rubrica.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mes">Mês/Ano *</Label>
                      <Input
                        id="mes"
                        type="month"
                        value={acompanhamentoForm.mes}
                        onChange={(e) => setAcompanhamentoForm({...acompanhamentoForm, mes: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorPrevisto">Valor Previsto (R$) *</Label>
                      <Input
                        id="valorPrevisto"
                        type="number"
                        step="0.01"
                        value={acompanhamentoForm.valorPrevisto}
                        onChange={(e) => setAcompanhamentoForm({...acompanhamentoForm, valorPrevisto: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorRealizado">Valor Realizado (R$) *</Label>
                      <Input
                        id="valorRealizado"
                        type="number"
                        step="0.01"
                        value={acompanhamentoForm.valorRealizado}
                        onChange={(e) => setAcompanhamentoForm({...acompanhamentoForm, valorRealizado: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAcompanhamentoFormOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateAcompanhamento}>
                      {selectedAcompanhamento ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAcompanhamentos.map((acompanhamento) => (
              <AcompanhamentoCard key={acompanhamento.id} acompanhamento={acompanhamento} />
            ))}
          </div>

          {filteredAcompanhamentos.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum acompanhamento encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando o primeiro acompanhamento financeiro.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="despesas" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isDespesaFormOpen} onOpenChange={setIsDespesaFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedDespesa(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedDespesa ? 'Editar Despesa' : 'Nova Despesa'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Projeto *</Label>
                    <Select 
                      value={despesaForm.projetoId} 
                      onValueChange={(value) => setDespesaForm({...despesaForm, projetoId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projetos.map((projeto) => (
                          <SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataDespesa">Data da Despesa *</Label>
                      <Input
                        id="dataDespesa"
                        type="date"
                        value={despesaForm.dataDespesa}
                        onChange={(e) => setDespesaForm({...despesaForm, dataDespesa: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroNotaFiscal">Número NF *</Label>
                      <Input
                        id="numeroNotaFiscal"
                        value={despesaForm.numeroNotaFiscal}
                        onChange={(e) => setDespesaForm({...despesaForm, numeroNotaFiscal: e.target.value})}
                        placeholder="12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo Comprovante *</Label>
                      <Select 
                        value={despesaForm.tipoComprovante} 
                        onValueChange={(value) => setDespesaForm({...despesaForm, tipoComprovante: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposComprovante.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.label}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="favorecido">Favorecido *</Label>
                      <Input
                        id="favorecido"
                        value={despesaForm.favorecido}
                        onChange={(e) => setDespesaForm({...despesaForm, favorecido: e.target.value})}
                        placeholder="Nome do favorecido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        value={despesaForm.cnpj}
                        onChange={(e) => setDespesaForm({...despesaForm, cnpj: e.target.value})}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rubrica *</Label>
                      <Select 
                        value={despesaForm.rubricaId} 
                        onValueChange={(value) => setDespesaForm({...despesaForm, rubricaId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a rubrica" />
                        </SelectTrigger>
                        <SelectContent>
                          {rubricasFinanceiras.map((rubrica) => (
                            <SelectItem key={rubrica.id} value={rubrica.id}>
                              {rubrica.sigla} - {rubrica.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$) *</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={despesaForm.valor}
                        onChange={(e) => setDespesaForm({...despesaForm, valor: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input
                      id="descricao"
                      value={despesaForm.descricao}
                      onChange={(e) => setDespesaForm({...despesaForm, descricao: e.target.value})}
                      placeholder="Descrição da despesa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justificativa">Justificativa *</Label>
                    <Textarea
                      id="justificativa"
                      value={despesaForm.justificativa}
                      onChange={(e) => setDespesaForm({...despesaForm, justificativa: e.target.value})}
                      placeholder="Justificativa para a despesa..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDespesaFormOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateDespesa}>
                      {selectedDespesa ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDespesas.map((despesa) => (
              <DespesaCard key={despesa.id} despesa={despesa} />
            ))}
          </div>

          {filteredDespesas.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma despesa encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando a primeira despesa.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
