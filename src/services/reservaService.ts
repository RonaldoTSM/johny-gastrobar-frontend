
import { api } from '@/lib/api';
import { Reserva } from '@/types/api';

export const reservaService = {
  getAll: () => api.get<Reserva[]>('/reservas'),
  
  getById: (id: number) => api.get<Reserva>(`/reservas/${id}`),
  
  getByDate: (date: string) => api.get<Reserva[]>(`/reservas/por-data?data=${date}`),
  
  create: (reserva: Partial<Reserva>) => api.post<Reserva>('/reservas', reserva),
  
  update: (id: number, reserva: Partial<Reserva>) => api.put<Reserva>(`/reservas/${id}`, reserva),
  
  delete: (id: number) => api.delete(`/reservas/${id}`),
};
