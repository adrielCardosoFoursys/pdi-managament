import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  fasesInovacao, 
  segmentos, 
  temas, 
  subtemas, 
  temasEstrategicos,
  tiposProduto,
  papeisEntidade,
  titulacoes,
  funcoesEquipe,
  rubricasFinanceiras
} from '@/data/mockData';
import { 
  Edit, 
  Eye, 
  EyeOff, 
  Plus, 
  Search,
  Settings,
  Trash2
} from 'lucide-react';

interface ParametroConfig {
  id: string;
  title: string;
  description: string;
  data: any[];
  icon: React.ReactNode;
}

export function Administracao() {
  const [selectedParam, setSelectedParam] = useState<string>('fases');
  const [searchTerm, setSearchTerm] = useState('');

  const parametros: ParametroConfig[] = [
    {
      id: 'fases',
      title: 'Fases de Inovação',
      description: 'Gerenciar fases do ciclo de inovação',
      data: fasesInovacao,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'segmentos',
      title: 'Segmentos',
      description: 'Segmentos do setor elétrico',
      data: segmentos,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'temas',
      title: 'Temas',
      description: 'Temas de pesquisa e desenvolvimento',
      data: temas,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'subtemas',
      title: 'Subtemas',
      description: 'Subtemas específicos por área',
      data: subtemas,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'temas-estrategicos',
      title: 'Temas Estratégicos PEQuI',
      description: 'Temas estratégicos do PEQuI',
      data: temasEstrategicos,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'tipos-produto',
      title: 'Tipos de Produto',
      description: 'Categorias de produtos/entregáveis',
      data: tiposProduto,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'papeis-entidade',
      title: 'Papéis de Entidade',
      description: 'Papéis das entidades no projeto',
      data: papeisEntidade,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'titulacoes',
      title: 'Titulações',
      description: 'Níveis de formação acadêmica',
      data: titulacoes,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'funcoes-equipe',
      title: 'Funções na Equipe',
      description: 'Funções dos membros da equipe',
      data: funcoesEquipe,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 'rubricas',
      title: 'Rubricas Financeiras',
      description: 'Categorias de despesas financeiras',
      data: rubricasFinanceiras,
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const selectedParametro = parametros.find(p => p.id === selectedParam);

  const filteredData = selectedParametro?.data.filter(item =>
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
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
          {parametros.map((param) => (
            <Button
              key={param.id}
              variant={selectedParam === param.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedParam(param.id)}
            >
              {param.icon}
              <span className="ml-2">{param.title}</span>
            </Button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
          {selectedParametro && (
            <>
              {/* Cabeçalho */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {selectedParametro.icon}
                        <span className="ml-2">{selectedParametro.title}</span>
                      </CardTitle>
                      <CardDescription>
                        {selectedParametro.description}
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Pesquisar..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filteredData.length} item(s) encontrado(s)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Itens */}
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredData.map((item, index) => (
                      <div key={item.id || index} className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="font-mono">
                                {item.codigo}
                              </Badge>
                              <h4 className="font-medium">{item.descricao}</h4>
                              <Badge variant={item.status === 'ativo' ? 'default' : 'secondary'}>
                                {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            {item.sigla && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Sigla: {item.sigla}
                              </p>
                            )}
                            {item.temaId && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Tema vinculado: {temas.find(t => t.id === item.temaId)?.descricao}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={item.status === 'ativo' ? 'text-orange-600' : 'text-green-600'}
                            >
                              {item.status === 'ativo' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedParametro.data.length}</div>
                      <div className="text-sm text-muted-foreground">Total de Itens</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedParametro.data.filter(item => item.status === 'ativo').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Itens Ativos</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedParametro.data.filter(item => item.status === 'inativo').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Itens Inativos</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
