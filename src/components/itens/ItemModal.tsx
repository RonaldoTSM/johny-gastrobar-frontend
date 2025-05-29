
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  item?: Item;
}

export function ItemModal({ open, onClose, item }: ItemModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Bebida' as Item['tipo'],
    preco: '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: itemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens'] });
      toast({
        title: "Item criado",
        description: "Item adicionado ao cardápio com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o item.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) =>
      itemService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens'] });
      toast({
        title: "Item atualizado",
        description: "Item atualizado com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        tipo: item.tipo,
        preco: item.preco.toString(),
      });
    } else {
      resetForm();
    }
  }, [item, open]);

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'Bebida',
      preco: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      nome: formData.nome,
      tipo: formData.tipo,
      preco: parseFloat(formData.preco),
    };

    if (item) {
      updateMutation.mutate({ id: item.idItem!, data: itemData });
    } else {
      createMutation.mutate(itemData);
    }
  };

  const tiposItem = [
    'Bebida',
    'Prato Principal',
    'Entrada',
    'Sobremesa',
    'Petisco',
    'Outro'
  ] as const;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Item' : 'Novo Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome do item"
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: Item['tipo']) => 
                setFormData({ ...formData, tipo: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiposItem.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preco">Preço</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Salvando...' 
                : item ? 'Atualizar' : 'Criar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
