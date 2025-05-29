
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { funcionarioService } from '@/services/funcionarioService';
import { Funcionario } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FuncionarioModal } from '@/components/funcionarios/FuncionarioModal';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Funcionarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();

  // Buscar funcionários
  const { data: funcionarios = [], isLoading, error } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: funcionarioService.getAll,
  });

  // Deletar funcionário
  const deleteMutation = useMutation({
    mutationFn: funcionarioService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast({
        title: "Funcionário removido",
        description: "Funcionário removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o funcionário.",
        variant: "destructive",
      });
    },
  });

  // Filtrar funcionários
  const funcionariosFiltrados = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cpf.includes(searchTerm) ||
    funcionario.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFuncionario(undefined);
  };

  const getEspecificacaoColor = (tipo: string) => {
    switch (tipo) {
      case 'Garcom': return 'bg-blue-100 text-blue-800';
      case 'Cozinheiro': return 'bg-orange-100 text-orange-800';
      case 'Bartender': return 'bg-purple-100 text-purple-800';
      case 'Gerente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEspecializacaoInfo = (funcionario: Funcionario) => {
    switch (funcionario.tipo) {
      case 'Garcom':
        return funcionario.setorAtendimento;
      case 'Cozinheiro':
        return funcionario.especialidadeCulinaria;
      case 'Bartender':
        return funcionario.especialidadeBar;
      case 'Gerente':
        return `${funcionario.nivelAcesso} (${funcionario.limiteDesconto}% desc.)`;
      default:
        return '-';
    }
  };

  const formatSalario = (salario: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salario);
  };

  const formatData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar funcionários</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os funcionários do estabelecimento</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{funcionarios.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Garçons</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-blue-600">
              {funcionarios.filter(f => f.tipo === 'Garcom').length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cozinheiros</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-orange-600">
              {funcionarios.filter(f => f.tipo === 'Cozinheiro').length}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bartenders</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-purple-600">
              {funcionarios.filter(f => f.tipo === 'Bartender').length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gerentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {funcionarios.filter(f => f.tipo === 'Gerente').length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Carregando funcionários...</p>
            </div>
          ) : funcionariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Especialização</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Contratação</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionariosFiltrados.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.cpf}</TableCell>
                    <TableCell>
                      <Badge className={getEspecificacaoColor(funcionario.tipo)}>
                        {funcionario.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-48 truncate">
                      {getEspecializacaoInfo(funcionario)}
                    </TableCell>
                    <TableCell>{formatSalario(funcionario.salario)}</TableCell>
                    <TableCell>{formatData(funcionario.dataContratacao)}</TableCell>
                    <TableCell>{funcionario.nomeSupervisor || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(funcionario)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(funcionario.id!)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <FuncionarioModal
        open={isModalOpen}
        onClose={handleCloseModal}
        funcionario={selectedFuncionario}
      />
    </div>
  );
}
