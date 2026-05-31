import api from './client';

export const getAllDropdownOptions = () => api.get('/dropdown-options');
export const getDropdownOptions = (category) => api.get('/dropdown-options', { params: { category } });
export const createDropdownOption = (category, data) => api.post(`/dropdown-options/${category}`, data);
export const updateDropdownOption = (id, data) => api.put(`/dropdown-options/${id}`, data);
export const deleteDropdownOption = (id) => api.delete(`/dropdown-options/${id}`);
