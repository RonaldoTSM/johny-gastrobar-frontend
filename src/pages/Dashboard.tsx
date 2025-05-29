import { useEffect, useState } from 'react';
import { DateFilter } from '@/components/dashboard/DateFilter';
import { FinancialMetrics } from '@/components/dashboard/FinancialMetrics';
import { ReservationCard } from '@/components/dashboard/ReservationCard';
import { TopItemsCard } from '@/components/dashboard/TopItemsCard';
import { 
  dashboardService, 
  FinancialMetrics as FinancialMetricsType, 
  TopItemInfo, 
  ReservationSummary 
} from '@/services/dashboardService';
import { formatDateForAPI } from '@/lib/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    dataInicial: formatDateForAPI(new Date()),
    dataFinal: formatDateForAPI(new Date()),
  });

  const [metrics, setMetrics] = useState({
    financial: null as FinancialMetricsType | null,
    topVendidos: [] as TopItemInfo[],
    topRentaveis: [] as TopItemInfo[],
    reservasHoje: null as ReservationSummary | null,
    reservasAmanha: null as ReservationSummary | null,
  });

  const fetchDashboardData = async (dataInicial: string, dataFinal: string) => {
    setLoading(true);
    try {
      console.log('Buscando dados do dashboard:', { dataInicial, dataFinal });

      const [
        financial,
        topVendidos,
        topRentaveis,
        reservasHoje,
        reservasAmanha,
      ] = await Promise.all([
        dashboardService.getFinancialMetrics(dataInicial, dataFinal),
        dashboardService.getTopItemsMaisVendidos(dataInicial, dataFinal, 5),
        dashboardService.getTopItemsMaisRentaveis(dataInicial, dataFinal, 5),
        dashboardService.getReservasHoje(),
        dashboardService.getReservasAmanha(),
      ]);

      setMetrics({
        financial,
        topVendidos,
        topRentaveis,
        reservasHoje,
        reservasAmanha,
      });

      console.log('Dados carregados:', {
        financial,
        topVendidos,
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dataInicial: string, dataFinal: string) => {
    setDateRange({ dataInicial, dataFinal });
    fetchDashboardData(dataInicial, dataFinal);
  };

  useEffect(() => {
    // Carregar dados iniciais (hoje)
    fetchDashboardData(dateRange.dataInicial, dateRange.dataFinal);
  }, []);

  if (loading && !metrics.financial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <DateFilter onDateRangeChange={handleDateRangeChange} loading={loading} />

      {/* Main KPI Cards */}
      <FinancialMetrics financial={metrics.financial} />

      {/* Reservas e Top Itens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReservationCard 
          reservasHoje={metrics.reservasHoje}
          reservasAmanha={metrics.reservasAmanha}
        />
        <TopItemsCard topVendidos={metrics.topVendidos} />
      </div>
    </div>
  );
}
