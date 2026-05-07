import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import A11yProvider from './components/accessibility/A11yProvider';

// Contextos globales
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>   {/* <--- ENVOLVER APP EN EL TEMA */}
          <A11yProvider>
            <App />
          </A11yProvider>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
