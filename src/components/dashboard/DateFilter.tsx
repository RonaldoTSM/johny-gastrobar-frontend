
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon } from 'lucide-react';
import { formatDateForAPI } from '@/lib/api';

interface DateFilterProps {
  onDateRangeChange: (dataInicial: string, dataFinal: string) => void;
  loading?: boolean;
}

export function DateFilter({ onDateRangeChange, loading }: DateFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('hoje');

  const getDateRange = (period: string): { dataInicial: string; dataFinal: string } => {
    const hoje = new Date();
    const dataFinal = formatDateForAPI(hoje);
    
    switch (period) {
      case 'hoje':
        return { dataInicial: dataFinal, dataFinal };
      
      case 'semana':
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - 7);
        return { dataInicial: formatDateForAPI(inicioSemana), dataFinal };
      
      case 'mes':
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        return { dataInicial: formatDateForAPI(inicioMes), dataFinal };
      
      case 'total':
        const inicioTotal = new Date('2020-01-01'); // Data bem antiga para pegar tudo
        return { dataInicial: formatDateForAPI(inicioTotal), dataFinal };
      
      default:
        return { dataInicial: dataFinal, dataFinal };
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const { dataInicial, dataFinal } = getDateRange(period);
    onDateRangeChange(dataInicial, dataFinal);
  };

  const periods = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'semana', label: 'Últimos 7 dias' },
    { key: 'mes', label: 'Este mês' },
    { key: 'total', label: 'Total geral' },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">Período:</span>
          </div>
          
          <div className="flex space-x-2">
            {periods.map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange(period.key)}
                disabled={loading}
                className="text-xs"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
