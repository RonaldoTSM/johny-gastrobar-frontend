
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { pagamentoService } from '@/services/pagamentoService';
import { pedidoService } from '@/services/pedidoService';
import { Pagamento } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface PagamentoModalProps {
  open: boolean;
  onClose: () => void;
  pagamento?: Pagamento;
}

export function PagamentoModal({ open, onClose, pagamento }: PagamentoModalProps) {
  const [formData, setFormData] = useState({
    idPedido: '',
    valorTotal: '',
    metodoPagamento: '',
  });

  const queryClient = useQueryClient();

  // Buscar pedidos não pagos para evitar pagamentos duplicados
  const { data: pedidos = [], isLoading: isLoadingPedidos } = useQuery({
    queryKey: ['pedidos-nao-pagos'],
    queryFn: pedidoService.getNaoPagos,
    enabled: !pagamento && open, // Só busca pedidos não pagos se for novo pagamento e modal estiver aberto
  });

  // Se for edição, busca todos os pedidos
  const { data: todosPedidos = [], isLoading: isLoadingTodosPedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidoService.getAll,
    enabled: !!pagamento && open, // Só busca se for edição e modal estiver aberto
  });

  const createMutation = useMutation({
    mutationFn: pagamentoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos-nao-pagos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast({
        title: "Pagamento registrado",
        description: "Pagamento adicionado com sucesso.",
      });
      handleClose();
    },
    onError: (error) => {
      console.error('Erro ao criar pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o pagamento.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pagamento> }) =>
      pagamentoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast({
        title: "Pagamento atualizado",
        description: "Pagamento atualizado com sucesso.",
      });
      handleClose();
    },
    onError: (error) => {
      console.error('Erro ao atualizar pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pagamento.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (pagamento && open) {
      setFormData({
        idPedido: pagamento.idPedido.toString(),
        valorTotal: pagamento.valorTotal.toString(),
        metodoPagamento: pagamento.metodoPagamento,
      });
    } else if (open) {
      resetForm();
    }
  }, [pagamento, open]);

  const resetForm = () => {
    setFormData({
      idPedido: '',
      valorTotal: '',
      metodoPagamento: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idPedido || !formData.valorTotal || !formData.metodoPagamento) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const valorTotal = parseFloat(formData.valorTotal);
    if (isNaN(valorTotal) || valorTotal <= 0) {
      toast({
        title: "Erro",
        description: "Valor total deve ser um número positivo.",
        variant: "destructive",
      });
      return;
    }

    const pagamentoData = {
      idPedido: parseInt(formData.idPedido),
      valorTotal: valorTotal,
      metodoPagamento: formData.metodoPagamento,
    };

    if (pagamento?.idPagamento) {
      updateMutation.mutate({ id: pagamento.idPagamento, data: pagamentoData });
    } else {
      createMutation.mutate(pagamentoData);
    }
  };

  const metodosPagamento = [
    'Dinheiro',
    'Cartão de Crédito',
    'Cartão de Débito',
    'PIX',
    'Vale Refeição',
  ];

  // Usar a lista correta baseado no contexto
  const pedidosDisponiveis = pagamento ? todosPedidos : pedidos;
  const isLoadingPedidosData = pagamento ? isLoadingTodosPedidos : isLoadingPedidos;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="idPedido">Pedido</Label>
            {isLoadingPedidosData ? (
              <div className="text-center py-4 text-gray-500">
                Carregando pedidos...
              </div>
            ) : (
              <Select 
                value={formData.idPedido} 
                onValueChange={(value) => setFormData({ ...formData, idPedido: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pedido" />
                </SelectTrigger>
                <SelectContent>
                  {pedidosDisponiveis && pedidosDisponiveis.length > 0 ? (
                    pedidosDisponiveis.map((pedido) => (
                      <SelectItem key={pedido.idPedido} value={pedido.idPedido!.toString()}>
                        Pedido #{pedido.idPedido} - Mesa {pedido.idMesa}
                        {!pagamento && !pedido.pago && (
                          <span className="ml-2 text-xs text-green-600">(Disponível para pagamento)</span>
                        )}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      {pagamento ? 'Nenhum pedido encontrado' : 'Nenhum pedido não pago encontrado'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            {!pagamento && (
              <p className="text-xs text-gray-500 mt-1">
                Apenas pedidos não pagos são exibidos para novos pagamentos
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="valorTotal">Valor Total</Label>
            <Input
              id="valorTotal"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorTotal}
              onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
            <Select 
              value={formData.metodoPagamento} 
              onValueChange={(value) => setFormData({ ...formData, metodoPagamento: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                {metodosPagamento.map((metodo) => (
                  <SelectItem key={metodo} value={metodo}>
                    {metodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending || isLoadingPedidosData}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Salvando...' 
                : pagamento ? 'Atualizar' : 'Registrar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
