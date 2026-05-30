import api from './client';

export const getVarieties = () => api.get('/varieties');
export const createVariety = (data) => api.post('/varieties', data);
export const updateVariety = (id, data) => api.put(`/varieties/${id}`, data);
export const deleteVariety = (id) => api.delete(`/varieties/${id}`);
