
import { api } from '@/lib/api';
import { FeedbackPedido } from '@/types/api';

export const feedbackService = {
  getAll: () => api.get<FeedbackPedido[]>('/feedbacks'),
  
  getById: (id: number) => api.get<FeedbackPedido>(`/feedbacks/${id}`),
  
  create: (feedback: Partial<FeedbackPedido>) => api.post<FeedbackPedido>('/feedbacks', feedback),
  
  update: (id: number, feedback: Partial<FeedbackPedido>) => api.put<FeedbackPedido>(`/feedbacks/${id}`, feedback),
  
  delete: (id: number) => api.delete(`/feedbacks/${id}`),
};
