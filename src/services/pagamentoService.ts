
import { api } from '@/lib/api';
import { Pagamento } from '@/types/api';

export const pagamentoService = {
  getAll: () => api.get<Pagamento[]>('/pagamentos'),
  
  getById: (id: number) => api.get<Pagamento>(`/pagamentos/${id}`),
  
  getByPedido: (idPedido: number) => api.get<Pagamento>(`/pagamentos/por-pedido/${idPedido}`),
  
  create: (pagamento: Partial<Pagamento>) => api.post<Pagamento>('/pagamentos', pagamento),
  
  update: (id: number, pagamento: Partial<Pagamento>) => api.put<Pagamento>(`/pagamentos/${id}`, pagamento),
};
