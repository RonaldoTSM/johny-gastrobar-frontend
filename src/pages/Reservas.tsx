
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservaService } from '@/services/reservaService';
import { Reserva } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, Clock, Users } from 'lucide-react';
import { ReservaModal } from '@/components/reservas/ReservaModal';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Reservas = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | undefined>();
  const queryClient = useQueryClient();

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: reservaService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: reservaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast({
        title: "Reserva cancelada",
        description: "Reserva cancelada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a reserva.",
        variant: "destructive",
      });
    },
  });

  // Separar reservas por data
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const reservasAgendadas = reservas.filter(reserva => {
    const dataReserva = new Date(reserva.dataReserva);
    dataReserva.setHours(0, 0, 0, 0);
    return dataReserva >= hoje;
  });

  const reservasAnteriores = reservas.filter(reserva => {
    const dataReserva = new Date(reserva.dataReserva);
    dataReserva.setHours(0, 0, 0, 0);
    return dataReserva < hoje;
  });

  const handleEdit = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReserva(undefined);
  };

  const renderReservaTable = (reservasList: Reserva[], showActions = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Responsável</TableHead>
          <TableHead>Mesa</TableHead>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Pessoas</TableHead>
          <TableHead>Observação</TableHead>
          {showActions && <TableHead className="w-32">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservasList.map((reserva) => (
          <TableRow key={reserva.idReserva}>
            <TableCell className="font-medium">
              {reserva.nomeResponsavel}
            </TableCell>
            <TableCell>
              <Badge variant="outline">Mesa {reserva.idMesa}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(reserva.dataReserva), 'dd/MM/yyyy')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  {reserva.horaReserva}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {reserva.numeroPessoas}
              </div>
            </TableCell>
            <TableCell>
              {reserva.observacao || '-'}
            </TableCell>
            {showActions && (
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(reserva)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(reserva.idReserva!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return <div className="p-6">Carregando reservas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reservas</h1>
          <p className="text-gray-600">Gerencie as reservas do estabelecimento</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      {/* Reservas Agendadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <Calendar className="mr-2 h-5 w-5" />
            Reservas Agendadas ({reservasAgendadas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasAgendadas.length > 0 ? (
            renderReservaTable(reservasAgendadas, true)
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhuma reserva agendada
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reservas Anteriores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-600">
            <Calendar className="mr-2 h-5 w-5" />
            Reservas Anteriores ({reservasAnteriores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasAnteriores.length > 0 ? (
            renderReservaTable(reservasAnteriores, false)
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhuma reserva anterior
            </p>
          )}
        </CardContent>
      </Card>

      <ReservaModal
        open={modalOpen}
        onClose={handleCloseModal}
        reserva={selectedReserva}
      />
    </div>
  );
};

export default Reservas;
