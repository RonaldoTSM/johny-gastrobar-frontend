
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';
import { FeedbackPedido } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { FeedbackModal } from '@/components/feedbacks/FeedbackModal';
import { toast } from '@/hooks/use-toast';

export default function Feedbacks() {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackPedido | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: feedbackService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: feedbackService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Feedback excluído",
        description: "Feedback removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o feedback.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (feedback: FeedbackPedido) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este feedback?')) {
      deleteMutation.mutate(id);
    }
  };

  const mediaComida = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + (f.notaComida || 0), 0) / feedbacks.length 
    : 0;
  const mediaAtendimento = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + (f.notaAtendimento || 0), 0) / feedbacks.length 
    : 0;

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < nota ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando feedbacks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Feedback
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Comida</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaComida.toFixed(1)}</div>
            <div className="flex mt-1">
              {renderStars(Math.round(mediaComida))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Atendimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaAtendimento.toFixed(1)}</div>
            <div className="flex mt-1">
              {renderStars(Math.round(mediaAtendimento))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Feedbacks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Comida</TableHead>
                <TableHead>Atendimento</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.idFeedback}>
                  <TableCell>{feedback.idFeedback}</TableCell>
                  <TableCell>{feedback.nomeClienteFeedback}</TableCell>
                  <TableCell>Mesa {feedback.idMesa}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {renderStars(feedback.notaComida || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {renderStars(feedback.notaAtendimento || 0)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.comentarioTexto}
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.dataFeedback || '').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(feedback)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(feedback.idFeedback!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {feedbacks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhum feedback encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <FeedbackModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFeedback(undefined);
        }}
        feedback={selectedFeedback}
      />
    </div>
  );
}
