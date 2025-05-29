
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';
import { pedidoService } from '@/services/pedidoService';
import { mesaService } from '@/services/mesaService';
import { FeedbackPedido } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback?: FeedbackPedido;
}

export function FeedbackModal({ open, onClose, feedback }: FeedbackModalProps) {
  const [formData, setFormData] = useState({
    idPedido: '',
    idMesa: '',
    nomeClienteFeedback: '',
    notaComida: 0,
    notaAtendimento: 0,
    comentarioTexto: '',
  });

  const queryClient = useQueryClient();

  // Buscar todos os pedidos para edição, ou pedidos do dia para novo feedback
  const { data: todosPedidos = [] } = useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidoService.getAll,
  });

  const { data: mesas = [] } = useQuery({
    queryKey: ['mesas'],
    queryFn: mesaService.getAll,
  });

  // Filtrar pedidos do dia atual para novos feedbacks
  const pedidosDodia = todosPedidos.filter(pedido => {
    if (feedback) return true; // Se for edição, permite todos os pedidos
    
    if (!pedido.dataHora) return false;
    
    const hoje = new Date();
    const dataPedido = new Date(pedido.dataHora);
    
    return (
      dataPedido.getDate() === hoje.getDate() &&
      dataPedido.getMonth() === hoje.getMonth() &&
      dataPedido.getFullYear() === hoje.getFullYear()
    );
  });

  const createMutation = useMutation({
    mutationFn: feedbackService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Feedback registrado",
        description: "Feedback adicionado com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o feedback.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FeedbackPedido> }) =>
      feedbackService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Feedback atualizado",
        description: "Feedback atualizado com sucesso.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o feedback.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        idPedido: feedback.idPedido.toString(),
        idMesa: feedback.idMesa.toString(),
        nomeClienteFeedback: feedback.nomeClienteFeedback || '',
        notaComida: feedback.notaComida || 0,
        notaAtendimento: feedback.notaAtendimento || 0,
        comentarioTexto: feedback.comentarioTexto || '',
      });
    } else {
      resetForm();
    }
  }, [feedback, open]);

  const resetForm = () => {
    setFormData({
      idPedido: '',
      idMesa: '',
      nomeClienteFeedback: '',
      notaComida: 0,
      notaAtendimento: 0,
      comentarioTexto: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedbackData = {
      idPedido: parseInt(formData.idPedido),
      idMesa: parseInt(formData.idMesa),
      nomeClienteFeedback: formData.nomeClienteFeedback,
      notaComida: formData.notaComida,
      notaAtendimento: formData.notaAtendimento,
      comentarioTexto: formData.comentarioTexto,
    };

    if (feedback) {
      updateMutation.mutate({ id: feedback.idFeedback!, data: feedbackData });
    } else {
      createMutation.mutate(feedbackData);
    }
  };

  const renderStarRating = (rating: number, setRating: (rating: number) => void, label: string) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {feedback ? 'Editar Feedback' : 'Novo Feedback'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nomeClienteFeedback">Nome do Cliente</Label>
            <Input
              id="nomeClienteFeedback"
              value={formData.nomeClienteFeedback}
              onChange={(e) => setFormData({ ...formData, nomeClienteFeedback: e.target.value })}
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idPedido">Pedido</Label>
              <Select value={formData.idPedido} onValueChange={(value) => setFormData({ ...formData, idPedido: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {pedidosDodia.map((pedido) => (
                    <SelectItem key={pedido.idPedido} value={pedido.idPedido!.toString()}>
                      Pedido #{pedido.idPedido}
                      {!feedback && (
                        <span className="ml-2 text-xs text-blue-600">(Hoje)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!feedback && pedidosDodia.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Nenhum pedido do dia atual disponível
                </p>
              )}
              {!feedback && pedidosDodia.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Apenas pedidos de hoje podem receber feedback
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="idMesa">Mesa</Label>
              <Select value={formData.idMesa} onValueChange={(value) => setFormData({ ...formData, idMesa: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mesas.map((mesa) => (
                    <SelectItem key={mesa.idMesa} value={mesa.idMesa!.toString()}>
                      Mesa {mesa.idMesa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderStarRating(
            formData.notaComida,
            (rating) => setFormData({ ...formData, notaComida: rating }),
            'Nota da Comida'
          )}

          {renderStarRating(
            formData.notaAtendimento,
            (rating) => setFormData({ ...formData, notaAtendimento: rating }),
            'Nota do Atendimento'
          )}

          <div>
            <Label htmlFor="comentarioTexto">Comentário</Label>
            <Textarea
              id="comentarioTexto"
              value={formData.comentarioTexto}
              onChange={(e) => setFormData({ ...formData, comentarioTexto: e.target.value })}
              placeholder="Comentários do cliente"
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
                : feedback ? 'Atualizar' : 'Registrar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
