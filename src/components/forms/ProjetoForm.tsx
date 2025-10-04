import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  fasesInovacao, 
  segmentos, 
  temas, 
  subtemas, 
  temasEstrategicos, 
  tiposProduto 
} from '@/data/mockData';
import type { ProjetoFormData } from '@/types';
import { Calendar, Save, X } from 'lucide-react';

const projetoSchema = z.object({
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

interface ProjetoFormProps {
  projeto?: ProjetoFormData;
  onSubmit: (data: ProjetoFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const produtosDisponiveis = [
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

export function ProjetoForm({ projeto, onSubmit, onCancel, isEditing = false }: ProjetoFormProps) {
  const [selectedTema, setSelectedTema] = useState(projeto?.temaId || '');
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>(projeto?.produtos || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProjetoFormData>({
    resolver: zodResolver(projetoSchema),
    defaultValues: {
      titulo: projeto?.titulo || '',
      codigoANEEL: projeto?.codigoANEEL || '',
      faseInovacaoId: projeto?.faseInovacaoId || '',
      segmentoId: projeto?.segmentoId || '',
      temaId: projeto?.temaId || '',
      tipoProdutoId: projeto?.tipoProdutoId || '',
      subtemaId: projeto?.subtemaId || '',
      temaEstrategicoId: projeto?.temaEstrategicoId || '',
      dataInicio: projeto?.dataInicio || '',
      dataFim: projeto?.dataFim || '',
      duracao: projeto?.duracao || 12,
      prorrogacao: projeto?.prorrogacao || 0,
      escopo: projeto?.escopo || '',
      produtos: projeto?.produtos || [],
      principalResponsavel: projeto?.principalResponsavel || '',
      custoTotalPrevisto: projeto?.custoTotalPrevisto || 0,
      status: projeto?.status || 'planejamento',
      prioridade: projeto?.prioridade || 'media',
      percentualEvolucao: projeto?.percentualEvolucao || 0,
      custoExecutado: projeto?.custoExecutado || 0,
      custoPrevisto: projeto?.custoPrevisto || 0,
    }
  });

  const watchDataInicio = watch('dataInicio');
  const watchDataFim = watch('dataFim');

  // Calcular duração automaticamente
  React.useEffect(() => {
    if (watchDataInicio && watchDataFim) {
      const inicio = new Date(watchDataInicio);
      const fim = new Date(watchDataFim);
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      setValue('duracao', diffMonths);
    }
  }, [watchDataInicio, watchDataFim, setValue]);

  const handleTemaChange = (temaId: string) => {
    setSelectedTema(temaId);
    setValue('temaId', temaId);
    setValue('subtemaId', ''); // Reset subtema quando tema muda
  };

  const handleProdutoToggle = (produto: string) => {
    const newProdutos = selectedProdutos.includes(produto)
      ? selectedProdutos.filter(p => p !== produto)
      : [...selectedProdutos, produto];
    
    setSelectedProdutos(newProdutos);
    setValue('produtos', newProdutos);
  };

  const subtemasFiltered = subtemas.filter(s => s.temaId === selectedTema);

  const onFormSubmit = (data: any) => {
    const formData: ProjetoFormData = {
      ...data,
      dataInicio: new Date(data.dataInicio),
      dataFim: new Date(data.dataFim),
      dataEncerramentoReal: data.dataEncerramentoReal ? new Date(data.dataEncerramentoReal) : undefined,
      produtos: selectedProdutos,
    };
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Altere as informações do projeto' : 'Preencha os dados para cadastrar um novo projeto de PDI'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Projeto *</Label>
              <Input
                id="titulo"
                {...register('titulo')}
                placeholder="Digite o título do projeto"
              />
              {errors.titulo && (
                <p className="text-sm text-red-600">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoANEEL">Código ANEEL *</Label>
              <Input
                id="codigoANEEL"
                {...register('codigoANEEL')}
                placeholder="1234-5678/9012"
                maxLength={14}
              />
              {errors.codigoANEEL && (
                <p className="text-sm text-red-600">{errors.codigoANEEL.message}</p>
              )}
            </div>
          </div>

          {/* Classificações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Fase de Inovação *</Label>
              <Select onValueChange={(value) => setValue('faseInovacaoId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  {fasesInovacao.map((fase) => (
                    <SelectItem key={fase.id} value={fase.id}>
                      {fase.codigo} - {fase.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.faseInovacaoId && (
                <p className="text-sm text-red-600">{errors.faseInovacaoId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Segmento *</Label>
              <Select onValueChange={(value) => setValue('segmentoId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  {segmentos.map((segmento) => (
                    <SelectItem key={segmento.id} value={segmento.id}>
                      {segmento.codigo} - {segmento.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.segmentoId && (
                <p className="text-sm text-red-600">{errors.segmentoId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Produto *</Label>
              <Select onValueChange={(value) => setValue('tipoProdutoId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposProduto.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.codigo} - {tipo.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoProdutoId && (
                <p className="text-sm text-red-600">{errors.tipoProdutoId.message}</p>
              )}
            </div>
          </div>

          {/* Temas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema *</Label>
              <Select onValueChange={handleTemaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  {temas.map((tema) => (
                    <SelectItem key={tema.id} value={tema.id}>
                      {tema.codigo} - {tema.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.temaId && (
                <p className="text-sm text-red-600">{errors.temaId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Subtema *</Label>
              <Select 
                onValueChange={(value) => setValue('subtemaId', value)}
                disabled={!selectedTema}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o subtema" />
                </SelectTrigger>
                <SelectContent>
                  {subtemasFiltered.map((subtema) => (
                    <SelectItem key={subtema.id} value={subtema.id}>
                      {subtema.codigo} - {subtema.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subtemaId && (
                <p className="text-sm text-red-600">{errors.subtemaId.message}</p>
              )}
            </div>
          </div>

          {/* Tema Estratégico */}
          <div className="space-y-2">
            <Label>Tema Estratégico PEQuI *</Label>
            <Select onValueChange={(value) => setValue('temaEstrategicoId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tema estratégico" />
              </SelectTrigger>
              <SelectContent>
                {temasEstrategicos.map((tema) => (
                  <SelectItem key={tema.id} value={tema.id}>
                    {tema.codigo} - {tema.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.temaEstrategicoId && (
              <p className="text-sm text-red-600">{errors.temaEstrategicoId.message}</p>
            )}
          </div>

          {/* Cronograma */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type="date"
                {...register('dataInicio')}
              />
              {errors.dataInicio && (
                <p className="text-sm text-red-600">{errors.dataInicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim *</Label>
              <Input
                id="dataFim"
                type="date"
                {...register('dataFim')}
              />
              {errors.dataFim && (
                <p className="text-sm text-red-600">{errors.dataFim.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (meses)</Label>
              <Input
                id="duracao"
                type="number"
                {...register('duracao', { valueAsNumber: true })}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prorrogacao">Prorrogação (meses)</Label>
              <Input
                id="prorrogacao"
                type="number"
                {...register('prorrogacao', { valueAsNumber: true })}
                min="0"
              />
            </div>
          </div>

          {/* Informações Complementares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principalResponsavel">Principal Responsável *</Label>
              <Input
                id="principalResponsavel"
                {...register('principalResponsavel')}
                placeholder="Nome do responsável"
              />
              {errors.principalResponsavel && (
                <p className="text-sm text-red-600">{errors.principalResponsavel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoTotalPrevisto">Custo Total Previsto (R$)</Label>
              <Input
                id="custoTotalPrevisto"
                type="number"
                step="0.01"
                {...register('custoTotalPrevisto', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.custoTotalPrevisto && (
                <p className="text-sm text-red-600">{errors.custoTotalPrevisto.message}</p>
              )}
            </div>
          </div>

          {/* Escopo */}
          <div className="space-y-2">
            <Label htmlFor="escopo">Escopo do Projeto *</Label>
            <Textarea
              id="escopo"
              {...register('escopo')}
              placeholder="Descreva o escopo e objetivos do projeto..."
              rows={4}
            />
            {errors.escopo && (
              <p className="text-sm text-red-600">{errors.escopo.message}</p>
            )}
          </div>

          {/* Produtos */}
          <div className="space-y-2">
            <Label>Produtos do Projeto *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
              {produtosDisponiveis.map((produto) => (
                <label key={produto} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProdutos.includes(produto)}
                    onChange={() => handleProdutoToggle(produto)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{produto}</span>
                </label>
              ))}
            </div>
            {errors.produtos && (
              <p className="text-sm text-red-600">{errors.produtos.message}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
