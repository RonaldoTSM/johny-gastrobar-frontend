
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidoService } from '@/services/pedidoService';
import { Pedido } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PedidoModal } from '@/components/pedidos/PedidoModal';
import { toast } from '@/hooks/use-toast';

export default function Pedidos() {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pedidos = [], isLoading } = useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidoService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: pedidoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast({
        title: "Pedido excluído",
        description: "Pedido removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pedido.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteMutation.mutate(id);
    }
  };

  const calculateTotal = (pedido: Pedido) => {
    const subtotal = pedido.itensDoPedido.reduce((sum, item) => 
      sum + (item.quantidade * (item.precoUnitario || 0)), 0
    );
    const desconto = (subtotal * (pedido.desconto || 0)) / 100;
    return subtotal - desconto;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-lg">Carregando pedidos...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.idPedido}>
                    <TableCell>{pedido.idPedido}</TableCell>
                    <TableCell>Mesa {pedido.idMesa}</TableCell>
                    <TableCell>
                      {new Date(pedido.dataHora || '').toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pedido.pago 
                          ? 'bg-green-100 text-green-800' 
                          : pedido.entregue 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pedido.pago ? 'Pago' : pedido.entregue ? 'Entregue' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>R$ {calculateTotal(pedido).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pedido)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pedido.idPedido!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PedidoModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPedido(undefined);
        }}
        pedido={selectedPedido}
      />
    </div>
  );
}
