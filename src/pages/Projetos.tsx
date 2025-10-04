import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjetoForm } from '@/components/forms/ProjetoForm';
import { projetos as projetosMock } from '@/data/mockData';
import { 
  Edit, 
  Eye, 
  Plus, 
  Search,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Projeto, ProjetoFormData } from '@/types';

export function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosMock);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.codigoANEEL.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.principalResponsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || projeto.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const convertFormDataToProjeto = (data: ProjetoFormData): Omit<Projeto, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'> => {
    return {
      ...data,
      dataInicio: new Date(data.dataInicio),
      dataFim: new Date(data.dataFim),
    };
  };

  const convertProjetoToFormData = (projeto: Projeto): ProjetoFormData => {
    return {
      ...projeto,
      dataInicio: projeto.dataInicio.toISOString().split('T')[0],
      dataFim: projeto.dataFim.toISOString().split('T')[0],
    };
  };

  const handleCreateProjeto = (data: ProjetoFormData) => {
    const newProjeto: Projeto = {
      ...convertFormDataToProjeto(data),
      id: Date.now().toString(),
      tenantId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjetos([newProjeto, ...projetos]);
    setIsFormOpen(false);
  };

  const handleUpdateProjeto = (data: ProjetoFormData) => {
    if (!selectedProjeto) return;
    
    const updatedProjeto: Projeto = {
      ...selectedProjeto,
      ...convertFormDataToProjeto(data),
      updatedAt: new Date(),
    };
    
    setProjetos(projetos.map(p => p.id === selectedProjeto.id ? updatedProjeto : p));
    setSelectedProjeto(null);
    setIsFormOpen(false);
  };

  const handleDeleteProjeto = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjetos(projetos.filter(p => p.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'execucao': return 'default';
      case 'planejamento': return 'secondary';
      case 'encerrado': return 'outline';
      case 'cancelado': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planejamento': return 'Planejamento';
      case 'execucao': return 'Execução';
      case 'encerrado': return 'Encerrado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const ProjetoCard = ({ projeto }: { projeto: Projeto }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">
              {projeto.titulo}
            </CardTitle>
            <CardDescription className="text-sm">
              {projeto.codigoANEEL}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={getStatusColor(projeto.status)}>
              {getStatusLabel(projeto.status)}
            </Badge>
            <Badge variant={getPriorityColor(projeto.prioridade)}>
              {projeto.prioridade}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          {projeto.principalResponsavel}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(projeto.dataInicio, 'MMM yyyy', { locale: ptBR })} - {format(projeto.dataFim, 'MMM yyyy', { locale: ptBR })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Evolução</span>
            <span className="font-medium">{projeto.percentualEvolucao}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${projeto.percentualEvolucao}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Orçamento</p>
            <p className="font-medium">{formatCurrency(projeto.custoTotalPrevisto)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Executado</p>
            <p className="font-medium">{formatCurrency(projeto.custoExecutado)}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedProjeto(projeto);
              setIsViewOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedProjeto(projeto);
              setIsFormOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeleteProjeto(projeto.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProjetoDetalhes = ({ projeto }: { projeto: Projeto }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Código ANEEL</h4>
          <p>{projeto.codigoANEEL}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
          <Badge variant={getStatusColor(projeto.status)}>
            {getStatusLabel(projeto.status)}
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Escopo</h4>
        <p className="text-sm">{projeto.escopo}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Data de Início</h4>
          <p>{format(projeto.dataInicio, 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Data de Fim</h4>
          <p>{format(projeto.dataFim, 'dd/MM/yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Duração</h4>
          <p>{projeto.duracao} meses</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Prorrogação</h4>
          <p>{projeto.prorrogacao || 0} meses</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Prioridade</h4>
          <Badge variant={getPriorityColor(projeto.prioridade)}>
            {projeto.prioridade}
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Produtos</h4>
        <div className="flex flex-wrap gap-2">
          {projeto.produtos.map((produto, index) => (
            <Badge key={index} variant="outline">
              {produto}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Custo Total Previsto</h4>
          <p className="text-lg font-semibold">{formatCurrency(projeto.custoTotalPrevisto)}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Custo Executado</h4>
          <p className="text-lg font-semibold">{formatCurrency(projeto.custoExecutado)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Projetos</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie todos os projetos de PDI
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProjeto(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProjeto ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
            </DialogHeader>
            <ProjetoForm
              projeto={selectedProjeto ? convertProjetoToFormData(selectedProjeto) : undefined}
              onSubmit={selectedProjeto ? handleUpdateProjeto : handleCreateProjeto}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedProjeto(null);
              }}
              isEditing={!!selectedProjeto}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Pesquisar projetos..."
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('todos')}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'planejamento' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('planejamento')}
              >
                Planejamento
              </Button>
              <Button
                variant={statusFilter === 'execucao' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('execucao')}
              >
                Execução
              </Button>
              <Button
                variant={statusFilter === 'encerrado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('encerrado')}
              >
                Encerrado
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProjetos.length} projeto(s) encontrado(s)
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{projetos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Em Execução</p>
                <p className="text-2xl font-bold">{projetos.filter(p => p.status === 'execucao').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Investimento</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(projetos.reduce((acc, p) => acc + p.custoTotalPrevisto, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Alertas</p>
                <p className="text-2xl font-bold">
                  {projetos.filter(p => p.percentualEvolucao < 50 && p.status === 'execucao').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Projetos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjetos.map((projeto) => (
          <ProjetoCard key={projeto.id} projeto={projeto} />
        ))}
      </div>

      {filteredProjetos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece criando seu primeiro projeto.'}
            </p>
            {!searchTerm && statusFilter === 'todos' && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Visualização */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProjeto?.titulo}
            </DialogTitle>
          </DialogHeader>
          {selectedProjeto && <ProjetoDetalhes projeto={selectedProjeto} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
