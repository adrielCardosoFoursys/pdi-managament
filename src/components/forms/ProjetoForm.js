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
exports.ProjetoForm = ProjetoForm;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var card_1 = require("@/components/ui/card");
var mockData_1 = require("@/data/mockData");
var lucide_react_1 = require("lucide-react");
var projetoSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
    codigoANEEL: z.string().min(1, 'Código ANEEL é obrigatório').regex(/^\d{4}-\d{4}\/\d{4}$/, 'Formato deve ser 1234-5678/9012'),
    faseInovacaoId: z.string().min(1, 'Fase de Inovação é obrigatória'),
    segmentoId: z.string().min(1, 'Segmento é obrigatório'),
    temaId: z.string().min(1, 'Tema é obrigatório'),
    tipoProdutoId: z.string().min(1, 'Tipo de Produto é obrigatório'),
    subtemaId: z.string().min(1, 'Subtema é obrigatório'),
    temaEstrategicoId: z.string().min(1, 'Tema Estratégico é obrigatório'),
    dataInicio: z.string().min(1, 'Data de Início é obrigatória'),
    dataFim: z.string().min(1, 'Data de Fim é obrigatória'),
    duracao: z.number().min(1, 'Duração deve ser maior que 0'),
    prorrogacao: z.number().min(0, 'Prorrogação não pode ser negativa').optional(),
    escopo: z.string().min(1, 'Escopo é obrigatório').max(2000, 'Escopo deve ter no máximo 2000 caracteres'),
    produtos: z.array(z.string()).min(1, 'Selecione pelo menos um produto'),
    principalResponsavel: z.string().min(1, 'Principal Responsável é obrigatório'),
    custoTotalPrevisto: z.number().min(0, 'Custo deve ser maior ou igual a 0'),
});
var produtosDisponiveis = [
    'Sistema de Software',
    'Relatório Técnico',
    'Artigo Científico',
    'Patente',
    'Protótipo',
    'Metodologia',
    'Material Supercondutor',
    'Equipamento',
    'Manual Técnico',
    'Curso de Capacitação'
];
function ProjetoForm(_a) {
    var projeto = _a.projeto, onSubmit = _a.onSubmit, onCancel = _a.onCancel, _b = _a.isEditing, isEditing = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)((projeto === null || projeto === void 0 ? void 0 : projeto.temaId) || ''), selectedTema = _c[0], setSelectedTema = _c[1];
    var _d = (0, react_1.useState)((projeto === null || projeto === void 0 ? void 0 : projeto.produtos) || []), selectedProdutos = _d[0], setSelectedProdutos = _d[1];
    var _e = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(projetoSchema),
        defaultValues: {
            titulo: (projeto === null || projeto === void 0 ? void 0 : projeto.titulo) || '',
            codigoANEEL: (projeto === null || projeto === void 0 ? void 0 : projeto.codigoANEEL) || '',
            faseInovacaoId: (projeto === null || projeto === void 0 ? void 0 : projeto.faseInovacaoId) || '',
            segmentoId: (projeto === null || projeto === void 0 ? void 0 : projeto.segmentoId) || '',
            temaId: (projeto === null || projeto === void 0 ? void 0 : projeto.temaId) || '',
            tipoProdutoId: (projeto === null || projeto === void 0 ? void 0 : projeto.tipoProdutoId) || '',
            subtemaId: (projeto === null || projeto === void 0 ? void 0 : projeto.subtemaId) || '',
            temaEstrategicoId: (projeto === null || projeto === void 0 ? void 0 : projeto.temaEstrategicoId) || '',
            dataInicio: (projeto === null || projeto === void 0 ? void 0 : projeto.dataInicio) ? new Date(projeto.dataInicio).toISOString().split('T')[0] : '',
            dataFim: (projeto === null || projeto === void 0 ? void 0 : projeto.dataFim) ? new Date(projeto.dataFim).toISOString().split('T')[0] : '',
            duracao: (projeto === null || projeto === void 0 ? void 0 : projeto.duracao) || 12,
            prorrogacao: (projeto === null || projeto === void 0 ? void 0 : projeto.prorrogacao) || 0,
            escopo: (projeto === null || projeto === void 0 ? void 0 : projeto.escopo) || '',
            produtos: (projeto === null || projeto === void 0 ? void 0 : projeto.produtos) || [],
            principalResponsavel: (projeto === null || projeto === void 0 ? void 0 : projeto.principalResponsavel) || '',
            custoTotalPrevisto: (projeto === null || projeto === void 0 ? void 0 : projeto.custoTotalPrevisto) || 0,
            status: (projeto === null || projeto === void 0 ? void 0 : projeto.status) || 'planejamento',
            prioridade: (projeto === null || projeto === void 0 ? void 0 : projeto.prioridade) || 'media',
            percentualEvolucao: (projeto === null || projeto === void 0 ? void 0 : projeto.percentualEvolucao) || 0,
            custoExecutado: (projeto === null || projeto === void 0 ? void 0 : projeto.custoExecutado) || 0,
            custoPrevisto: (projeto === null || projeto === void 0 ? void 0 : projeto.custoPrevisto) || 0,
        }
    }), register = _e.register, handleSubmit = _e.handleSubmit, watch = _e.watch, setValue = _e.setValue, _f = _e.formState, errors = _f.errors, isSubmitting = _f.isSubmitting;
    var watchDataInicio = watch('dataInicio');
    var watchDataFim = watch('dataFim');
    // Calcular duração automaticamente
    react_1.default.useEffect(function () {
        if (watchDataInicio && watchDataFim) {
            var inicio = new Date(watchDataInicio);
            var fim = new Date(watchDataFim);
            var diffTime = Math.abs(fim.getTime() - inicio.getTime());
            var diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
            setValue('duracao', diffMonths);
        }
    }, [watchDataInicio, watchDataFim, setValue]);
    var handleTemaChange = function (temaId) {
        setSelectedTema(temaId);
        setValue('temaId', temaId);
        setValue('subtemaId', ''); // Reset subtema quando tema muda
    };
    var handleProdutoToggle = function (produto) {
        var newProdutos = selectedProdutos.includes(produto)
            ? selectedProdutos.filter(function (p) { return p !== produto; })
            : __spreadArray(__spreadArray([], selectedProdutos, true), [produto], false);
        setSelectedProdutos(newProdutos);
        setValue('produtos', newProdutos);
    };
    var subtemasFiltered = mockData_1.subtemas.filter(function (s) { return s.temaId === selectedTema; });
    var onFormSubmit = function (data) {
        var formData = __assign(__assign({}, data), { dataInicio: new Date(data.dataInicio), dataFim: new Date(data.dataFim), dataEncerramentoReal: data.dataEncerramentoReal ? new Date(data.dataEncerramentoReal) : undefined, produtos: selectedProdutos });
        onSubmit(formData);
    };
    return (<card_1.Card className="w-full max-w-4xl mx-auto">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center">
          <lucide_react_1.Calendar className="mr-2 h-5 w-5"/>
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </card_1.CardTitle>
        <card_1.CardDescription>
          {isEditing ? 'Altere as informações do projeto' : 'Preencha os dados para cadastrar um novo projeto de PDI'}
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="titulo">Título do Projeto *</label_1.Label>
              <input_1.Input id="titulo" {...register('titulo')} placeholder="Digite o título do projeto"/>
              {errors.titulo && (<p className="text-sm text-red-600">{errors.titulo.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="codigoANEEL">Código ANEEL *</label_1.Label>
              <input_1.Input id="codigoANEEL" {...register('codigoANEEL')} placeholder="1234-5678/9012" maxLength={14}/>
              {errors.codigoANEEL && (<p className="text-sm text-red-600">{errors.codigoANEEL.message}</p>)}
            </div>
          </div>

          {/* Classificações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label_1.Label>Fase de Inovação *</label_1.Label>
              <select_1.Select onValueChange={function (value) { return setValue('faseInovacaoId', value); }}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecione a fase"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {mockData_1.fasesInovacao.map(function (fase) { return (<select_1.SelectItem key={fase.id} value={fase.id}>
                      {fase.codigo} - {fase.descricao}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              {errors.faseInovacaoId && (<p className="text-sm text-red-600">{errors.faseInovacaoId.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label>Segmento *</label_1.Label>
              <select_1.Select onValueChange={function (value) { return setValue('segmentoId', value); }}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecione o segmento"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {mockData_1.segmentos.map(function (segmento) { return (<select_1.SelectItem key={segmento.id} value={segmento.id}>
                      {segmento.codigo} - {segmento.descricao}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              {errors.segmentoId && (<p className="text-sm text-red-600">{errors.segmentoId.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label>Tipo de Produto *</label_1.Label>
              <select_1.Select onValueChange={function (value) { return setValue('tipoProdutoId', value); }}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecione o tipo"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {mockData_1.tiposProduto.map(function (tipo) { return (<select_1.SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.codigo} - {tipo.descricao}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              {errors.tipoProdutoId && (<p className="text-sm text-red-600">{errors.tipoProdutoId.message}</p>)}
            </div>
          </div>

          {/* Temas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label_1.Label>Tema *</label_1.Label>
              <select_1.Select onValueChange={handleTemaChange}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecione o tema"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {mockData_1.temas.map(function (tema) { return (<select_1.SelectItem key={tema.id} value={tema.id}>
                      {tema.codigo} - {tema.descricao}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              {errors.temaId && (<p className="text-sm text-red-600">{errors.temaId.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label>Subtema *</label_1.Label>
              <select_1.Select onValueChange={function (value) { return setValue('subtemaId', value); }} disabled={!selectedTema}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Selecione o subtema"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {subtemasFiltered.map(function (subtema) { return (<select_1.SelectItem key={subtema.id} value={subtema.id}>
                      {subtema.codigo} - {subtema.descricao}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              {errors.subtemaId && (<p className="text-sm text-red-600">{errors.subtemaId.message}</p>)}
            </div>
          </div>

          {/* Tema Estratégico */}
          <div className="space-y-2">
            <label_1.Label>Tema Estratégico PEQuI *</label_1.Label>
            <select_1.Select onValueChange={function (value) { return setValue('temaEstrategicoId', value); }}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Selecione o tema estratégico"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {mockData_1.temasEstrategicos.map(function (tema) { return (<select_1.SelectItem key={tema.id} value={tema.id}>
                    {tema.codigo} - {tema.descricao}
                  </select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
            {errors.temaEstrategicoId && (<p className="text-sm text-red-600">{errors.temaEstrategicoId.message}</p>)}
          </div>

          {/* Cronograma */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="dataInicio">Data de Início *</label_1.Label>
              <input_1.Input id="dataInicio" type="date" {...register('dataInicio')}/>
              {errors.dataInicio && (<p className="text-sm text-red-600">{errors.dataInicio.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="dataFim">Data de Fim *</label_1.Label>
              <input_1.Input id="dataFim" type="date" {...register('dataFim')}/>
              {errors.dataFim && (<p className="text-sm text-red-600">{errors.dataFim.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="duracao">Duração (meses)</label_1.Label>
              <input_1.Input id="duracao" type="number" {...register('duracao', { valueAsNumber: true })} readOnly className="bg-muted"/>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="prorrogacao">Prorrogação (meses)</label_1.Label>
              <input_1.Input id="prorrogacao" type="number" {...register('prorrogacao', { valueAsNumber: true })} min="0"/>
            </div>
          </div>

          {/* Informações Complementares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="principalResponsavel">Principal Responsável *</label_1.Label>
              <input_1.Input id="principalResponsavel" {...register('principalResponsavel')} placeholder="Nome do responsável"/>
              {errors.principalResponsavel && (<p className="text-sm text-red-600">{errors.principalResponsavel.message}</p>)}
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="custoTotalPrevisto">Custo Total Previsto (R$)</label_1.Label>
              <input_1.Input id="custoTotalPrevisto" type="number" step="0.01" {...register('custoTotalPrevisto', { valueAsNumber: true })} placeholder="0.00"/>
              {errors.custoTotalPrevisto && (<p className="text-sm text-red-600">{errors.custoTotalPrevisto.message}</p>)}
            </div>
          </div>

          {/* Escopo */}
          <div className="space-y-2">
            <label_1.Label htmlFor="escopo">Escopo do Projeto *</label_1.Label>
            <textarea_1.Textarea id="escopo" {...register('escopo')} placeholder="Descreva o escopo e objetivos do projeto..." rows={4}/>
            {errors.escopo && (<p className="text-sm text-red-600">{errors.escopo.message}</p>)}
          </div>

          {/* Produtos */}
          <div className="space-y-2">
            <label_1.Label>Produtos do Projeto *</label_1.Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
              {produtosDisponiveis.map(function (produto) { return (<label key={produto} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={selectedProdutos.includes(produto)} onChange={function () { return handleProdutoToggle(produto); }} className="rounded border-gray-300"/>
                  <span className="text-sm">{produto}</span>
                </label>); })}
            </div>
            {errors.produtos && (<p className="text-sm text-red-600">{errors.produtos.message}</p>)}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <button_1.Button type="button" variant="outline" onClick={onCancel}>
              <lucide_react_1.X className="mr-2 h-4 w-4"/>
              Cancelar
            </button_1.Button>
            <button_1.Button type="submit" disabled={isSubmitting}>
              <lucide_react_1.Save className="mr-2 h-4 w-4"/>
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
            </button_1.Button>
          </div>
        </form>
      </card_1.CardContent>
    </card_1.Card>);
}
