import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 1. Creo una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_BASE, // Backend
});

// Devuelve la URL completa hacia /uploads teniendo en cuenta el host real
export const uploadsUrl = (fileName: string) => {
  if (!fileName) return '';
  if (/^https?:\/\//i.test(fileName)) return fileName;

  const apiBase = api.defaults.baseURL || API_BASE;
  const normalized = fileName.replace(/^\/?uploads\//i, '');
  try {
    const apiUrl = new URL(apiBase);
    // Quitar sufijo /api para apuntar a la raíz del servidor
    apiUrl.pathname = apiUrl.pathname.replace(/\/api\/?$/, '/');
    return new URL(`/uploads/${normalized}`, apiUrl).toString();
  } catch {
    return `/uploads/${normalized}`;
  }
};

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