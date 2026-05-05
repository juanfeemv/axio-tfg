import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importo las páginas
import { Home, Login, Register, Messages, Dashboard, ProjectView, Profile, ForgotPassword, ResetPassword, Admin } from './pages';

// Componente para proteger rutas (Si no estás logueado, te echa al Login)
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para proteger rutas de SOLO ADMINS
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas Privadas (Solo usuarios logueados) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Ver un proyecto específico por su ID */}
          <Route
            path="/project/:id"
            element={
              <PrivateRoute>
                <ProjectView />
              </PrivateRoute>
            }
          />

          {/* Mensajes directos */}
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages/:username"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />

          {/* Perfil público de usuario */}
          <Route path="/u/:username" element={<Profile />} />

          {/* Ruta SOLO para Admins */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Por defecto, ir al dashboard (o al login si no hay sesión) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;