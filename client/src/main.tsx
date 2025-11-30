// main.tsx o index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Contextos globales
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext'; // <--- IMPORTANTE

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>   {/* <--- ENVOLVER APP EN EL TEMA */}
          <App />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
