import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import NuevoTicket from './pages/NuevoTicket';
import DetalleTicket from './pages/DetalleTicket';
import Tecnicos from './pages/Tecnicos';
import Reportes from './pages/Reportes';
import NotFound from './pages/NotFound';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Privadas con Layout */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Tickets />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/nuevo"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NuevoTicket />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DetalleTicket />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tecnicos"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <Tecnicos />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reportes />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 */}
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
