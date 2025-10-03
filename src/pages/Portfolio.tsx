import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projetos } from '@/data/mockData';
import { 
  Calendar, 
  DollarSign, 
  Grid3X3, 
  List, 
  Plus, 
  TrendingUp, 
  User 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Portfolio() {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'execucao': return 'bg-green-500';
      case 'planejamento': return 'bg-yellow-500';
      case 'encerrado': return 'bg-blue-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const CardView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projetos.map((projeto) => (
        <Card key={projeto.id} className="hover:shadow-lg transition-shadow">
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
                <Badge variant={getPriorityColor(projeto.prioridade)}>
                  {projeto.prioridade}
                </Badge>
                <div className={`h-3 w-3 rounded-full ${getStatusColor(projeto.status)}`}></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
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
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {projetos.map((projeto) => (
        <Card key={projeto.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(projeto.status)}`}></div>
                  <div>
                    <h3 className="font-medium">{projeto.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{projeto.codigoANEEL}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-sm font-medium">{projeto.principalResponsavel}</p>
                  <p className="text-xs text-muted-foreground">Responsável</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium">{projeto.percentualEvolucao}%</p>
                  <p className="text-xs text-muted-foreground">Evolução</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium">{formatCurrency(projeto.custoTotalPrevisto)}</p>
                  <p className="text-xs text-muted-foreground">Orçamento</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium">{formatCurrency(projeto.custoExecutado)}</p>
                  <p className="text-xs text-muted-foreground">Executado</p>
                </div>
                
                <Badge variant={getPriorityColor(projeto.prioridade)}>
                  {projeto.prioridade}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfólio de Projetos</h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os projetos de PDI
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total de Projetos</p>
                <p className="text-2xl font-bold">{projetos.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
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
              <div className="h-8 w-8 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(projetos.reduce((acc, p) => acc + p.custoTotalPrevisto, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Executado</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(projetos.reduce((acc, p) => acc + p.custoExecutado, 0))}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista/Cards de Projetos */}
      {viewMode === 'cards' ? <CardView /> : <ListView />}
    </div>
  );
}
