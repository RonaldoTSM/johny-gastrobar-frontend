
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { reservaService } from '@/services/reservaService';
import { mesaService } from '@/services/mesaService';
import { Reserva } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ReservaModalProps {
  open: boolean;
  onClose: () => void;
  reserva?: Reserva;
}

export function ReservaModal({ open, onClose, reserva }: ReservaModalProps) {
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    numeroPessoas: '',
    idMesa: '',
    dataReserva: '',
    horaReserva: '',
    observacao: '',
  });

  const queryClient = useQueryClient();

  const { data: mesas = [] } = useQuery({
    queryKey: ['mesas'],
    queryFn: mesaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: reservaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast({
        title: "Reserva criada",
        description: "Reserva adicionada com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a reserva.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Reserva> }) =>
      reservaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast({
        title: "Reserva atualizada",
        description: "Reserva atualizada com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a reserva.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (reserva) {
      setFormData({
        nomeResponsavel: reserva.nomeResponsavel,
        numeroPessoas: reserva.numeroPessoas.toString(),
        idMesa: reserva.idMesa.toString(),
        dataReserva: reserva.dataReserva,
        horaReserva: reserva.horaReserva,
        observacao: reserva.observacao || '',
      });
    } else {
      resetForm();
    }
  }, [reserva, open]);

  const resetForm = () => {
    setFormData({
      nomeResponsavel: '',
      numeroPessoas: '',
      idMesa: '',
      dataReserva: '',
      horaReserva: '',
      observacao: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reservaData = {
      nomeResponsavel: formData.nomeResponsavel,
      numeroPessoas: parseInt(formData.numeroPessoas),
      idMesa: parseInt(formData.idMesa),
      dataReserva: formData.dataReserva,
      horaReserva: formData.horaReserva,
      observacao: formData.observacao || undefined,
    };

    if (reserva) {
      updateMutation.mutate({ id: reserva.idReserva!, data: reservaData });
    } else {
      createMutation.mutate(reservaData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {reserva ? 'Editar Reserva' : 'Nova Reserva'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
            <Input
              id="nomeResponsavel"
              value={formData.nomeResponsavel}
              onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
              placeholder="Nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="numeroPessoas">Número de Pessoas</Label>
            <Input
              id="numeroPessoas"
              type="number"
              min="1"
              value={formData.numeroPessoas}
              onChange={(e) => setFormData({ ...formData, numeroPessoas: e.target.value })}
              placeholder="Quantidade de pessoas"
              required
            />
          </div>

          <div>
            <Label htmlFor="idMesa">Mesa</Label>
            <Select value={formData.idMesa} onValueChange={(value) => setFormData({ ...formData, idMesa: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma mesa" />
              </SelectTrigger>
              <SelectContent>
                {mesas.map((mesa) => (
                  <SelectItem key={mesa.idMesa} value={mesa.idMesa!.toString()}>
                    Mesa {mesa.idMesa} - {mesa.capacidade} pessoas ({mesa.localizacao})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dataReserva">Data da Reserva</Label>
            <Input
              id="dataReserva"
              type="date"
              value={formData.dataReserva}
              onChange={(e) => setFormData({ ...formData, dataReserva: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="horaReserva">Horário</Label>
            <Input
              id="horaReserva"
              type="time"
              value={formData.horaReserva}
              onChange={(e) => setFormData({ ...formData, horaReserva: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              placeholder="Observações adicionais (opcional)"
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
                : reserva ? 'Atualizar' : 'Criar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
