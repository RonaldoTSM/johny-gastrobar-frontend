
import { api } from '@/lib/api';
import { Mesa } from '@/types/api';

export const mesaService = {
  getAll: () => api.get<Mesa[]>('/mesas'),
  
  getById: (id: number) => api.get<Mesa>(`/mesas/${id}`),
  
  create: (mesa: Partial<Mesa>) => api.post<Mesa>('/mesas', mesa),
  
  update: (id: number, mesa: Partial<Mesa>) => api.put<Mesa>(`/mesas/${id}`, mesa),
  
  delete: (id: number) => api.delete(`/mesas/${id}`),
};
