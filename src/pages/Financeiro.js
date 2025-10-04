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
exports.Financeiro = Financeiro;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var tabs_1 = require("@/components/ui/tabs");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var mockAcompanhamento = [
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
var mockDespesas = [
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
function Financeiro() {
    var _a = (0, react_1.useState)(mockAcompanhamento), acompanhamentos = _a[0], setAcompanhamentos = _a[1];
    var _b = (0, react_1.useState)(mockDespesas), despesas = _b[0], setDespesas = _b[1];
    var _c = (0, react_1.useState)('todos'), selectedProjeto = _c[0], setSelectedProjeto = _c[1];
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)(false), isAcompanhamentoFormOpen = _e[0], setIsAcompanhamentoFormOpen = _e[1];
    var _f = (0, react_1.useState)(false), isDespesaFormOpen = _f[0], setIsDespesaFormOpen = _f[1];
    var _g = (0, react_1.useState)(null), selectedAcompanhamento = _g[0], setSelectedAcompanhamento = _g[1];
    var _h = (0, react_1.useState)(null), selectedDespesa = _h[0], setSelectedDespesa = _h[1];
    // Form states
    var _j = (0, react_1.useState)({
        projetoId: '',
        financiadora: '',
        executora: '',
        rubricaId: '',
        mes: '',
        valorPrevisto: 0,
        valorRealizado: 0
    }), acompanhamentoForm = _j[0], setAcompanhamentoForm = _j[1];
    var _k = (0, react_1.useState)({
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
    }), despesaForm = _k[0], setDespesaForm = _k[1];
    var formatCurrency = function (value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };
    var formatCNPJ = function (cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'aprovada': return 'default';
            case 'pendente': return 'secondary';
            case 'rejeitada': return 'destructive';
            default: return 'outline';
        }
    };
    var getStatusLabel = function (status) {
        switch (status) {
            case 'aprovada': return 'Aprovada';
            case 'pendente': return 'Pendente';
            case 'rejeitada': return 'Rejeitada';
            default: return status;
        }
    };
    var filteredAcompanhamentos = acompanhamentos.filter(function (acomp) {
        var projeto = mockData_1.projetos.find(function (p) { return p.id === acomp.projetoId; });
        var matchesSearch = (projeto === null || projeto === void 0 ? void 0 : projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            acomp.financiadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acomp.executora.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesProjeto = selectedProjeto === 'todos' || acomp.projetoId === selectedProjeto;
        return matchesSearch && matchesProjeto;
    });
    var filteredDespesas = despesas.filter(function (despesa) {
        var projeto = mockData_1.projetos.find(function (p) { return p.id === despesa.projetoId; });
        var matchesSearch = (projeto === null || projeto === void 0 ? void 0 : projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            despesa.favorecido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            despesa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            despesa.numeroNotaFiscal.includes(searchTerm);
        var matchesProjeto = selectedProjeto === 'todos' || despesa.projetoId === selectedProjeto;
        return matchesSearch && matchesProjeto;
    });
    var handleCreateAcompanhamento = function () {
        var newAcompanhamento = __assign(__assign({}, acompanhamentoForm), { id: Date.now().toString() });
        setAcompanhamentos(__spreadArray(__spreadArray([], acompanhamentos, true), [newAcompanhamento], false));
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
    var handleCreateDespesa = function () {
        var newDespesa = __assign(__assign({}, despesaForm), { id: Date.now().toString(), status: 'pendente' });
        setDespesas(__spreadArray(__spreadArray([], despesas, true), [newDespesa], false));
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
    var handleDeleteAcompanhamento = function (id) {
        if (confirm('Tem certeza que deseja excluir este acompanhamento?')) {
            setAcompanhamentos(acompanhamentos.filter(function (a) { return a.id !== id; }));
        }
    };
    var handleDeleteDespesa = function (id) {
        if (confirm('Tem certeza que deseja excluir esta despesa?')) {
            setDespesas(despesas.filter(function (d) { return d.id !== id; }));
        }
    };
    var handleApprovarDespesa = function (id) {
        setDespesas(despesas.map(function (d) {
            return d.id === id ? __assign(__assign({}, d), { status: 'aprovada' }) : d;
        }));
    };
    var handleRejeitarDespesa = function (id) {
        setDespesas(despesas.map(function (d) {
            return d.id === id ? __assign(__assign({}, d), { status: 'rejeitada' }) : d;
        }));
    };
    // Cálculos de resumo
    var totalPrevisto = filteredAcompanhamentos.reduce(function (acc, a) { return acc + a.valorPrevisto; }, 0);
    var totalRealizado = filteredAcompanhamentos.reduce(function (acc, a) { return acc + a.valorRealizado; }, 0);
    var desvio = totalRealizado - totalPrevisto;
    var percentualExecucao = totalPrevisto > 0 ? (totalRealizado / totalPrevisto) * 100 : 0;
    var AcompanhamentoCard = function (_a) {
        var acompanhamento = _a.acompanhamento;
        var projeto = mockData_1.projetos.find(function (p) { return p.id === acompanhamento.projetoId; });
        var rubrica = mockData_1.rubricasFinanceiras.find(function (r) { return r.id === acompanhamento.rubricaId; });
        var desvioItem = acompanhamento.valorRealizado - acompanhamento.valorPrevisto;
        var percentualItem = acompanhamento.valorPrevisto > 0 ?
            (acompanhamento.valorRealizado / acompanhamento.valorPrevisto) * 100 : 0;
        return (<card_1.Card className="hover:shadow-lg transition-shadow">
        <card_1.CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <card_1.CardTitle className="text-lg leading-tight mb-1">
                {(projeto === null || projeto === void 0 ? void 0 : projeto.titulo) || 'Projeto não encontrado'}
              </card_1.CardTitle>
              <card_1.CardDescription className="text-sm">
                {rubrica === null || rubrica === void 0 ? void 0 : rubrica.sigla} - {rubrica === null || rubrica === void 0 ? void 0 : rubrica.descricao}
              </card_1.CardDescription>
            </div>
            <badge_1.Badge variant={desvioItem >= 0 ? 'default' : 'destructive'}>
              {percentualItem.toFixed(1)}%
            </badge_1.Badge>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Financiadora:</strong> {acompanhamento.financiadora}</p>
            <p><strong>Executora:</strong> {acompanhamento.executora}</p>
            <p><strong>Período:</strong> {(0, date_fns_1.format)(new Date(acompanhamento.mes), 'MMM/yyyy', { locale: locale_1.ptBR })}</p>
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
              <span className={"font-medium ".concat(desvioItem >= 0 ? 'text-green-600' : 'text-red-600')}>
                {desvioItem >= 0 ? '+' : ''}{formatCurrency(desvioItem)}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedAcompanhamento(acompanhamento);
                setAcompanhamentoForm(acompanhamento);
                setIsAcompanhamentoFormOpen(true);
            }}>
              <lucide_react_1.Edit className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleDeleteAcompanhamento(acompanhamento.id); }}>
              <lucide_react_1.Trash2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    };
    var DespesaCard = function (_a) {
        var despesa = _a.despesa;
        var projeto = mockData_1.projetos.find(function (p) { return p.id === despesa.projetoId; });
        var rubrica = mockData_1.rubricasFinanceiras.find(function (r) { return r.id === despesa.rubricaId; });
        return (<card_1.Card className="hover:shadow-lg transition-shadow">
        <card_1.CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <card_1.CardTitle className="text-lg leading-tight mb-1">
                {despesa.descricao}
              </card_1.CardTitle>
              <card_1.CardDescription className="text-sm">
                NF: {despesa.numeroNotaFiscal} • {despesa.favorecido}
              </card_1.CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <badge_1.Badge variant={getStatusColor(despesa.status)}>
                {getStatusLabel(despesa.status)}
              </badge_1.Badge>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(despesa.valor)}
              </div>
            </div>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Projeto:</strong> {projeto === null || projeto === void 0 ? void 0 : projeto.titulo}</p>
            <p><strong>Rubrica:</strong> {rubrica === null || rubrica === void 0 ? void 0 : rubrica.sigla} - {rubrica === null || rubrica === void 0 ? void 0 : rubrica.descricao}</p>
            <p><strong>Data:</strong> {(0, date_fns_1.format)(new Date(despesa.dataDespesa), 'dd/MM/yyyy')}</p>
            <p><strong>CNPJ:</strong> {formatCNPJ(despesa.cnpj)}</p>
            <p><strong>Tipo:</strong> {despesa.tipoComprovante}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm"><strong>Justificativa:</strong></p>
            <p className="text-sm text-muted-foreground">{despesa.justificativa}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-2">
              {despesa.status === 'pendente' && (<>
                  <button_1.Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={function () { return handleApprovarDespesa(despesa.id); }}>
                    Aprovar
                  </button_1.Button>
                  <button_1.Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleRejeitarDespesa(despesa.id); }}>
                    Rejeitar
                  </button_1.Button>
                </>)}
            </div>
            <div className="flex space-x-2">
              <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedDespesa(despesa);
                setDespesaForm(despesa);
                setIsDespesaFormOpen(true);
            }}>
                <lucide_react_1.Edit className="h-4 w-4"/>
              </button_1.Button>
              <button_1.Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleDeleteDespesa(despesa.id); }}>
                <lucide_react_1.Trash2 className="h-4 w-4"/>
              </button_1.Button>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Acompanhamento Financeiro</h2>
          <p className="text-muted-foreground">
            Gerencie o acompanhamento financeiro e despesas dos projetos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <card_1.Card>
        <card_1.CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <input_1.Input placeholder="Pesquisar..." className="pl-10" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
            </div>
            <div className="w-full md:w-64">
              <select_1.Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Filtrar por projeto"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="todos">Todos os Projetos</select_1.SelectItem>
                  {mockData_1.projetos.map(function (projeto) { return (<select_1.SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.titulo}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-4">
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Previsto</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrevisto)}</p>
              </div>
              <lucide_react_1.TrendingUp className="h-8 w-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Realizado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRealizado)}</p>
              </div>
              <lucide_react_1.DollarSign className="h-8 w-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Desvio</p>
                <p className={"text-2xl font-bold ".concat(desvio >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {desvio >= 0 ? '+' : ''}{formatCurrency(desvio)}
                </p>
              </div>
              {desvio >= 0 ?
            <lucide_react_1.TrendingUp className="h-8 w-8 text-green-600"/> :
            <lucide_react_1.TrendingDown className="h-8 w-8 text-red-600"/>}
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="p-6">
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
          </card_1.CardContent>
        </card_1.Card>
      </div>

      <tabs_1.Tabs defaultValue="acompanhamento" className="space-y-6">
        <tabs_1.TabsList className="grid w-full grid-cols-2">
          <tabs_1.TabsTrigger value="acompanhamento" className="flex items-center">
            <lucide_react_1.TrendingUp className="mr-2 h-4 w-4"/>
            Acompanhamento ({filteredAcompanhamentos.length})
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="despesas" className="flex items-center">
            <lucide_react_1.Receipt className="mr-2 h-4 w-4"/>
            Despesas ({filteredDespesas.length})
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="acompanhamento" className="space-y-6">
          <div className="flex justify-end">
            <dialog_1.Dialog open={isAcompanhamentoFormOpen} onOpenChange={setIsAcompanhamentoFormOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button onClick={function () { return setSelectedAcompanhamento(null); }}>
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Novo Acompanhamento
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="max-w-2xl">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle>
                    {selectedAcompanhamento ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}
                  </dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label_1.Label>Projeto *</label_1.Label>
                    <select_1.Select value={acompanhamentoForm.projetoId} onValueChange={function (value) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { projetoId: value })); }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Selecione o projeto"/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {mockData_1.projetos.map(function (projeto) { return (<select_1.SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.titulo}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="financiadora">Financiadora *</label_1.Label>
                      <input_1.Input id="financiadora" value={acompanhamentoForm.financiadora} onChange={function (e) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { financiadora: e.target.value })); }} placeholder="Nome da financiadora"/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="executora">Executora *</label_1.Label>
                      <input_1.Input id="executora" value={acompanhamentoForm.executora} onChange={function (e) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { executora: e.target.value })); }} placeholder="Nome da executora"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label>Rubrica *</label_1.Label>
                      <select_1.Select value={acompanhamentoForm.rubricaId} onValueChange={function (value) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { rubricaId: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione a rubrica"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.rubricasFinanceiras.map(function (rubrica) { return (<select_1.SelectItem key={rubrica.id} value={rubrica.id}>
                              {rubrica.sigla} - {rubrica.descricao}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="mes">Mês/Ano *</label_1.Label>
                      <input_1.Input id="mes" type="month" value={acompanhamentoForm.mes} onChange={function (e) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { mes: e.target.value })); }}/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="valorPrevisto">Valor Previsto (R$) *</label_1.Label>
                      <input_1.Input id="valorPrevisto" type="number" step="0.01" value={acompanhamentoForm.valorPrevisto} onChange={function (e) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { valorPrevisto: parseFloat(e.target.value) || 0 })); }} placeholder="0.00"/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="valorRealizado">Valor Realizado (R$) *</label_1.Label>
                      <input_1.Input id="valorRealizado" type="number" step="0.01" value={acompanhamentoForm.valorRealizado} onChange={function (e) { return setAcompanhamentoForm(__assign(__assign({}, acompanhamentoForm), { valorRealizado: parseFloat(e.target.value) || 0 })); }} placeholder="0.00"/>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button_1.Button variant="outline" onClick={function () { return setIsAcompanhamentoFormOpen(false); }}>
                      Cancelar
                    </button_1.Button>
                    <button_1.Button onClick={handleCreateAcompanhamento}>
                      {selectedAcompanhamento ? 'Atualizar' : 'Salvar'}
                    </button_1.Button>
                  </div>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAcompanhamentos.map(function (acompanhamento) { return (<AcompanhamentoCard key={acompanhamento.id} acompanhamento={acompanhamento}/>); })}
          </div>

          {filteredAcompanhamentos.length === 0 && (<card_1.Card>
              <card_1.CardContent className="p-12 text-center">
                <lucide_react_1.TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Nenhum acompanhamento encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando o primeiro acompanhamento financeiro.'}
                </p>
              </card_1.CardContent>
            </card_1.Card>)}
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="despesas" className="space-y-6">
          <div className="flex justify-end">
            <dialog_1.Dialog open={isDespesaFormOpen} onOpenChange={setIsDespesaFormOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button onClick={function () { return setSelectedDespesa(null); }}>
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Nova Despesa
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle>
                    {selectedDespesa ? 'Editar Despesa' : 'Nova Despesa'}
                  </dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label_1.Label>Projeto *</label_1.Label>
                    <select_1.Select value={despesaForm.projetoId} onValueChange={function (value) { return setDespesaForm(__assign(__assign({}, despesaForm), { projetoId: value })); }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Selecione o projeto"/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {mockData_1.projetos.map(function (projeto) { return (<select_1.SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.titulo}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="dataDespesa">Data da Despesa *</label_1.Label>
                      <input_1.Input id="dataDespesa" type="date" value={despesaForm.dataDespesa} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { dataDespesa: e.target.value })); }}/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="numeroNotaFiscal">Número NF *</label_1.Label>
                      <input_1.Input id="numeroNotaFiscal" value={despesaForm.numeroNotaFiscal} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { numeroNotaFiscal: e.target.value })); }} placeholder="12345"/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label>Tipo Comprovante *</label_1.Label>
                      <select_1.Select value={despesaForm.tipoComprovante} onValueChange={function (value) { return setDespesaForm(__assign(__assign({}, despesaForm), { tipoComprovante: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.tiposComprovante.map(function (tipo) { return (<select_1.SelectItem key={tipo.value} value={tipo.label}>
                              {tipo.label}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="favorecido">Favorecido *</label_1.Label>
                      <input_1.Input id="favorecido" value={despesaForm.favorecido} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { favorecido: e.target.value })); }} placeholder="Nome do favorecido"/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="cnpj">CNPJ *</label_1.Label>
                      <input_1.Input id="cnpj" value={despesaForm.cnpj} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { cnpj: e.target.value })); }} placeholder="00.000.000/0000-00"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label>Rubrica *</label_1.Label>
                      <select_1.Select value={despesaForm.rubricaId} onValueChange={function (value) { return setDespesaForm(__assign(__assign({}, despesaForm), { rubricaId: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione a rubrica"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.rubricasFinanceiras.map(function (rubrica) { return (<select_1.SelectItem key={rubrica.id} value={rubrica.id}>
                              {rubrica.sigla} - {rubrica.descricao}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="valor">Valor (R$) *</label_1.Label>
                      <input_1.Input id="valor" type="number" step="0.01" value={despesaForm.valor} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { valor: parseFloat(e.target.value) || 0 })); }} placeholder="0.00"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="descricao">Descrição *</label_1.Label>
                    <input_1.Input id="descricao" value={despesaForm.descricao} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { descricao: e.target.value })); }} placeholder="Descrição da despesa"/>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="justificativa">Justificativa *</label_1.Label>
                    <textarea_1.Textarea id="justificativa" value={despesaForm.justificativa} onChange={function (e) { return setDespesaForm(__assign(__assign({}, despesaForm), { justificativa: e.target.value })); }} placeholder="Justificativa para a despesa..." rows={3}/>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button_1.Button variant="outline" onClick={function () { return setIsDespesaFormOpen(false); }}>
                      Cancelar
                    </button_1.Button>
                    <button_1.Button onClick={handleCreateDespesa}>
                      {selectedDespesa ? 'Atualizar' : 'Salvar'}
                    </button_1.Button>
                  </div>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDespesas.map(function (despesa) { return (<DespesaCard key={despesa.id} despesa={despesa}/>); })}
          </div>

          {filteredDespesas.length === 0 && (<card_1.Card>
              <card_1.CardContent className="p-12 text-center">
                <lucide_react_1.Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Nenhuma despesa encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando a primeira despesa.'}
                </p>
              </card_1.CardContent>
            </card_1.Card>)}
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
