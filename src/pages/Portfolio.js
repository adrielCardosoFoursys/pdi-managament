"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = Portfolio;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
function Portfolio() {
    var _a = (0, react_1.useState)('cards'), viewMode = _a[0], setViewMode = _a[1];
    var formatCurrency = function (value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    var getPriorityColor = function (prioridade) {
        switch (prioridade) {
            case 'alta': return 'destructive';
            case 'media': return 'default';
            case 'baixa': return 'secondary';
            default: return 'default';
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'execucao': return 'bg-green-500';
            case 'planejamento': return 'bg-yellow-500';
            case 'encerrado': return 'bg-blue-500';
            case 'cancelado': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    var CardView = function () { return (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockData_1.projetos.map(function (projeto) { return (<card_1.Card key={projeto.id} className="hover:shadow-lg transition-shadow">
          <card_1.CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <card_1.CardTitle className="text-lg leading-tight mb-2">
                  {projeto.titulo}
                </card_1.CardTitle>
                <card_1.CardDescription className="text-sm">
                  {projeto.codigoANEEL}
                </card_1.CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <badge_1.Badge variant={getPriorityColor(projeto.prioridade)}>
                  {projeto.prioridade}
                </badge_1.Badge>
                <div className={"h-3 w-3 rounded-full ".concat(getStatusColor(projeto.status))}></div>
              </div>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <lucide_react_1.User className="mr-2 h-4 w-4"/>
              {projeto.principalResponsavel}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
                {(0, date_fns_1.format)(projeto.dataInicio, 'MMM yyyy', { locale: locale_1.ptBR })} - {(0, date_fns_1.format)(projeto.dataFim, 'MMM yyyy', { locale: locale_1.ptBR })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Evolução</span>
                <span className="font-medium">{projeto.percentualEvolucao}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: "".concat(projeto.percentualEvolucao, "%") }}></div>
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
          </card_1.CardContent>
        </card_1.Card>); })}
    </div>); };
    var ListView = function () { return (<div className="space-y-4">
      {mockData_1.projetos.map(function (projeto) { return (<card_1.Card key={projeto.id} className="hover:shadow-md transition-shadow">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className={"h-3 w-3 rounded-full ".concat(getStatusColor(projeto.status))}></div>
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
                
                <badge_1.Badge variant={getPriorityColor(projeto.prioridade)}>
                  {projeto.prioridade}
                </badge_1.Badge>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>); })}
    </div>); };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfólio de Projetos</h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os projetos de PDI
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button_1.Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={function () { return setViewMode('list'); }}>
            <lucide_react_1.List className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button variant={viewMode === 'cards' ? 'default' : 'outline'} size="sm" onClick={function () { return setViewMode('cards'); }}>
            <lucide_react_1.Grid3X3 className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button>
            <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
            Novo Projeto
          </button_1.Button>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total de Projetos</p>
                <p className="text-2xl font-bold">{mockData_1.projetos.length}</p>
              </div>
              <lucide_react_1.TrendingUp className="h-8 w-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Em Execução</p>
                <p className="text-2xl font-bold">{mockData_1.projetos.filter(function (p) { return p.status === 'execucao'; }).length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500"></div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoTotalPrevisto; }, 0))}
                </p>
              </div>
              <lucide_react_1.DollarSign className="h-8 w-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Executado</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(mockData_1.projetos.reduce(function (acc, p) { return acc + p.custoExecutado; }, 0))}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500"></div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Lista/Cards de Projetos */}
      {viewMode === 'cards' ? <CardView /> : <ListView />}
    </div>);
}
