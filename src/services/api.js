import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
});

// GET all todos from API
export const fetchApiTodos = () => api.get('/todos?_limit=20');

// GET single todo
export const fetchApiTodo = (id) => api.get(`/todos/${id}`);

// POST new todo to API
export const createApiTodo = (data) => api.post('/todos', data);

// PUT update todo on API
export const updateApiTodo = (id, data) => api.put(`/todos/${id}`, data);

// DELETE todo from API
export const deleteApiTodo = (id) => api.delete(`/todos/${id}`);

// GET users (used to simulate login)
export const fetchUsers = () => api.get('/users');

export default api;
