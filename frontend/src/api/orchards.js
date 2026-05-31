import api from './client';

export const getOrchards = () => api.get('/orchards');
export const getOrchard = (id) => api.get(`/orchards/${id}`);
export const createOrchard = (data) => api.post('/orchards', data);
export const updateOrchard = (id, data) => api.put(`/orchards/${id}`, data);
export const deleteOrchard = (id) => api.delete(`/orchards/${id}`);
