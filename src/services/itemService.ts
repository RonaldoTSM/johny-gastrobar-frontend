
import { api } from '@/lib/api';
import { Item } from '@/types/api';

export const itemService = {
  getAll: () => api.get<Item[]>('/itens'),
  
  getById: (id: number) => api.get<Item>(`/itens/${id}`),
  
  create: (item: Partial<Item>) => api.post<Item>('/itens', item),
  
  update: (id: number, item: Partial<Item>) => api.put<Item>(`/itens/${id}`, item),
  
  delete: (id: number) => api.delete(`/itens/${id}`),
};
