import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  entidades as entidadesMock, 
  membrosEquipe as membrosMock,
  projetos,
  papeisEntidade,
  titulacoes,
  funcoesEquipe,
  estados
} from '@/data/mockData';
import { 
  Building2, 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import type { Entidade, MembroEquipe } from '@/types';

export function EntidadesEquipe() {
  const [entidades, setEntidades] = useState<Entidade[]>(entidadesMock);
  const [membros, setMembros] = useState<MembroEquipe[]>(membrosMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjeto, setSelectedProjeto] = useState<string>('todos');
  const [isEntidadeFormOpen, setIsEntidadeFormOpen] = useState(false);
  const [isMembroFormOpen, setIsMembroFormOpen] = useState(false);
  const [selectedEntidade, setSelectedEntidade] = useState<Entidade | null>(null);
  const [selectedMembro, setSelectedMembro] = useState<MembroEquipe | null>(null);

  // Estados do formulário de entidade
  const [entidadeForm, setEntidadeForm] = useState({
    papel: '',
    nome: '',
    sigla: '',
    cnpj: '',
    municipio: '',
    estado: '',
    regiao: ''
  });

  // Estados do formulário de membro
  const [membroForm, setMembroForm] = useState({
    nome: '',
    ddd: '',
    telefone: '',
    email: '',
    tipoDocumento: 'cpf' as 'cpf' | 'passaporte',
    documento: '',
    titulacaoId: '',
    funcaoId: '',
    entidadeVinculada: '',
    dataInicio: '',
    dataFim: '',
    curriculoLattes: ''
  });

  const filteredEntidades = entidades.filter(entidade => {
    const matchesSearch = entidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entidade.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entidade.cnpj.includes(searchTerm);
    
    const matchesProjeto = selectedProjeto === 'todos' || entidade.projetoId === selectedProjeto;
    
    return matchesSearch && matchesProjeto;
  });

  const filteredMembros = membros.filter(membro => {
    const matchesSearch = membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membro.documento.includes(searchTerm);
    
    const matchesProjeto = selectedProjeto === 'todos' || membro.projetoId === selectedProjeto;
    
    return matchesSearch && matchesProjeto;
  });

  const handleCreateEntidade = () => {
    const newEntidade: Entidade = {
      id: Date.now().toString(),
      projetoId: selectedProjeto === 'todos' ? projetos[0].id : selectedProjeto,
      ...entidadeForm,
      regiao: estados.find(e => e.sigla === entidadeForm.estado)?.regiao || ''
    };
    setEntidades([...entidades, newEntidade]);
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

  const handleCreateMembro = () => {
    const newMembro: MembroEquipe = {
      id: Date.now().toString(),
      projetoId: selectedProjeto === 'todos' ? projetos[0].id : selectedProjeto,
      ...membroForm,
      dataInicio: new Date(membroForm.dataInicio),
      dataFim: membroForm.dataFim ? new Date(membroForm.dataFim) : undefined
    };
    setMembros([...membros, newMembro]);
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

  const handleDeleteEntidade = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta entidade?')) {
      setEntidades(entidades.filter(e => e.id !== id));
    }
  };

  const handleDeleteMembro = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setMembros(membros.filter(m => m.id !== id));
    }
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatTelefone = (ddd: string, telefone: string) => {
    const tel = telefone.replace(/^(\d{5})(\d{4})/, '$1-$2');
    return `(${ddd}) ${tel}`;
  };

  const EntidadeCard = ({ entidade }: { entidade: Entidade }) => {
    const projeto = projetos.find(p => p.id === entidade.projetoId);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-1">
                {entidade.nome}
              </CardTitle>
              <CardDescription className="text-sm">
                {entidade.sigla} • {formatCNPJ(entidade.cnpj)}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {entidade.papel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {entidade.municipio}, {entidade.estado} ({entidade.regiao})
          </div>
          
          {projeto && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              {projeto.titulo}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
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
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteEntidade(entidade.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MembroCard = ({ membro }: { membro: MembroEquipe }) => {
    const projeto = projetos.find(p => p.id === membro.projetoId);
    const titulacao = titulacoes.find(t => t.id === membro.titulacaoId);
    const funcao = funcoesEquipe.find(f => f.id === membro.funcaoId);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-1">
                {membro.nome}
              </CardTitle>
              <CardDescription className="text-sm">
                {membro.tipoDocumento === 'cpf' ? formatCPF(membro.documento) : membro.documento}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {titulacao && (
                <Badge variant="secondary">
                  {titulacao.codigo}
                </Badge>
              )}
              {funcao && (
                <Badge variant="outline">
                  {funcao.descricao}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            {formatTelefone(membro.ddd, membro.telefone)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            {membro.email}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="mr-2 h-4 w-4" />
            {membro.entidadeVinculada}
          </div>

          {projeto && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              {projeto.titulo}
            </div>
          )}

          {membro.curriculoLattes && (
            <div className="flex items-center text-sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              <a 
                href={membro.curriculoLattes} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Currículo Lattes
              </a>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
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
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteMembro(membro.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entidades & Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie entidades participantes e membros da equipe dos projetos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar entidades ou membros..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Projetos</SelectItem>
                  {projetos.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="entidades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entidades" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Entidades ({filteredEntidades.length})
          </TabsTrigger>
          <TabsTrigger value="equipe" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Equipe ({filteredMembros.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entidades" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isEntidadeFormOpen} onOpenChange={setIsEntidadeFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedEntidade(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Entidade
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedEntidade ? 'Editar Entidade' : 'Nova Entidade'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Papel *</Label>
                      <Select 
                        value={entidadeForm.papel} 
                        onValueChange={(value) => setEntidadeForm({...entidadeForm, papel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o papel" />
                        </SelectTrigger>
                        <SelectContent>
                          {papeisEntidade.map((papel) => (
                            <SelectItem key={papel.id} value={papel.descricao}>
                              {papel.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sigla">Sigla *</Label>
                      <Input
                        id="sigla"
                        value={entidadeForm.sigla}
                        onChange={(e) => setEntidadeForm({...entidadeForm, sigla: e.target.value})}
                        placeholder="Ex: CPFL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Entidade *</Label>
                    <Input
                      id="nome"
                      value={entidadeForm.nome}
                      onChange={(e) => setEntidadeForm({...entidadeForm, nome: e.target.value})}
                      placeholder="Nome completo da entidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={entidadeForm.cnpj}
                      onChange={(e) => setEntidadeForm({...entidadeForm, cnpj: e.target.value})}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="municipio">Município *</Label>
                      <Input
                        id="municipio"
                        value={entidadeForm.municipio}
                        onChange={(e) => setEntidadeForm({...entidadeForm, municipio: e.target.value})}
                        placeholder="Nome do município"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select 
                        value={entidadeForm.estado} 
                        onValueChange={(value) => {
                          const estado = estados.find(e => e.sigla === value);
                          setEntidadeForm({
                            ...entidadeForm, 
                            estado: value,
                            regiao: estado?.regiao || ''
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado.sigla} value={estado.sigla}>
                              {estado.nome} ({estado.sigla})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEntidadeFormOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateEntidade}>
                      {selectedEntidade ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntidades.map((entidade) => (
              <EntidadeCard key={entidade.id} entidade={entidade} />
            ))}
          </div>

          {filteredEntidades.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma entidade encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando a primeira entidade.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="equipe" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isMembroFormOpen} onOpenChange={setIsMembroFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedMembro(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedMembro ? 'Editar Membro' : 'Novo Membro da Equipe'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={membroForm.nome}
                      onChange={(e) => setMembroForm({...membroForm, nome: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ddd">DDD *</Label>
                      <Input
                        id="ddd"
                        value={membroForm.ddd}
                        onChange={(e) => setMembroForm({...membroForm, ddd: e.target.value})}
                        placeholder="11"
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={membroForm.telefone}
                        onChange={(e) => setMembroForm({...membroForm, telefone: e.target.value})}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={membroForm.email}
                      onChange={(e) => setMembroForm({...membroForm, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Documento *</Label>
                      <Select 
                        value={membroForm.tipoDocumento} 
                        onValueChange={(value: 'cpf' | 'passaporte') => 
                          setMembroForm({...membroForm, tipoDocumento: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="passaporte">Passaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documento">
                        {membroForm.tipoDocumento === 'cpf' ? 'CPF' : 'Passaporte'} *
                      </Label>
                      <Input
                        id="documento"
                        value={membroForm.documento}
                        onChange={(e) => setMembroForm({...membroForm, documento: e.target.value})}
                        placeholder={membroForm.tipoDocumento === 'cpf' ? '000.000.000-00' : 'Número do passaporte'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titulação *</Label>
                      <Select 
                        value={membroForm.titulacaoId} 
                        onValueChange={(value) => setMembroForm({...membroForm, titulacaoId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a titulação" />
                        </SelectTrigger>
                        <SelectContent>
                          {titulacoes.map((titulacao) => (
                            <SelectItem key={titulacao.id} value={titulacao.id}>
                              {titulacao.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Função *</Label>
                      <Select 
                        value={membroForm.funcaoId} 
                        onValueChange={(value) => setMembroForm({...membroForm, funcaoId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          {funcoesEquipe.map((funcao) => (
                            <SelectItem key={funcao.id} value={funcao.id}>
                              {funcao.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entidadeVinculada">Entidade Vinculada *</Label>
                    <Input
                      id="entidadeVinculada"
                      value={membroForm.entidadeVinculada}
                      onChange={(e) => setMembroForm({...membroForm, entidadeVinculada: e.target.value})}
                      placeholder="Nome da entidade"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data de Início *</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={membroForm.dataInicio}
                        onChange={(e) => setMembroForm({...membroForm, dataInicio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data de Fim</Label>
                      <Input
                        id="dataFim"
                        type="date"
                        value={membroForm.dataFim}
                        onChange={(e) => setMembroForm({...membroForm, dataFim: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="curriculoLattes">Currículo Lattes (URL)</Label>
                    <Input
                      id="curriculoLattes"
                      type="url"
                      value={membroForm.curriculoLattes}
                      onChange={(e) => setMembroForm({...membroForm, curriculoLattes: e.target.value})}
                      placeholder="http://lattes.cnpq.br/..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsMembroFormOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateMembro}>
                      {selectedMembro ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembros.map((membro) => (
              <MembroCard key={membro.id} membro={membro} />
            ))}
          </div>

          {filteredMembros.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece cadastrando o primeiro membro da equipe.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
