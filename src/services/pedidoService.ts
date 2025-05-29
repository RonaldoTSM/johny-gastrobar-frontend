
import { api } from '@/lib/api';
import { Pedido } from '@/types/api';

export const pedidoService = {
  getAll: () => api.get<Pedido[]>('/pedidos'),
  
  getById: (id: number) => api.get<Pedido>(`/pedidos/${id}`),
  
  getNaoPagos: () => api.get<Pedido[]>('/pedidos/nao-pagos'),
  
  create: (pedido: Partial<Pedido>) => api.post<Pedido>('/pedidos', pedido),
  
  update: (id: number, pedido: Partial<Pedido>) => api.put<Pedido>(`/pedidos/${id}`, pedido),
  
  delete: (id: number) => api.delete(`/pedidos/${id}`),
};
