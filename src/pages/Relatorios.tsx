import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projetos } from '@/data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { format, addMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Relatorios() {
  const [selectedProjeto, setSelectedProjeto] = useState<string>('todos');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('12m');

  // Dados para gráficos
  const generateCronogramaData = () => {
    const projeto = projetos.find(p => p.id === selectedProjeto) || projetos[0];
    const startDate = startOfMonth(projeto.dataInicio);
    const months = [];
    
    for (let i = 0; i < projeto.duracao; i++) {
      const currentMonth = addMonths(startDate, i);
      const monthProgress = Math.min(((i + 1) / projeto.duracao) * 100, projeto.percentualEvolucao);
      const financialProgress = Math.min(((i + 1) / projeto.duracao) * 100, 
        (projeto.custoExecutado / projeto.custoTotalPrevisto) * 100);
      
      months.push({
        mes: format(currentMonth, 'MMM/yy', { locale: ptBR }),
        planejado: (i + 1) / projeto.duracao * 100,
        fisico: monthProgress,
        financeiro: financialProgress
      });
    }
    
    return months;
  };

  const generateDistribuicaoOrcamento = () => {
    return projetos.map(projeto => ({
      nome: projeto.titulo.substring(0, 20) + '...',
      orcamento: projeto.custoTotalPrevisto,
      executado: projeto.custoExecutado,
      percentual: (projeto.custoExecutado / projeto.custoTotalPrevisto) * 100
    }));
  };

  const generateEvolucaoMensal = () => {
    const meses = [];
    const baseDate = new Date('2024-01-01');
    
    for (let i = 0; i < 12; i++) {
      const currentDate = addMonths(baseDate, i);
      const projetosAtivos = projetos.filter(p => 
        p.dataInicio <= currentDate && p.dataFim >= currentDate
      ).length;
      
      const custoMensal = projetos
        .filter(p => p.dataInicio <= currentDate && p.dataFim >= currentDate)
        .reduce((acc, p) => acc + (p.custoExecutado / p.duracao), 0);
      
      meses.push({
        mes: format(currentDate, 'MMM/yy', { locale: ptBR }),
        projetos: projetosAtivos,
        custo: custoMensal,
        meta: projetosAtivos * 1.1 // Meta 10% acima
      });
    }
    
    return meses;
  };

  const generateStatusDistribution = () => {
    const statusCount = projetos.reduce((acc, projeto) => {
      acc[projeto.status] = (acc[projeto.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status === 'planejamento' ? 'Planejamento' :
            status === 'execucao' ? 'Execução' :
            status === 'encerrado' ? 'Encerrado' : 'Cancelado',
      value: count,
      color: status === 'execucao' ? '#22c55e' :
             status === 'planejamento' ? '#f59e0b' :
             status === 'encerrado' ? '#3b82f6' : '#ef4444'
    }));
  };

  const cronogramaData = generateCronogramaData();
  const distribuicaoOrcamento = generateDistribuicaoOrcamento();
  const evolucaoMensal = generateEvolucaoMensal();
  const statusDistribution = generateStatusDistribution();


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.dataKey}: {typeof item.value === 'number' && item.dataKey.includes('custo') ? 
                formatCurrency(item.value) : 
                `${item.value.toFixed(1)}${item.dataKey.includes('percentual') || item.dataKey.includes('fisico') || item.dataKey.includes('financeiro') || item.dataKey.includes('planejado') ? '%' : ''}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const generateREFP = () => {
    const projeto = projetos.find(p => p.id === selectedProjeto) || projetos[0];
    
    const refp = `
RELATÓRIO DE EXECUÇÃO FINANCEIRA DO PROJETO (REFP)

Código ANEEL: ${projeto.codigoANEEL}
Título: ${projeto.titulo}
Período: ${format(projeto.dataInicio, 'dd/MM/yyyy')} a ${format(projeto.dataFim, 'dd/MM/yyyy')}
Principal Responsável: ${projeto.principalResponsavel}

RESUMO EXECUTIVO:
- Custo Total Previsto: ${formatCurrency(projeto.custoTotalPrevisto)}
- Custo Executado: ${formatCurrency(projeto.custoExecutado)}
- Percentual de Execução Financeira: ${((projeto.custoExecutado / projeto.custoTotalPrevisto) * 100).toFixed(1)}%
- Percentual de Evolução Física: ${projeto.percentualEvolucao}%
- Status do Projeto: ${projeto.status}

PRODUTOS ENTREGUES:
${projeto.produtos.map(produto => `- ${produto}`).join('\n')}

ESCOPO:
${projeto.escopo}

Relatório gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
    `.trim();

    const blob = new Blob([refp], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REFP_${projeto.codigoANEEL.replace('/', '-')}_${format(new Date(), 'yyyyMMdd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Simulação de export para Excel (em produção, usar biblioteca como xlsx)
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios & Cronogramas</h2>
          <p className="text-muted-foreground">
            Visualize relatórios, cronogramas e análises dos projetos
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportToExcel(distribuicaoOrcamento, 'distribuicao_orcamento')}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button onClick={generateREFP}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar REFP
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-full md:w-64">
              <Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar projeto" />
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
            <div className="w-full md:w-48">
              <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                  <SelectItem value="24m">Últimos 24 meses</SelectItem>
                  <SelectItem value="all">Todo o período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cronograma" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cronograma" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Cronograma
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="evolucao" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Evolução
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cronograma" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Cronograma Físico vs Financeiro
              </CardTitle>
              <CardDescription>
                {selectedProjeto !== 'todos' ? 
                  `Evolução do projeto: ${projetos.find(p => p.id === selectedProjeto)?.titulo}` :
                  'Visão geral de todos os projetos'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cronogramaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="planejado" stroke="#94a3b8" name="Planejado" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="fisico" stroke="#22c55e" name="Físico" strokeWidth={2} />
                  <Line type="monotone" dataKey="financeiro" stroke="#3b82f6" name="Financeiro" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo do Cronograma */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Projetos Ativos</p>
                    <p className="text-2xl font-bold">{projetos.filter(p => p.status === 'execucao').length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Projetos Atrasados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {projetos.filter(p => p.percentualEvolucao < 50 && p.status === 'execucao').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Prazo Médio</p>
                    <p className="text-2xl font-bold">
                      {Math.round(projetos.reduce((acc, p) => acc + p.duracao, 0) / projetos.length)} meses
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Distribuição de Orçamento por Projeto
              </CardTitle>
              <CardDescription>
                Comparação entre orçamento previsto e executado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={distribuicaoOrcamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orcamento" fill="#94a3b8" name="Orçamento" />
                  <Bar dataKey="executado" fill="#22c55e" name="Executado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Orçamento Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(projetos.reduce((acc, p) => acc + p.custoTotalPrevisto, 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Executado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(projetos.reduce((acc, p) => acc + p.custoExecutado, 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">% Execução</p>
                  <p className="text-2xl font-bold">
                    {((projetos.reduce((acc, p) => acc + p.custoExecutado, 0) / 
                       projetos.reduce((acc, p) => acc + p.custoTotalPrevisto, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(projetos.reduce((acc, p) => acc + (p.custoTotalPrevisto - p.custoExecutado), 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Evolução Mensal dos Projetos
              </CardTitle>
              <CardDescription>
                Acompanhamento da evolução ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="projetos" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Projetos Ativos" />
                  <Line type="monotone" dataKey="meta" stroke="#ef4444" strokeDasharray="5 5" name="Meta" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Custos Mensais
              </CardTitle>
              <CardDescription>
                Evolução dos custos ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="custo" stroke="#22c55e" fill="#22c55e" name="Custo Mensal" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Distribuição por Status
                </CardTitle>
                <CardDescription>
                  Quantidade de projetos por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projetos por Prioridade</CardTitle>
                <CardDescription>
                  Classificação dos projetos ativos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['alta', 'media', 'baixa'].map((prioridade) => {
                  const count = projetos.filter(p => p.prioridade === prioridade && p.status === 'execucao').length;
                  const total = projetos.filter(p => p.status === 'execucao').length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={prioridade} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{prioridade}</span>
                        <span>{count} projetos ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            prioridade === 'alta' ? 'bg-red-500' :
                            prioridade === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Lista de Projetos com Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status Detalhado dos Projetos</CardTitle>
              <CardDescription>
                Visão consolidada de todos os projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projetos.map((projeto) => (
                  <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{projeto.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{projeto.codigoANEEL}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{projeto.percentualEvolucao}%</div>
                        <div className="text-xs text-muted-foreground">Evolução</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{formatCurrency(projeto.custoExecutado)}</div>
                        <div className="text-xs text-muted-foreground">Executado</div>
                      </div>
                      <Badge variant={
                        projeto.status === 'execucao' ? 'default' :
                        projeto.status === 'planejamento' ? 'secondary' :
                        projeto.status === 'encerrado' ? 'outline' : 'destructive'
                      }>
                        {projeto.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
