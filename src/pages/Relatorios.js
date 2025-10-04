"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relatorios = Relatorios;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var select_1 = require("@/components/ui/select");
var mockData_1 = require("@/data/mockData");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
function Relatorios() {
    var _a;
    var _b = (0, react_1.useState)('todos'), selectedProjeto = _b[0], setSelectedProjeto = _b[1];
    var _c = (0, react_1.useState)('12m'), selectedPeriodo = _c[0], setSelectedPeriodo = _c[1];
    // Dados para gráficos
    var generateCronogramaData = function () {
        var projeto = mockData_1.projetos.find(function (p) { return p.id === selectedProjeto; }) || mockData_1.projetos[0];
        var startDate = (0, date_fns_1.startOfMonth)(projeto.dataInicio);
        var months = [];
        for (var i = 0; i < projeto.duracao; i++) {
            var currentMonth = (0, date_fns_1.addMonths)(startDate, i);
            var monthProgress = Math.min(((i + 1) / projeto.duracao) * 100, projeto.percentualEvolucao);
            var financialProgress = Math.min(((i + 1) / projeto.duracao) * 100, (projeto.custoExecutado / projeto.custoTotalPrevisto) * 100);
            months.push({
                mes: (0, date_fns_1.format)(currentMonth, 'MMM/yy', { locale: locale_1.ptBR }),
                planejado: (i + 1) / projeto.duracao * 100,
                fisico: monthProgress,
                financeiro: financialProgress
            });
        }
        return months;
    };
    var generateDistribuicaoOrcamento = function () {
        return mockData_1.projetos.map(function (projeto) { return ({
            nome: projeto.titulo.substring(0, 20) + '...',
            orcamento: projeto.custoTotalPrevisto,
            executado: projeto.custoExecutado,
            percentual: (projeto.custoExecutado / projeto.custoTotalPrevisto) * 100
        }); });
    };
    var generateEvolucaoMensal = function () {
        var meses = [];
        var baseDate = new Date('2024-01-01');
        var _loop_1 = function (i) {
            var currentDate = (0, date_fns_1.addMonths)(baseDate, i);
            var projetosAtivos = mockData_1.projetos.filter(function (p) {
                return p.dataInicio <= currentDate && p.dataFim >= currentDate;
            }).length;
            var custoMensal = mockData_1.projetos
                .filter(function (p) { return p.dataInicio <= currentDate && p.dataFim >= currentDate; })
                .reduce(function (acc, p) { return acc + (p.custoExecutado / p.duracao); }, 0);
            meses.push({
                mes: (0, date_fns_1.format)(currentDate, 'MMM/yy', { locale: locale_1.ptBR }),
                projetos: projetosAtivos,
                custo: custoMensal,
                meta: projetosAtivos * 1.1 // Meta 10% acima
            });
        };
        for (var i = 0; i < 12; i++) {
            _loop_1(i);
        }
        return meses;
    };
    var generateStatusDistribution = function () {
        var statusCount = mockData_1.projetos.reduce(function (acc, projeto) {
            acc[projeto.status] = (acc[projeto.status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(statusCount).map(function (_a) {
            var status = _a[0], count = _a[1];
            return ({
                name: status === 'planejamento' ? 'Planejamento' :
                    status === 'execucao' ? 'Execução' :
                        status === 'encerrado' ? 'Encerrado' : 'Cancelado',
                value: count,
                color: status === 'execucao' ? '#22c55e' :
                    status === 'planejamento' ? '#f59e0b' :
                        status === 'encerrado' ? '#3b82f6' : '#ef4444'
            });
        });
    };
    var cronogramaData = generateCronogramaData();
    var distribuicaoOrcamento = generateDistribuicaoOrcamento();
    var evolucaoMensal = generateEvolucaoMensal();
    var statusDistribution = generateStatusDistribution();
    var COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'];
    var formatCurrency = function (value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    var CustomTooltip = function (_a) {
        var active = _a.active, payload = _a.payload, label = _a.label;
        if (active && payload && payload.length) {
            return (<div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map(function (item, index) { return (<p key={index} style={{ color: item.color }}>
              {item.dataKey}: {typeof item.value === 'number' && item.dataKey.includes('custo') ?
                        formatCurrency(item.value) :
                        "".concat(item.value.toFixed(1)).concat(item.dataKey.includes('percentual') || item.dataKey.includes('fisico') || item.dataKey.includes('financeiro') || item.dataKey.includes('planejado') ? '%' : '')}
            </p>); })}
        </div>);
        }
        return null;
    };
    var generateREFP = function () {
        var projeto = mockData_1.projetos.find(function (p) { return p.id === selectedProjeto; }) || mockData_1.projetos[0];
        var refp = "\nRELAT\u00D3RIO DE EXECU\u00C7\u00C3O FINANCEIRA DO PROJETO (REFP)\n\nC\u00F3digo ANEEL: ".concat(projeto.codigoANEEL, "\nT\u00EDtulo: ").concat(projeto.titulo, "\nPer\u00EDodo: ").concat((0, date_fns_1.format)(projeto.dataInicio, 'dd/MM/yyyy'), " a ").concat((0, date_fns_1.format)(projeto.dataFim, 'dd/MM/yyyy'), "\nPrincipal Respons\u00E1vel: ").concat(projeto.principalResponsavel, "\n\nRESUMO EXECUTIVO:\n- Custo Total Previsto: ").concat(formatCurrency(projeto.custoTotalPrevisto), "\n- Custo Executado: ").concat(formatCurrency(projeto.custoExecutado), "\n- Percentual de Execu\u00E7\u00E3o Financeira: ").concat(((projeto.custoExecutado / projeto.custoTotalPrevisto) * 100).toFixed(1), "%\n- Percentual de Evolu\u00E7\u00E3o F\u00EDsica: ").concat(projeto.percentualEvolucao, "%\n- Status do Projeto: ").concat(projeto.status, "\n\nPRODUTOS ENTREGUES:\n").concat(projeto.produtos.map(function (produto) { return "- ".concat(produto); }).join('\n'), "\n\nESCOPO:\n").concat(projeto.escopo, "\n\nRelat\u00F3rio gerado em: ").concat((0, date_fns_1.format)(new Date(), 'dd/MM/yyyy HH:mm'), "\n    ").trim();
        var blob = new Blob([refp], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = "REFP_".concat(projeto.codigoANEEL.replace('/', '-'), "_").concat((0, date_fns_1.format)(new Date(), 'yyyyMMdd'), ".txt");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    var exportToExcel = function (data, filename) {
        // Simulação de export para Excel (em produção, usar biblioteca como xlsx)
        var csvContent = "data:text/csv;charset=utf-8,"
            + Object.keys(data[0]).join(",") + "\n"
            + data.map(function (row) { return Object.values(row).join(","); }).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "".concat(filename, ".csv"));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios & Cronogramas</h2>
          <p className="text-muted-foreground">
            Visualize relatórios, cronogramas e análises dos projetos
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button_1.Button variant="outline" onClick={function () { return exportToExcel(distribuicaoOrcamento, 'distribuicao_orcamento'); }}>
            <lucide_react_1.Download className="mr-2 h-4 w-4"/>
            Exportar Excel
          </button_1.Button>
          <button_1.Button onClick={generateREFP}>
            <lucide_react_1.FileText className="mr-2 h-4 w-4"/>
            Gerar REFP
          </button_1.Button>
        </div>
      </div>

      {/* Filtros */}
      <card_1.Card>
        <card_1.CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-full md:w-64">
              <select_1.Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecionar projeto"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="todos">Todos os Projetos</select_1.SelectItem>
                  {mockData_1.projetos.map(function (projeto) { return (<select_1.SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.titulo}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div className="w-full md:w-48">
              <select_1.Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Período"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="6m">Últimos 6 meses</select_1.SelectItem>
                  <select_1.SelectItem value="12m">Últimos 12 meses</select_1.SelectItem>
                  <select_1.SelectItem value="24m">Últimos 24 meses</select_1.SelectItem>
                  <select_1.SelectItem value="all">Todo o período</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      <tabs_1.Tabs defaultValue="cronograma" className="space-y-6">
        <tabs_1.TabsList className="grid w-full grid-cols-4">
          <tabs_1.TabsTrigger value="cronograma" className="flex items-center">
            <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
            Cronograma
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="financeiro" className="flex items-center">
            <lucide_react_1.DollarSign className="mr-2 h-4 w-4"/>
            Financeiro
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="evolucao" className="flex items-center">
            <lucide_react_1.TrendingUp className="mr-2 h-4 w-4"/>
            Evolução
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="dashboard" className="flex items-center">
            <lucide_react_1.BarChart3 className="mr-2 h-4 w-4"/>
            Dashboard
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="cronograma" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.Calendar className="mr-2 h-5 w-5"/>
                Cronograma Físico vs Financeiro
              </card_1.CardTitle>
              <card_1.CardDescription>
                {selectedProjeto !== 'todos' ?
            "Evolu\u00E7\u00E3o do projeto: ".concat((_a = mockData_1.projetos.find(function (p) { return p.id === selectedProjeto; })) === null || _a === void 0 ? void 0 : _a.titulo) :
            'Visão geral de todos os projetos'}
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <recharts_1.ResponsiveContainer width="100%" height={400}>
                <recharts_1.LineChart data={cronogramaData}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="mes"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip content={<CustomTooltip />}/>
                  <recharts_1.Line type="monotone" dataKey="planejado" stroke="#94a3b8" name="Planejado" strokeDasharray="5 5"/>
                  <recharts_1.Line type="monotone" dataKey="fisico" stroke="#22c55e" name="Físico" strokeWidth={2}/>
                  <recharts_1.Line type="monotone" dataKey="financeiro" stroke="#3b82f6" name="Financeiro" strokeWidth={2}/>
                </recharts_1.LineChart>
              </recharts_1.ResponsiveContainer>
            </card_1.CardContent>
          </card_1.Card>

          {/* Resumo do Cronograma */}
          <div className="grid gap-4 md:grid-cols-3">
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Projetos Ativos</p>
                    <p className="text-2xl font-bold">{mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).length}</p>
                  </div>
                  <lucide_react_1.Activity className="h-8 w-8 text-green-600"/>
                </div>
              </card_1.CardContent>
            </card_1.Card>
            
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Projetos Atrasados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {mockData_1.projetos.filter(function (p) { return p.percentualEvolucao < 50 && p.status === 'execucao'; }).length}
                    </p>
                  </div>
                  <lucide_react_1.Clock className="h-8 w-8 text-red-600"/>
                </div>
              </card_1.CardContent>
            </card_1.Card>
            
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Prazo Médio</p>
                    <p className="text-2xl font-bold">
                      {Math.round(mockData_1.projetos.reduce(function (acc, p) { return acc + p.duracao; }, 0) / mockData_1.projetos.length)} meses
                    </p>
                  </div>
                  <lucide_react_1.Target className="h-8 w-8 text-blue-600"/>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="financeiro" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.DollarSign className="mr-2 h-5 w-5"/>
                Distribuição de Orçamento por Projeto
              </card_1.CardTitle>
              <card_1.CardDescription>
                Comparação entre orçamento previsto e executado
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <recharts_1.ResponsiveContainer width="100%" height={400}>
                <recharts_1.BarChart data={distribuicaoOrcamento}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="nome"/>
                  <recharts_1.YAxis tickFormatter={function (value) { return formatCurrency(value); }}/>
                  <recharts_1.Tooltip content={<CustomTooltip />}/>
                  <recharts_1.Bar dataKey="orcamento" fill="#94a3b8" name="Orçamento"/>
                  <recharts_1.Bar dataKey="executado" fill="#22c55e" name="Executado"/>
                </recharts_1.BarChart>
              </recharts_1.ResponsiveContainer>
            </card_1.CardContent>
          </card_1.Card>

          {/* Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-4">
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Orçamento Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoTotalPrevisto; }, 0))}
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
            
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Executado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoExecutado; }, 0))}
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
            
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">% Execução</p>
                  <p className="text-2xl font-bold">
                    {((mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoExecutado; }, 0) /
            mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoTotalPrevisto; }, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
            
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(mockData_1.projetos.reduce(function (acc, p) { return acc + (p.custoTotalPrevisto - p.custoExecutado); }, 0))}
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="evolucao" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.TrendingUp className="mr-2 h-5 w-5"/>
                Evolução Mensal dos Projetos
              </card_1.CardTitle>
              <card_1.CardDescription>
                Acompanhamento da evolução ao longo do tempo
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <recharts_1.ResponsiveContainer width="100%" height={400}>
                <recharts_1.AreaChart data={evolucaoMensal}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="mes"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip content={<CustomTooltip />}/>
                  <recharts_1.Area type="monotone" dataKey="projetos" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Projetos Ativos"/>
                  <recharts_1.Line type="monotone" dataKey="meta" stroke="#ef4444" strokeDasharray="5 5" name="Meta"/>
                </recharts_1.AreaChart>
              </recharts_1.ResponsiveContainer>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.TrendingUp className="mr-2 h-5 w-5"/>
                Custos Mensais
              </card_1.CardTitle>
              <card_1.CardDescription>
                Evolução dos custos ao longo do tempo
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <recharts_1.ResponsiveContainer width="100%" height={300}>
                <recharts_1.AreaChart data={evolucaoMensal}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="mes"/>
                  <recharts_1.YAxis tickFormatter={function (value) { return formatCurrency(value); }}/>
                  <recharts_1.Tooltip content={<CustomTooltip />}/>
                  <recharts_1.Area type="monotone" dataKey="custo" stroke="#22c55e" fill="#22c55e" name="Custo Mensal"/>
                </recharts_1.AreaChart>
              </recharts_1.ResponsiveContainer>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center">
                  <lucide_react_1.PieChart className="mr-2 h-5 w-5"/>
                  Distribuição por Status
                </card_1.CardTitle>
                <card_1.CardDescription>
                  Quantidade de projetos por status
                </card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <recharts_1.ResponsiveContainer width="100%" height={300}>
                  <recharts_1.PieChart>
                    <recharts_1.Pie data={statusDistribution} cx="50%" cy="50%" labelLine={false} label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, " ").concat((percent * 100).toFixed(0), "%");
    }} outerRadius={80} fill="#8884d8" dataKey="value">
                      {statusDistribution.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
                    </recharts_1.Pie>
                    <recharts_1.Tooltip />
                  </recharts_1.PieChart>
                </recharts_1.ResponsiveContainer>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Projetos por Prioridade</card_1.CardTitle>
                <card_1.CardDescription>
                  Classificação dos projetos ativos
                </card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                {['alta', 'media', 'baixa'].map(function (prioridade) {
            var count = mockData_1.projetos.filter(function (p) { return p.prioridade === prioridade && p.status === 'execucao'; }).length;
            var total = mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).length;
            var percentage = total > 0 ? (count / total) * 100 : 0;
            return (<div key={prioridade} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{prioridade}</span>
                        <span>{count} projetos ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className={"h-2 rounded-full ".concat(prioridade === 'alta' ? 'bg-red-500' :
                    prioridade === 'media' ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: "".concat(percentage, "%") }}></div>
                      </div>
                    </div>);
        })}
              </card_1.CardContent>
            </card_1.Card>
          </div>

          {/* Lista de Projetos com Status */}
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Status Detalhado dos Projetos</card_1.CardTitle>
              <card_1.CardDescription>
                Visão consolidada de todos os projetos
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4">
                {mockData_1.projetos.map(function (projeto) { return (<div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <badge_1.Badge variant={projeto.status === 'execucao' ? 'default' :
                projeto.status === 'planejamento' ? 'secondary' :
                    projeto.status === 'encerrado' ? 'outline' : 'destructive'}>
                        {projeto.status}
                      </badge_1.Badge>
                    </div>
                  </div>); })}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
