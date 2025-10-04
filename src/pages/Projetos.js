"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projetos = Projetos;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var ProjetoForm_1 = require("@/components/forms/ProjetoForm");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
function Projetos() {
    var _a = (0, react_1.useState)(mockData_1.projetos), projetos = _a[0], setProjetos = _a[1];
    var _b = (0, react_1.useState)(null), selectedProjeto = _b[0], setSelectedProjeto = _b[1];
    var _c = (0, react_1.useState)(false), isFormOpen = _c[0], setIsFormOpen = _c[1];
    var _d = (0, react_1.useState)(false), isViewOpen = _d[0], setIsViewOpen = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('todos'), statusFilter = _f[0], setStatusFilter = _f[1];
    var filteredProjetos = projetos.filter(function (projeto) {
        var matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            projeto.codigoANEEL.toLowerCase().includes(searchTerm.toLowerCase()) ||
            projeto.principalResponsavel.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesStatus = statusFilter === 'todos' || projeto.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    var handleCreateProjeto = function (data) {
        var newProjeto = __assign(__assign({}, data), { id: Date.now().toString(), tenantId: '1', createdAt: new Date(), updatedAt: new Date() });
        setProjetos(__spreadArray([newProjeto], projetos, true));
        setIsFormOpen(false);
    };
    var handleUpdateProjeto = function (data) {
        if (!selectedProjeto)
            return;
        var updatedProjeto = __assign(__assign(__assign({}, selectedProjeto), data), { updatedAt: new Date() });
        setProjetos(projetos.map(function (p) { return p.id === selectedProjeto.id ? updatedProjeto : p; }));
        setSelectedProjeto(null);
        setIsFormOpen(false);
    };
    var handleDeleteProjeto = function (id) {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            setProjetos(projetos.filter(function (p) { return p.id !== id; }));
        }
    };
    var formatCurrency = function (value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'execucao': return 'default';
            case 'planejamento': return 'secondary';
            case 'encerrado': return 'outline';
            case 'cancelado': return 'destructive';
            default: return 'default';
        }
    };
    var getPriorityColor = function (prioridade) {
        switch (prioridade) {
            case 'alta': return 'destructive';
            case 'media': return 'default';
            case 'baixa': return 'secondary';
            default: return 'default';
        }
    };
    var getStatusLabel = function (status) {
        switch (status) {
            case 'planejamento': return 'Planejamento';
            case 'execucao': return 'Execução';
            case 'encerrado': return 'Encerrado';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };
    var ProjetoCard = function (_a) {
        var projeto = _a.projeto;
        return (<card_1.Card className="hover:shadow-lg transition-shadow">
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
            <badge_1.Badge variant={getStatusColor(projeto.status)}>
              {getStatusLabel(projeto.status)}
            </badge_1.Badge>
            <badge_1.Badge variant={getPriorityColor(projeto.prioridade)}>
              {projeto.prioridade}
            </badge_1.Badge>
          </div>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <lucide_react_1.Users className="mr-2 h-4 w-4"/>
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

        <div className="flex justify-end space-x-2 pt-2">
          <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedProjeto(projeto);
                setIsViewOpen(true);
            }}>
            <lucide_react_1.Eye className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedProjeto(projeto);
                setIsFormOpen(true);
            }}>
            <lucide_react_1.Edit className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleDeleteProjeto(projeto.id); }}>
            <lucide_react_1.Trash2 className="h-4 w-4"/>
          </button_1.Button>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
    };
    var ProjetoDetalhes = function (_a) {
        var projeto = _a.projeto;
        return (<div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Código ANEEL</h4>
          <p>{projeto.codigoANEEL}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
          <badge_1.Badge variant={getStatusColor(projeto.status)}>
            {getStatusLabel(projeto.status)}
          </badge_1.Badge>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Escopo</h4>
        <p className="text-sm">{projeto.escopo}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Data de Início</h4>
          <p>{(0, date_fns_1.format)(projeto.dataInicio, 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Data de Fim</h4>
          <p>{(0, date_fns_1.format)(projeto.dataFim, 'dd/MM/yyyy')}</p>
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
          <badge_1.Badge variant={getPriorityColor(projeto.prioridade)}>
            {projeto.prioridade}
          </badge_1.Badge>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Produtos</h4>
        <div className="flex flex-wrap gap-2">
          {projeto.produtos.map(function (produto, index) { return (<badge_1.Badge key={index} variant="outline">
              {produto}
            </badge_1.Badge>); })}
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
    </div>);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Projetos</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie todos os projetos de PDI
          </p>
        </div>
        
        <dialog_1.Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return setSelectedProjeto(null); }}>
              <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
              Novo Projeto
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>
                {selectedProjeto ? 'Editar Projeto' : 'Novo Projeto'}
              </dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            <ProjetoForm_1.ProjetoForm projeto={selectedProjeto ? {
            titulo: selectedProjeto.titulo,
            codigoANEEL: selectedProjeto.codigoANEEL,
            faseInovacaoId: selectedProjeto.faseInovacaoId,
            segmentoId: selectedProjeto.segmentoId,
            temaId: selectedProjeto.temaId,
            tipoProdutoId: selectedProjeto.tipoProdutoId,
            subtemaId: selectedProjeto.subtemaId,
            temaEstrategicoId: selectedProjeto.temaEstrategicoId,
            dataInicio: selectedProjeto.dataInicio,
            dataFim: selectedProjeto.dataFim,
            dataEncerramentoReal: selectedProjeto.dataEncerramentoReal,
            duracao: selectedProjeto.duracao,
            prorrogacao: selectedProjeto.prorrogacao,
            escopo: selectedProjeto.escopo,
            produtos: selectedProjeto.produtos,
            status: selectedProjeto.status,
            prioridade: selectedProjeto.prioridade,
            percentualEvolucao: selectedProjeto.percentualEvolucao,
            custoTotalPrevisto: selectedProjeto.custoTotalPrevisto,
            custoExecutado: selectedProjeto.custoExecutado,
            custoPrevisto: selectedProjeto.custoPrevisto,
            principalResponsavel: selectedProjeto.principalResponsavel,
        } : undefined} onSubmit={selectedProjeto ? handleUpdateProjeto : handleCreateProjeto} onCancel={function () {
            setIsFormOpen(false);
            setSelectedProjeto(null);
        }} isEditing={!!selectedProjeto}/>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>

      {/* Filtros e Busca */}
      <card_1.Card>
        <card_1.CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <input type="search" placeholder="Pesquisar projetos..." className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
            </div>
            <div className="flex gap-2">
              <button_1.Button variant={statusFilter === 'todos' ? 'default' : 'outline'} size="sm" onClick={function () { return setStatusFilter('todos'); }}>
                Todos
              </button_1.Button>
              <button_1.Button variant={statusFilter === 'planejamento' ? 'default' : 'outline'} size="sm" onClick={function () { return setStatusFilter('planejamento'); }}>
                Planejamento
              </button_1.Button>
              <button_1.Button variant={statusFilter === 'execucao' ? 'default' : 'outline'} size="sm" onClick={function () { return setStatusFilter('execucao'); }}>
                Execução
              </button_1.Button>
              <button_1.Button variant={statusFilter === 'encerrado' ? 'default' : 'outline'} size="sm" onClick={function () { return setStatusFilter('encerrado'); }}>
                Encerrado
              </button_1.Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProjetos.length} projeto(s) encontrado(s)
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{projetos.length}</p>
              </div>
              <lucide_react_1.FileText className="h-8 w-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Em Execução</p>
                <p className="text-2xl font-bold">{projetos.filter(function (p) { return p.status === 'execucao'; }).length}</p>
              </div>
              <lucide_react_1.TrendingUp className="h-8 w-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Investimento</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(projetos.reduce(function (acc, p) { return acc + p.custoTotalPrevisto; }, 0))}
                </p>
              </div>
              <lucide_react_1.DollarSign className="h-8 w-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Alertas</p>
                <p className="text-2xl font-bold">
                  {projetos.filter(function (p) { return p.percentualEvolucao < 50 && p.status === 'execucao'; }).length}
                </p>
              </div>
              <lucide_react_1.AlertTriangle className="h-8 w-8 text-orange-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Lista de Projetos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjetos.map(function (projeto) { return (<ProjetoCard key={projeto.id} projeto={projeto}/>); })}
      </div>

      {filteredProjetos.length === 0 && (<card_1.Card>
          <card_1.CardContent className="p-12 text-center">
            <lucide_react_1.FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando seu primeiro projeto.'}
            </p>
            {!searchTerm && statusFilter === 'todos' && (<button_1.Button onClick={function () { return setIsFormOpen(true); }}>
                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                Criar Primeiro Projeto
              </button_1.Button>)}
          </card_1.CardContent>
        </card_1.Card>)}

      {/* Modal de Visualização */}
      <dialog_1.Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {selectedProjeto === null || selectedProjeto === void 0 ? void 0 : selectedProjeto.titulo}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          {selectedProjeto && <ProjetoDetalhes projeto={selectedProjeto}/>}
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
