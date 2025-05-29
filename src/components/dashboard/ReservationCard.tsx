
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ReservationSummary } from '@/services/dashboardService';

interface ReservationCardProps {
  reservasHoje: ReservationSummary | null;
  reservasAmanha: ReservationSummary | null;
}

export function ReservationCard({ reservasHoje, reservasAmanha }: ReservationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Reservas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservasHoje && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">Hoje</span>
                <span className="font-bold text-blue-700">{reservasHoje.totalReservasHoje} reservas</span>
              </div>
              <p className="text-sm text-gray-600">
                {reservasHoje.totalPessoasEsperadasHoje} pessoas esperadas
              </p>
            </div>
          )}
          
          {reservasAmanha && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">Amanhã</span>
                <span className="font-bold text-green-700">{reservasAmanha.totalReservasAmanha} reservas</span>
              </div>
              <p className="text-sm text-gray-600">
                {reservasAmanha.totalPessoasEsperadasAmanha} pessoas esperadas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
