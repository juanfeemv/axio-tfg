import axios, { InternalAxiosRequestConfig } from 'axios';

// 1. Creo una instancia de axios con la URL base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend
});

// 2. El Interceptor (Es el "portero" que revisa cada petición antes de salir)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Buscamos si hay un token guardado en el navegador
  const token = localStorage.getItem('token');
  
  // Si hay token, lo pegamos en la cabecera como si fuera un sello
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error: any) => {
  return Promise.reject(error);
});

export default api;