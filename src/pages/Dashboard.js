"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = Dashboard;
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
function Dashboard() {
    // Estatísticas gerais
    var totalProjetos = mockData_1.projetos.length;
    var projetosAtivos = mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).length;
    var custoTotal = mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoTotalPrevisto; }, 0);
    var custoExecutado = mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoExecutado; }, 0);
    // Dados para gráficos
    var projetosPorStatus = [
        { name: 'Planejamento', value: mockData_1.projetos.filter(function (p) { return p.status === 'planejamento'; }).length },
        { name: 'Execução', value: mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).length },
        { name: 'Encerrado', value: mockData_1.projetos.filter(function (p) { return p.status === 'encerrado'; }).length },
        { name: 'Cancelado', value: mockData_1.projetos.filter(function (p) { return p.status === 'cancelado'; }).length },
    ];
    var evolucaoProjetos = mockData_1.projetos.map(function (p) { return ({
        nome: p.titulo.substring(0, 20) + '...',
        evolucao: p.percentualEvolucao,
        previsto: Math.round((p.custoExecutado / p.custoTotalPrevisto) * 100)
    }); });
    var COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (<div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral dos projetos de PDI da sua empresa
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Total de Projetos</card_1.CardTitle>
            <lucide_react_1.CheckCircle className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{totalProjetos}</div>
            <p className="text-xs text-muted-foreground">
              {projetosAtivos} em execução
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Investimento Total</card_1.CardTitle>
            <lucide_react_1.DollarSign className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              R$ {(custoTotal / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Orçamento aprovado
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Executado</card_1.CardTitle>
            <lucide_react_1.Clock className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              R$ {(custoExecutado / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((custoExecutado / custoTotal) * 100)}% do orçamento
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Alertas</card_1.CardTitle>
            <lucide_react_1.AlertTriangle className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Projetos com desvio
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Distribuição por Status</card_1.CardTitle>
            <card_1.CardDescription>
              Quantidade de projetos em cada fase
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.PieChart>
                <recharts_1.Pie data={projetosPorStatus} cx="50%" cy="50%" labelLine={false} label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, " ").concat((percent * 100).toFixed(0), "%");
    }} outerRadius={80} fill="#8884d8" dataKey="value">
                  {projetosPorStatus.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
                </recharts_1.Pie>
                <recharts_1.Tooltip />
              </recharts_1.PieChart>
            </recharts_1.ResponsiveContainer>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Evolução dos Projetos</card_1.CardTitle>
            <card_1.CardDescription>
              Progresso físico vs financeiro
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.BarChart data={evolucaoProjetos}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="nome"/>
                <recharts_1.YAxis />
                <recharts_1.Tooltip />
                <recharts_1.Bar dataKey="evolucao" fill="#8884d8" name="Evolução Física %"/>
                <recharts_1.Bar dataKey="previsto" fill="#82ca9d" name="Evolução Financeira %"/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Lista de Projetos Recentes */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Projetos Ativos</card_1.CardTitle>
          <card_1.CardDescription>
            Últimas atualizações dos projetos em execução
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).map(function (projeto) { return (<div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                  <badge_1.Badge variant={projeto.prioridade === 'alta' ? 'destructive' :
                projeto.prioridade === 'media' ? 'default' : 'secondary'}>
                    {projeto.prioridade}
                  </badge_1.Badge>
                </div>
              </div>); })}
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
