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
exports.EntidadesEquipe = EntidadesEquipe;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var tabs_1 = require("@/components/ui/tabs");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
function EntidadesEquipe() {
    var _a = (0, react_1.useState)(mockData_1.entidades), entidades = _a[0], setEntidades = _a[1];
    var _b = (0, react_1.useState)(mockData_1.membrosEquipe), membros = _b[0], setMembros = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('todos'), selectedProjeto = _d[0], setSelectedProjeto = _d[1];
    var _e = (0, react_1.useState)(false), isEntidadeFormOpen = _e[0], setIsEntidadeFormOpen = _e[1];
    var _f = (0, react_1.useState)(false), isMembroFormOpen = _f[0], setIsMembroFormOpen = _f[1];
    var _g = (0, react_1.useState)(null), selectedEntidade = _g[0], setSelectedEntidade = _g[1];
    var _h = (0, react_1.useState)(null), selectedMembro = _h[0], setSelectedMembro = _h[1];
    // Estados do formulário de entidade
    var _j = (0, react_1.useState)({
        papel: '',
        nome: '',
        sigla: '',
        cnpj: '',
        municipio: '',
        estado: '',
        regiao: ''
    }), entidadeForm = _j[0], setEntidadeForm = _j[1];
    // Estados do formulário de membro
    var _k = (0, react_1.useState)({
        nome: '',
        ddd: '',
        telefone: '',
        email: '',
        tipoDocumento: 'cpf',
        documento: '',
        titulacaoId: '',
        funcaoId: '',
        entidadeVinculada: '',
        dataInicio: '',
        dataFim: '',
        curriculoLattes: ''
    }), membroForm = _k[0], setMembroForm = _k[1];
    var filteredEntidades = entidades.filter(function (entidade) {
        var matchesSearch = entidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entidade.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entidade.cnpj.includes(searchTerm);
        var matchesProjeto = selectedProjeto === 'todos' || entidade.projetoId === selectedProjeto;
        return matchesSearch && matchesProjeto;
    });
    var filteredMembros = membros.filter(function (membro) {
        var matchesSearch = membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            membro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            membro.documento.includes(searchTerm);
        var matchesProjeto = selectedProjeto === 'todos' || membro.projetoId === selectedProjeto;
        return matchesSearch && matchesProjeto;
    });
    var handleCreateEntidade = function () {
        var _a;
        var newEntidade = __assign(__assign({ id: Date.now().toString(), projetoId: selectedProjeto === 'todos' ? mockData_1.projetos[0].id : selectedProjeto }, entidadeForm), { regiao: ((_a = mockData_1.estados.find(function (e) { return e.sigla === entidadeForm.estado; })) === null || _a === void 0 ? void 0 : _a.regiao) || '' });
        setEntidades(__spreadArray(__spreadArray([], entidades, true), [newEntidade], false));
        setEntidadeForm({
            papel: '',
            nome: '',
            sigla: '',
            cnpj: '',
            municipio: '',
            estado: '',
            regiao: ''
        });
        setIsEntidadeFormOpen(false);
    };
    var handleCreateMembro = function () {
        var newMembro = __assign(__assign({ id: Date.now().toString(), projetoId: selectedProjeto === 'todos' ? mockData_1.projetos[0].id : selectedProjeto }, membroForm), { dataInicio: new Date(membroForm.dataInicio), dataFim: membroForm.dataFim ? new Date(membroForm.dataFim) : undefined });
        setMembros(__spreadArray(__spreadArray([], membros, true), [newMembro], false));
        setMembroForm({
            nome: '',
            ddd: '',
            telefone: '',
            email: '',
            tipoDocumento: 'cpf',
            documento: '',
            titulacaoId: '',
            funcaoId: '',
            entidadeVinculada: '',
            dataInicio: '',
            dataFim: '',
            curriculoLattes: ''
        });
        setIsMembroFormOpen(false);
    };
    var handleDeleteEntidade = function (id) {
        if (confirm('Tem certeza que deseja excluir esta entidade?')) {
            setEntidades(entidades.filter(function (e) { return e.id !== id; }));
        }
    };
    var handleDeleteMembro = function (id) {
        if (confirm('Tem certeza que deseja excluir este membro?')) {
            setMembros(membros.filter(function (m) { return m.id !== id; }));
        }
    };
    var formatCNPJ = function (cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };
    var formatCPF = function (cpf) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };
    var formatTelefone = function (ddd, telefone) {
        var tel = telefone.replace(/^(\d{5})(\d{4})/, '$1-$2');
        return "(".concat(ddd, ") ").concat(tel);
    };
    var EntidadeCard = function (_a) {
        var entidade = _a.entidade;
        var projeto = mockData_1.projetos.find(function (p) { return p.id === entidade.projetoId; });
        return (<card_1.Card className="hover:shadow-lg transition-shadow">
        <card_1.CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <card_1.CardTitle className="text-lg leading-tight mb-1">
                {entidade.nome}
              </card_1.CardTitle>
              <card_1.CardDescription className="text-sm">
                {entidade.sigla} • {formatCNPJ(entidade.cnpj)}
              </card_1.CardDescription>
            </div>
            <badge_1.Badge variant="outline">
              {entidade.papel}
            </badge_1.Badge>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <lucide_react_1.MapPin className="mr-2 h-4 w-4"/>
            {entidade.municipio}, {entidade.estado} ({entidade.regiao})
          </div>
          
          {projeto && (<div className="flex items-center text-sm text-muted-foreground">
              <lucide_react_1.Briefcase className="mr-2 h-4 w-4"/>
              {projeto.titulo}
            </div>)}

          <div className="flex justify-end space-x-2 pt-2">
            <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedEntidade(entidade);
                setEntidadeForm({
                    papel: entidade.papel,
                    nome: entidade.nome,
                    sigla: entidade.sigla,
                    cnpj: entidade.cnpj,
                    municipio: entidade.municipio,
                    estado: entidade.estado,
                    regiao: entidade.regiao
                });
                setIsEntidadeFormOpen(true);
            }}>
              <lucide_react_1.Edit className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleDeleteEntidade(entidade.id); }}>
              <lucide_react_1.Trash2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    };
    var MembroCard = function (_a) {
        var membro = _a.membro;
        var projeto = mockData_1.projetos.find(function (p) { return p.id === membro.projetoId; });
        var titulacao = mockData_1.titulacoes.find(function (t) { return t.id === membro.titulacaoId; });
        var funcao = mockData_1.funcoesEquipe.find(function (f) { return f.id === membro.funcaoId; });
        return (<card_1.Card className="hover:shadow-lg transition-shadow">
        <card_1.CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <card_1.CardTitle className="text-lg leading-tight mb-1">
                {membro.nome}
              </card_1.CardTitle>
              <card_1.CardDescription className="text-sm">
                {membro.tipoDocumento === 'cpf' ? formatCPF(membro.documento) : membro.documento}
              </card_1.CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {titulacao && (<badge_1.Badge variant="secondary">
                  {titulacao.codigo}
                </badge_1.Badge>)}
              {funcao && (<badge_1.Badge variant="outline">
                  {funcao.descricao}
                </badge_1.Badge>)}
            </div>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <lucide_react_1.Phone className="mr-2 h-4 w-4"/>
            {formatTelefone(membro.ddd, membro.telefone)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <lucide_react_1.Mail className="mr-2 h-4 w-4"/>
            {membro.email}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <lucide_react_1.Building2 className="mr-2 h-4 w-4"/>
            {membro.entidadeVinculada}
          </div>

          {projeto && (<div className="flex items-center text-sm text-muted-foreground">
              <lucide_react_1.Briefcase className="mr-2 h-4 w-4"/>
              {projeto.titulo}
            </div>)}

          {membro.curriculoLattes && (<div className="flex items-center text-sm">
              <lucide_react_1.ExternalLink className="mr-2 h-4 w-4"/>
              <a href={membro.curriculoLattes} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Currículo Lattes
              </a>
            </div>)}

          <div className="flex justify-end space-x-2 pt-2">
            <button_1.Button variant="ghost" size="sm" onClick={function () {
                setSelectedMembro(membro);
                setMembroForm({
                    nome: membro.nome,
                    ddd: membro.ddd,
                    telefone: membro.telefone,
                    email: membro.email,
                    tipoDocumento: membro.tipoDocumento,
                    documento: membro.documento,
                    titulacaoId: membro.titulacaoId,
                    funcaoId: membro.funcaoId,
                    entidadeVinculada: membro.entidadeVinculada,
                    dataInicio: membro.dataInicio.toISOString().split('T')[0],
                    dataFim: membro.dataFim ? membro.dataFim.toISOString().split('T')[0] : '',
                    curriculoLattes: membro.curriculoLattes || ''
                });
                setIsMembroFormOpen(true);
            }}>
              <lucide_react_1.Edit className="h-4 w-4"/>
            </button_1.Button>
            <button_1.Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={function () { return handleDeleteMembro(membro.id); }}>
              <lucide_react_1.Trash2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entidades & Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie entidades participantes e membros da equipe dos projetos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <card_1.Card>
        <card_1.CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <input_1.Input placeholder="Pesquisar entidades ou membros..." className="pl-10" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
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

      <tabs_1.Tabs defaultValue="entidades" className="space-y-6">
        <tabs_1.TabsList className="grid w-full grid-cols-2">
          <tabs_1.TabsTrigger value="entidades" className="flex items-center">
            <lucide_react_1.Building2 className="mr-2 h-4 w-4"/>
            Entidades ({filteredEntidades.length})
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="equipe" className="flex items-center">
            <lucide_react_1.Users className="mr-2 h-4 w-4"/>
            Equipe ({filteredMembros.length})
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="entidades" className="space-y-6">
          <div className="flex justify-end">
            <dialog_1.Dialog open={isEntidadeFormOpen} onOpenChange={setIsEntidadeFormOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button onClick={function () { return setSelectedEntidade(null); }}>
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Nova Entidade
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="max-w-2xl">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle>
                    {selectedEntidade ? 'Editar Entidade' : 'Nova Entidade'}
                  </dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label>Papel *</label_1.Label>
                      <select_1.Select value={entidadeForm.papel} onValueChange={function (value) { return setEntidadeForm(__assign(__assign({}, entidadeForm), { papel: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione o papel"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.papeisEntidade.map(function (papel) { return (<select_1.SelectItem key={papel.id} value={papel.descricao}>
                              {papel.descricao}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="sigla">Sigla *</label_1.Label>
                      <input_1.Input id="sigla" value={entidadeForm.sigla} onChange={function (e) { return setEntidadeForm(__assign(__assign({}, entidadeForm), { sigla: e.target.value })); }} placeholder="Ex: CPFL"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="nome">Nome da Entidade *</label_1.Label>
                    <input_1.Input id="nome" value={entidadeForm.nome} onChange={function (e) { return setEntidadeForm(__assign(__assign({}, entidadeForm), { nome: e.target.value })); }} placeholder="Nome completo da entidade"/>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="cnpj">CNPJ *</label_1.Label>
                    <input_1.Input id="cnpj" value={entidadeForm.cnpj} onChange={function (e) { return setEntidadeForm(__assign(__assign({}, entidadeForm), { cnpj: e.target.value })); }} placeholder="00.000.000/0000-00"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="municipio">Município *</label_1.Label>
                      <input_1.Input id="municipio" value={entidadeForm.municipio} onChange={function (e) { return setEntidadeForm(__assign(__assign({}, entidadeForm), { municipio: e.target.value })); }} placeholder="Nome do município"/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label>Estado *</label_1.Label>
                      <select_1.Select value={entidadeForm.estado} onValueChange={function (value) {
            var estado = mockData_1.estados.find(function (e) { return e.sigla === value; });
            setEntidadeForm(__assign(__assign({}, entidadeForm), { estado: value, regiao: (estado === null || estado === void 0 ? void 0 : estado.regiao) || '' }));
        }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione o estado"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.estados.map(function (estado) { return (<select_1.SelectItem key={estado.sigla} value={estado.sigla}>
                              {estado.nome} ({estado.sigla})
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button_1.Button variant="outline" onClick={function () { return setIsEntidadeFormOpen(false); }}>
                      Cancelar
                    </button_1.Button>
                    <button_1.Button onClick={handleCreateEntidade}>
                      {selectedEntidade ? 'Atualizar' : 'Salvar'}
                    </button_1.Button>
                  </div>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntidades.map(function (entidade) { return (<EntidadeCard key={entidade.id} entidade={entidade}/>); })}
          </div>

          {filteredEntidades.length === 0 && (<card_1.Card>
              <card_1.CardContent className="p-12 text-center">
                <lucide_react_1.Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Nenhuma entidade encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando a primeira entidade.'}
                </p>
              </card_1.CardContent>
            </card_1.Card>)}
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="equipe" className="space-y-6">
          <div className="flex justify-end">
            <dialog_1.Dialog open={isMembroFormOpen} onOpenChange={setIsMembroFormOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button onClick={function () { return setSelectedMembro(null); }}>
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Novo Membro
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle>
                    {selectedMembro ? 'Editar Membro' : 'Novo Membro da Equipe'}
                  </dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="nome">Nome Completo *</label_1.Label>
                    <input_1.Input id="nome" value={membroForm.nome} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { nome: e.target.value })); }} placeholder="Nome completo"/>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="ddd">DDD *</label_1.Label>
                      <input_1.Input id="ddd" value={membroForm.ddd} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { ddd: e.target.value })); }} placeholder="11" maxLength={3}/>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label_1.Label htmlFor="telefone">Telefone *</label_1.Label>
                      <input_1.Input id="telefone" value={membroForm.telefone} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { telefone: e.target.value })); }} placeholder="99999-9999"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="email">E-mail *</label_1.Label>
                    <input_1.Input id="email" type="email" value={membroForm.email} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { email: e.target.value })); }} placeholder="email@exemplo.com"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label>Tipo de Documento *</label_1.Label>
                      <select_1.Select value={membroForm.tipoDocumento} onValueChange={function (value) {
            return setMembroForm(__assign(__assign({}, membroForm), { tipoDocumento: value }));
        }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          <select_1.SelectItem value="cpf">CPF</select_1.SelectItem>
                          <select_1.SelectItem value="passaporte">Passaporte</select_1.SelectItem>
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="documento">
                        {membroForm.tipoDocumento === 'cpf' ? 'CPF' : 'Passaporte'} *
                      </label_1.Label>
                      <input_1.Input id="documento" value={membroForm.documento} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { documento: e.target.value })); }} placeholder={membroForm.tipoDocumento === 'cpf' ? '000.000.000-00' : 'Número do passaporte'}/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label>Titulação *</label_1.Label>
                      <select_1.Select value={membroForm.titulacaoId} onValueChange={function (value) { return setMembroForm(__assign(__assign({}, membroForm), { titulacaoId: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione a titulação"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.titulacoes.map(function (titulacao) { return (<select_1.SelectItem key={titulacao.id} value={titulacao.id}>
                              {titulacao.descricao}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label>Função *</label_1.Label>
                      <select_1.Select value={membroForm.funcaoId} onValueChange={function (value) { return setMembroForm(__assign(__assign({}, membroForm), { funcaoId: value })); }}>
                        <select_1.SelectTrigger>
                          <select_1.SelectValue placeholder="Selecione a função"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {mockData_1.funcoesEquipe.map(function (funcao) { return (<select_1.SelectItem key={funcao.id} value={funcao.id}>
                              {funcao.descricao}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="entidadeVinculada">Entidade Vinculada *</label_1.Label>
                    <input_1.Input id="entidadeVinculada" value={membroForm.entidadeVinculada} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { entidadeVinculada: e.target.value })); }} placeholder="Nome da entidade"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="dataInicio">Data de Início *</label_1.Label>
                      <input_1.Input id="dataInicio" type="date" value={membroForm.dataInicio} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { dataInicio: e.target.value })); }}/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="dataFim">Data de Fim</label_1.Label>
                      <input_1.Input id="dataFim" type="date" value={membroForm.dataFim} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { dataFim: e.target.value })); }}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label_1.Label htmlFor="curriculoLattes">Currículo Lattes (URL)</label_1.Label>
                    <input_1.Input id="curriculoLattes" type="url" value={membroForm.curriculoLattes} onChange={function (e) { return setMembroForm(__assign(__assign({}, membroForm), { curriculoLattes: e.target.value })); }} placeholder="http://lattes.cnpq.br/..."/>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <button_1.Button variant="outline" onClick={function () { return setIsMembroFormOpen(false); }}>
                      Cancelar
                    </button_1.Button>
                    <button_1.Button onClick={handleCreateMembro}>
                      {selectedMembro ? 'Atualizar' : 'Salvar'}
                    </button_1.Button>
                  </div>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembros.map(function (membro) { return (<MembroCard key={membro.id} membro={membro}/>); })}
          </div>

          {filteredMembros.length === 0 && (<card_1.Card>
              <card_1.CardContent className="p-12 text-center">
                <lucide_react_1.Users className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando o primeiro membro da equipe.'}
                </p>
              </card_1.CardContent>
            </card_1.Card>)}
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
