
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagamentoService } from '@/services/pagamentoService';
import { Pagamento } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PagamentoModal } from '@/components/pagamentos/PagamentoModal';
import { toast } from '@/hooks/use-toast';

export default function Pagamentos() {
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pagamentos = [], isLoading } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: pagamentoService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast({
        title: "Pagamento excluído",
        description: "Pagamento removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pagamento.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pagamento?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-lg">Carregando pagamentos...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.map((pagamento) => (
                  <TableRow key={pagamento.idPagamento}>
                    <TableCell>{pagamento.idPagamento}</TableCell>
                    <TableCell>Pedido #{pagamento.idPedido}</TableCell>
                    <TableCell>R$ {pagamento.valorTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pagamento.metodoPagamento === 'Cartão de Crédito' 
                          ? 'bg-blue-100 text-blue-800'
                          : pagamento.metodoPagamento === 'PIX'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pagamento.metodoPagamento}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(pagamento.dataPagamento || '').toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pagamento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pagamento.idPagamento!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pagamentos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                  )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PagamentoModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPagamento(undefined);
        }}
        pagamento={selectedPagamento}
      />
    </div>
  );
}
