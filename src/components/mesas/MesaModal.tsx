
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mesaService } from '@/services/mesaService';
import { Mesa } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface MesaModalProps {
  open: boolean;
  onClose: () => void;
  mesa?: Mesa;
}

export function MesaModal({ open, onClose, mesa }: MesaModalProps) {
  const [formData, setFormData] = useState({
    capacidade: '',
    localizacao: '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: mesaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesas'] });
      toast({
        title: "Mesa criada",
        description: "Mesa adicionada com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a mesa.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Mesa> }) =>
      mesaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mesas'] });
      toast({
        title: "Mesa atualizada",
        description: "Mesa atualizada com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a mesa.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (mesa) {
      setFormData({
        capacidade: mesa.capacidade.toString(),
        localizacao: mesa.localizacao,
      });
    } else {
      resetForm();
    }
  }, [mesa, open]);

  const resetForm = () => {
    setFormData({
      capacidade: '',
      localizacao: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mesaData = {
      capacidade: parseInt(formData.capacidade),
      localizacao: formData.localizacao,
    };

    if (mesa) {
      updateMutation.mutate({ id: mesa.idMesa!, data: mesaData });
    } else {
      createMutation.mutate(mesaData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mesa ? 'Editar Mesa' : 'Nova Mesa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="capacidade">Capacidade</Label>
            <Input
              id="capacidade"
              type="number"
              min="1"
              value={formData.capacidade}
              onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
              placeholder="Número de pessoas"
              required
            />
          </div>

          <div>
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              placeholder="Ex: Salão principal, Área externa, VIP"
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
                : mesa ? 'Atualizar' : 'Criar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
