
import { api } from '@/lib/api';
import { Funcionario } from '@/types/api';

export const funcionarioService = {
  getAll: () => api.get<Funcionario[]>('/funcionarios'),
  
  getById: (id: number) => api.get<Funcionario>(`/funcionarios/${id}`),
  
  create: (funcionario: Partial<Funcionario>) => api.post<Funcionario>('/funcionarios', funcionario),
  
  update: (id: number, funcionario: Partial<Funcionario>) => api.put<Funcionario>(`/funcionarios/${id}`, funcionario),
  
  delete: (id: number) => api.delete(`/funcionarios/${id}`),
};
