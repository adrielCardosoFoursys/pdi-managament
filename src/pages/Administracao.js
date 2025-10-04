"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administracao = Administracao;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
function Administracao() {
    var _a = (0, react_1.useState)('fases'), selectedParam = _a[0], setSelectedParam = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var parametros = [
        {
            id: 'fases',
            title: 'Fases de Inovação',
            description: 'Gerenciar fases do ciclo de inovação',
            data: mockData_1.fasesInovacao,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'segmentos',
            title: 'Segmentos',
            description: 'Segmentos do setor elétrico',
            data: mockData_1.segmentos,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'temas',
            title: 'Temas',
            description: 'Temas de pesquisa e desenvolvimento',
            data: mockData_1.temas,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'subtemas',
            title: 'Subtemas',
            description: 'Subtemas específicos por área',
            data: mockData_1.subtemas,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'temas-estrategicos',
            title: 'Temas Estratégicos PEQuI',
            description: 'Temas estratégicos do PEQuI',
            data: mockData_1.temasEstrategicos,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'tipos-produto',
            title: 'Tipos de Produto',
            description: 'Categorias de produtos/entregáveis',
            data: mockData_1.tiposProduto,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'papeis-entidade',
            title: 'Papéis de Entidade',
            description: 'Papéis das entidades no projeto',
            data: mockData_1.papeisEntidade,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'titulacoes',
            title: 'Titulações',
            description: 'Níveis de formação acadêmica',
            data: mockData_1.titulacoes,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'funcoes-equipe',
            title: 'Funções na Equipe',
            description: 'Funções dos membros da equipe',
            data: mockData_1.funcoesEquipe,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        },
        {
            id: 'rubricas',
            title: 'Rubricas Financeiras',
            description: 'Categorias de despesas financeiras',
            data: mockData_1.rubricasFinanceiras,
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        }
    ];
    var selectedParametro = parametros.find(function (p) { return p.id === selectedParam; });
    var filteredData = (selectedParametro === null || selectedParametro === void 0 ? void 0 : selectedParametro.data.filter(function (item) {
        return item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    })) || [];
    return (<div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Administração de Parâmetros</h2>
        <p className="text-muted-foreground">
          Configure e gerencie todos os parâmetros utilizados na plataforma
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Menu Lateral */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-4">Parâmetros</h3>
          {parametros.map(function (param) { return (<button_1.Button key={param.id} variant={selectedParam === param.id ? 'default' : 'ghost'} className="w-full justify-start" onClick={function () { return setSelectedParam(param.id); }}>
              {param.icon}
              <span className="ml-2">{param.title}</span>
            </button_1.Button>); })}
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
          {selectedParametro && (<>
              {/* Cabeçalho */}
              <card_1.Card>
                <card_1.CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <card_1.CardTitle className="flex items-center">
                        {selectedParametro.icon}
                        <span className="ml-2">{selectedParametro.title}</span>
                      </card_1.CardTitle>
                      <card_1.CardDescription>
                        {selectedParametro.description}
                      </card_1.CardDescription>
                    </div>
                    <button_1.Button>
                      <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                      Novo Item
                    </button_1.Button>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                      <input type="search" placeholder="Pesquisar..." className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filteredData.length} item(s) encontrado(s)
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              {/* Lista de Itens */}
              <card_1.Card>
                <card_1.CardContent className="p-0">
                  <div className="divide-y">
                    {filteredData.map(function (item, index) {
                var _a;
                return (<div key={item.id || index} className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <badge_1.Badge variant="outline" className="font-mono">
                                {item.codigo}
                              </badge_1.Badge>
                              <h4 className="font-medium">{item.descricao}</h4>
                              <badge_1.Badge variant={item.status === 'ativo' ? 'default' : 'secondary'}>
                                {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                              </badge_1.Badge>
                            </div>
                            {item.sigla && (<p className="text-sm text-muted-foreground mt-1">
                                Sigla: {item.sigla}
                              </p>)}
                            {item.temaId && (<p className="text-sm text-muted-foreground mt-1">
                                Tema vinculado: {(_a = mockData_1.temas.find(function (t) { return t.id === item.temaId; })) === null || _a === void 0 ? void 0 : _a.descricao}
                              </p>)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button_1.Button variant="ghost" size="sm">
                              <lucide_react_1.Edit className="h-4 w-4"/>
                            </button_1.Button>
                            <button_1.Button variant="ghost" size="sm" className={item.status === 'ativo' ? 'text-orange-600' : 'text-green-600'}>
                              {item.status === 'ativo' ? <lucide_react_1.EyeOff className="h-4 w-4"/> : <lucide_react_1.Eye className="h-4 w-4"/>}
                            </button_1.Button>
                            <button_1.Button variant="ghost" size="sm" className="text-red-600">
                              <lucide_react_1.Trash2 className="h-4 w-4"/>
                            </button_1.Button>
                          </div>
                        </div>
                      </div>);
            })}
                  </div>
                </card_1.CardContent>
              </card_1.Card>

              {/* Estatísticas */}
              <div className="grid gap-4 md:grid-cols-3">
                <card_1.Card>
                  <card_1.CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedParametro.data.length}</div>
                      <div className="text-sm text-muted-foreground">Total de Itens</div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                  <card_1.CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedParametro.data.filter(function (item) { return item.status === 'ativo'; }).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Itens Ativos</div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
                <card_1.Card>
                  <card_1.CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedParametro.data.filter(function (item) { return item.status === 'inativo'; }).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Itens Inativos</div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </>)}
        </div>
      </div>
    </div>);
}
