import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { funcionarioService } from '@/services/funcionarioService';
import { itemService } from '@/services/itemService';
import { pedidoService } from '@/services/pedidoService';
import { Funcionario, Item, Pedido, ItemDoPedido } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface PedidoModalProps {
  open: boolean;
  onClose: () => void;
  pedido?: Pedido | null;
}

export function PedidoModal({ open, onClose, pedido }: PedidoModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!pedido;

  // Estados do formulário
  const [formData, setFormData] = useState({
    idGarcom: '',
    idGerente: '',
    idMesa: '',
    desconto: '',
    entregue: false,
    pago: false,
  });

  const [itensSelecionados, setItensSelecionados] = useState<ItemDoPedido[]>([]);

  // Buscar funcionários (garçons e gerentes) para os selects
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: funcionarioService.getAll,
  });

  // Buscar itens para a seleção de itens do pedido
  const { data: itens = [] } = useQuery({
    queryKey: ['itens'],
    queryFn: itemService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: pedidoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar pedido.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pedido> }) =>
      pedidoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast({
        title: "Sucesso",
        description: "Pedido atualizado com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      console.error('Erro ao atualizar pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar pedido.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (pedido && open) {
      console.log('Editando pedido:', pedido);
      setFormData({
        idGarcom: pedido.idGarcom?.toString() || '',
        idGerente: pedido.idGerente?.toString() || '',
        idMesa: pedido.idMesa.toString(),
        desconto: pedido.desconto?.toString() || '',
        entregue: pedido.entregue || false,
        pago: pedido.pago || false,
      });
      setItensSelecionados(pedido.itensDoPedido || []);
    } else if (open) {
      console.log('Criando novo pedido');
      resetForm();
    }
  }, [pedido, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando formulário:', formData, itensSelecionados);

    if (!formData.idMesa || isNaN(parseInt(formData.idMesa))) {
      toast({
        title: "Erro",
        description: "Mesa é obrigatória e deve ser um número.",
        variant: "destructive",
      });
      return;
    }

    if (itensSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao pedido.",
        variant: "destructive",
      });
      return;
    }

    const finalData = {
      idGarcom: formData.idGarcom === '' ? null : parseInt(formData.idGarcom),
      idGerente: formData.idGerente === '' ? null : parseInt(formData.idGerente),
      idMesa: parseInt(formData.idMesa),
      desconto: formData.desconto === '' ? 0 : parseFloat(formData.desconto),
      entregue: formData.entregue,
      pago: formData.pago,
      itensDoPedido: itensSelecionados,
    };

    console.log('Dados finais para envio:', finalData);

    if (isEditing && pedido?.idPedido) {
      updateMutation.mutate({ id: pedido.idPedido, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const resetForm = () => {
    setFormData({
      idGarcom: '',
      idGerente: '',
      idMesa: '',
      desconto: '',
      entregue: false,
      pago: false,
    });
    setItensSelecionados([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const adicionarItem = (item: Item) => {
    console.log('Adicionando item:', item);
    
    if (item.idItem === null || item.idItem === undefined) {
      console.error('Item sem ID válido:', item);
      toast({
        title: "Erro",
        description: "Item selecionado não possui um ID válido.",
        variant: "destructive",
      });
      return;
    }
    
    const itemExistente = itensSelecionados.find(i => i.idItem === item.idItem);
    if (itemExistente) {
      const novosItens = itensSelecionados.map(i =>
        i.idItem === item.idItem ? { ...i, quantidade: i.quantidade + 1 } : i
      );
      setItensSelecionados(novosItens);
    } else {
      const novoItem: ItemDoPedido = {
        idItem: item.idItem,
        quantidade: 1,
        nomeItem: item.nome,
        tipoItem: item.tipo,
        precoUnitario: item.preco,
      };
      console.log('Novo item adicionado:', novoItem);
      setItensSelecionados([...itensSelecionados, novoItem]);
    }
  };

  const removerItem = (idItem: number) => {
    const novosItens = itensSelecionados.filter(item => item.idItem !== idItem);
    setItensSelecionados(novosItens);
  };

  const atualizarQuantidade = (idItem: number, quantidade: number) => {
    if (quantidade < 1) return;
    const novosItens = itensSelecionados.map(item =>
      item.idItem === idItem ? { ...item, quantidade } : item
    );
    setItensSelecionados(novosItens);
  };

  const calcularTotal = () => {
    return itensSelecionados.reduce((total, item) => {
      return total + (item.quantidade * (item.precoUnitario || 0));
    }, 0);
  };

  // Filtrar funcionários com verificação de segurança
  const garcoms = funcionarios.filter(func => func && func.tipo === 'Garcom');
  const gerentes = funcionarios.filter(func => func && func.tipo === 'Gerente');

  console.log('Funcionários carregados:', funcionarios);
  console.log('Garçons:', garcoms);
  console.log('Gerentes:', gerentes);
  console.log('Itens carregados:', itens);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Pedido' : 'Novo Pedido'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifique os detalhes do pedido existente.' : 'Preencha os detalhes para criar um novo pedido.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="garcom">Garçom</Label>
                <Select value={formData.idGarcom} onValueChange={(value) => setFormData({ ...formData, idGarcom: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um garçom" />
                  </SelectTrigger>
                  <SelectContent>
                    {garcoms.map((garcom) => (
                      <SelectItem key={garcom.id} value={garcom.id!.toString()}>
                        {garcom.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gerente">Gerente</Label>
                <Select value={formData.idGerente} onValueChange={(value) => setFormData({ ...formData, idGerente: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gerente" />
                  </SelectTrigger>
                  <SelectContent>
                    {gerentes.map((gerente) => (
                      <SelectItem key={gerente.id} value={gerente.id!.toString()}>
                        {gerente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mesa">Mesa</Label>
                <Input
                  id="mesa"
                  type="number"
                  value={formData.idMesa}
                  onChange={(e) => setFormData({ ...formData, idMesa: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="desconto">Desconto (%)</Label>
                <Input
                  id="desconto"
                  type="number"
                  step="0.01"
                  value={formData.desconto}
                  onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                />
              </div>

              <div className="col-span-2 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    id="entregue"
                    type="checkbox"
                    checked={formData.entregue}
                    onChange={(e) => setFormData({ ...formData, entregue: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="entregue">Entregue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="pago"
                    type="checkbox"
                    checked={formData.pago}
                    onChange={(e) => setFormData({ ...formData, pago: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="pago">Pago</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Itens */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {itens && itens.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {itens.map((item) => (
                    <Card key={item.idItem} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <span className="text-sm font-medium">{item.nome}</span>
                        <span className="text-xs text-gray-500">
                          {item.tipo} - R$ {item.preco?.toFixed(2) || '0.00'}
                        </span>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={() => adicionarItem(item)}
                        >
                          Adicionar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Carregando itens...
                </div>
              )}

              {itensSelecionados.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-2">Itens Selecionados:</h3>
                  <ul className="space-y-2">
                    {itensSelecionados.map((item) => (
                      <li key={item.idItem} className="flex items-center justify-between">
                        <div>
                          {item.nomeItem} ({item.tipoItem}) - R$ {item.precoUnitario?.toFixed(2) || '0.00'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => atualizarQuantidade(item.idItem!, item.quantidade - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantidade}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => atualizarQuantidade(item.idItem!, item.quantidade + 1)}
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removerItem(item.idItem!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-bold">
                    Total: R$ {calcularTotal().toFixed(2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
