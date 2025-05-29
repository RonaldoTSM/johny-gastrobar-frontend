
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mesaService } from '@/services/mesaService';
import { Mesa } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { MesaModal } from '@/components/mesas/MesaModal';
import { toast } from '@/hooks/use-toast';

const Mesas = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: mesas = [], isLoading, error } = useQuery({
    queryKey: ['mesas'],
    queryFn: mesaService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: mesaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesas'] });
      toast({
        title: "Mesa excluída",
        description: "Mesa removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a mesa.",
        variant: "destructive",
      });
    },
  });

  // Filtrar mesas
  const mesasFiltradas = mesas.filter(mesa =>
    mesa.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mesa.capacidade.toString().includes(searchTerm)
  );

  const handleEdit = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta mesa?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMesa(undefined);
  };

  const getLocalizacaoColor = (localizacao: string) => {
    const loc = localizacao.toLowerCase();
    if (loc.includes('vip') || loc.includes('premium')) return 'bg-purple-100 text-purple-800';
    if (loc.includes('externa') || loc.includes('terraço')) return 'bg-green-100 text-green-800';
    if (loc.includes('salão') || loc.includes('principal')) return 'bg-blue-100 text-blue-800';
    if (loc.includes('reservada') || loc.includes('privada')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCapacidadeIcon = (capacidade: number) => {
    if (capacidade <= 2) return '👥';
    if (capacidade <= 4) return '👨‍👩‍👧‍👦';
    if (capacidade <= 6) return '🍽️';
    return '🏛️';
  };

  // Calcular estatísticas
  const totalCapacidade = mesas.reduce((acc, mesa) => acc + mesa.capacidade, 0);
  const mesasGrandes = mesas.filter(m => m.capacidade >= 6).length;
  const mesasPequenas = mesas.filter(m => m.capacidade <= 2).length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar mesas</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Mesas</h1>
          <p className="text-gray-600 mt-2">Gerencie as mesas do estabelecimento</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{mesas.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Capacidade Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">{totalCapacidade}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mesas Grandes (6+)</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-purple-600">{mesasGrandes}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mesas Pequenas (≤2)</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-orange-600">{mesasPequenas}</span>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por localização ou capacidade..."
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
          <CardTitle>Lista de Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Carregando mesas...</p>
            </div>
          ) : mesasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma mesa encontrada' : 'Nenhuma mesa cadastrada'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mesasFiltradas.map((mesa) => (
                  <TableRow key={mesa.idMesa}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCapacidadeIcon(mesa.capacidade)}</span>
                        Mesa #{mesa.idMesa}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        {mesa.capacidade} pessoas
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLocalizacaoColor(mesa.localizacao)}>
                        {mesa.localizacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(mesa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mesa.idMesa!)}
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

      <MesaModal
        open={modalOpen}
        onClose={handleCloseModal}
        mesa={selectedMesa}
      />
    </div>
  );
};

export default Mesas;
