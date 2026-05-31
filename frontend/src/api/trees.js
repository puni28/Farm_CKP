import api from './client';

export const getTrees = (orchardId, filters = {}) => {
  const params = { orchardId, ...filters };
  Object.keys(params).forEach(k => (params[k] == null || params[k] === '') && delete params[k]);
  return api.get('/trees', { params });
};

export const getTree = (id) => api.get(`/trees/${id}`);
export const createTree = (data) => api.post('/trees', data);
export const updateTree = (id, data) => api.put(`/trees/${id}`, data);
export const deleteTree = (id) => api.delete(`/trees/${id}`);
export const getDashboard = () => api.get('/trees/dashboard');
