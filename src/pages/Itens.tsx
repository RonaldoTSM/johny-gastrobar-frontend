
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Coffee, Package } from 'lucide-react';
import { ItemModal } from '@/components/itens/ItemModal';
import { toast } from '@/hooks/use-toast';

const Itens = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: itens = [], isLoading, error } = useQuery({
    queryKey: ['itens'],
    queryFn: itemService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: itemService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens'] });
      toast({
        title: "Item excluído",
        description: "Item removido do cardápio com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive",
      });
    },
  });

  // Filtrar itens
  const itensFiltrados = itens.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(undefined);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Bebida': return 'bg-blue-100 text-blue-800';
      case 'Prato Principal': return 'bg-red-100 text-red-800';
      case 'Entrada': return 'bg-green-100 text-green-800';
      case 'Sobremesa': return 'bg-purple-100 text-purple-800';
      case 'Petisco': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar itens do cardápio</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
          <p className="text-gray-600 mt-2">Gerencie os itens do cardápio do bar</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{itens.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bebidas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-blue-600">
              {itens.filter(i => i.tipo === 'Bebida').length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pratos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-600">
              {itens.filter(i => i.tipo === 'Prato Principal').length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sobremesas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-purple-600">
              {itens.filter(i => i.tipo === 'Sobremesa').length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {itens.filter(i => i.tipo === 'Entrada').length}
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
              placeholder="Buscar por nome ou tipo..."
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
          <CardTitle>Itens do Cardápio</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Carregando itens...</p>
            </div>
          ) : itensFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensFiltrados.map((item) => (
                  <TableRow key={item.idItem}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(item.tipo)}>{item.tipo}</Badge>
                    </TableCell>
                    <TableCell>{formatPreco(item.preco)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.idItem!)}
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

      <ItemModal
        open={modalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
};

export default Itens;
