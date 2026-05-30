import api from './client';

export const getYields = (treeId) => api.get('/yields', { params: { treeId } });
export const createYield = (data) => api.post('/yields', data);
export const deleteYield = (id) => api.delete(`/yields/${id}`);
