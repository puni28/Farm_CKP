import api from './client';

export const getInspections = (treeId) => api.get('/inspections', { params: { treeId } });
export const createInspection = (data) => api.post('/inspections', data);
export const deleteInspection = (id) => api.delete(`/inspections/${id}`);
