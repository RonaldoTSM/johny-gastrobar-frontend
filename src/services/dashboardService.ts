
import { api } from '@/lib/api';

// Interfaces para os retornos do dashboard
export interface FinancialMetrics {
  faturamentoBrutoTotal: number;
  ticketMedioPorPedido: number;
}

export interface TopItemInfo {
  nomeItem: string;
  valorAgregado: number;
}

export interface PedidoStatusCount {
  PENDENTE: number;
  ENTREGUE_NAO_PAGO: number;
  PAGO: number;
}

export interface ReservationSummary {
  totalReservasHoje: number;
  totalPessoasEsperadasHoje: number;
  totalReservasAmanha: number;
  totalPessoasEsperadasAmanha: number;
}

export interface QualityMetrics {
  notaMediaComida: number | null;
  notaMediaAtendimento: number | null;
  totalFeedbacksRecebidos: number;
}

class DashboardService {
  // Métricas financeiras
  async getFinancialMetrics(dataInicial: string, dataFinal: string): Promise<FinancialMetrics> {
    return api.get<FinancialMetrics>(`/dashboard/financeiro?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  }

  // Top itens mais vendidos
  async getTopItemsMaisVendidos(dataInicial: string, dataFinal: string, limite: number = 5): Promise<TopItemInfo[]> {
    return api.get<TopItemInfo[]>(`/dashboard/vendas/top-itens-mais-vendidos?dataInicial=${dataInicial}&dataFinal=${dataFinal}&limite=${limite}`);
  }

  // Top itens mais rentáveis
  async getTopItemsMaisRentaveis(dataInicial: string, dataFinal: string, limite: number = 5): Promise<TopItemInfo[]> {
    return api.get<TopItemInfo[]>(`/dashboard/vendas/top-itens-mais-rentaveis?dataInicial=${dataInicial}&dataFinal=${dataFinal}&limite=${limite}`);
  }

  // Total de unidades vendidas
  async getTotalUnidadesVendidas(dataInicial: string, dataFinal: string): Promise<number> {
    return api.get<number>(`/dashboard/vendas/total-unidades-vendidas?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  }

  // Contagem de pedidos criados
  async getContagemPedidosCriados(dataInicial: string, dataFinal: string): Promise<number> {
    return api.get<number>(`/dashboard/pedidos/contagem-criados?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  }

  // Contagem de pedidos por status
  async getContagemPedidosPorStatus(dataInicial: string, dataFinal: string): Promise<PedidoStatusCount> {
    return api.get<PedidoStatusCount>(`/dashboard/pedidos/contagem-por-status?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  }

  // Reservas de hoje
  async getReservasHoje(): Promise<ReservationSummary> {
    return api.get<ReservationSummary>('/dashboard/reservas/hoje');
  }

  // Reservas de amanhã
  async getReservasAmanha(): Promise<ReservationSummary> {
    return api.get<ReservationSummary>('/dashboard/reservas/amanha');
  }

  // Métricas de qualidade/feedback
  async getQualityMetrics(dataInicial: string, dataFinal: string): Promise<QualityMetrics> {
    return api.get<QualityMetrics>(`/dashboard/qualidade/metricas-feedback?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  }
}

export const dashboardService = new DashboardService();
