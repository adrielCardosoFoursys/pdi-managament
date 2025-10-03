import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projetos } from '@/data/mockData';
import { AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export function Dashboard() {
  // Estatísticas gerais
  const totalProjetos = projetos.length;
  const projetosAtivos = projetos.filter(p => p.status === 'execucao').length;
  const custoTotal = projetos.reduce((acc, p) => acc + p.custoTotalPrevisto, 0);
  const custoExecutado = projetos.reduce((acc, p) => acc + p.custoExecutado, 0);

  // Dados para gráficos
  const projetosPorStatus = [
    { name: 'Planejamento', value: projetos.filter(p => p.status === 'planejamento').length },
    { name: 'Execução', value: projetos.filter(p => p.status === 'execucao').length },
    { name: 'Encerrado', value: projetos.filter(p => p.status === 'encerrado').length },
    { name: 'Cancelado', value: projetos.filter(p => p.status === 'cancelado').length },
  ];

  const evolucaoProjetos = projetos.map(p => ({
    nome: p.titulo.substring(0, 20) + '...',
    evolucao: p.percentualEvolucao,
    previsto: Math.round((p.custoExecutado / p.custoTotalPrevisto) * 100)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral dos projetos de PDI da sua empresa
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjetos}</div>
            <p className="text-xs text-muted-foreground">
              {projetosAtivos} em execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(custoTotal / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Orçamento aprovado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(custoExecutado / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((custoExecutado / custoTotal) * 100)}% do orçamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Projetos com desvio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>
              Quantidade de projetos em cada fase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projetosPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projetosPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução dos Projetos</CardTitle>
            <CardDescription>
              Progresso físico vs financeiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evolucaoProjetos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="evolucao" fill="#8884d8" name="Evolução Física %" />
                <Bar dataKey="previsto" fill="#82ca9d" name="Evolução Financeira %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Projetos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Ativos</CardTitle>
          <CardDescription>
            Últimas atualizações dos projetos em execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projetos.filter(p => p.status === 'execucao').map((projeto) => (
              <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{projeto.titulo}</h4>
                  <p className="text-sm text-muted-foreground">
                    Código ANEEL: {projeto.codigoANEEL}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Responsável: {projeto.principalResponsavel}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{projeto.percentualEvolucao}%</div>
                    <div className="text-xs text-muted-foreground">Evolução</div>
                  </div>
                  <Badge 
                    variant={
                      projeto.prioridade === 'alta' ? 'destructive' : 
                      projeto.prioridade === 'media' ? 'default' : 'secondary'
                    }
                  >
                    {projeto.prioridade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
