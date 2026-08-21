import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/templates/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProdutoresPage } from './pages/ProdutoresPage';
import { PropriedadesPage } from './pages/PropriedadesPage';
import { SafrasPage } from './pages/SafrasPage';
import { CulturasPage } from './pages/CulturasPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtores"
        element={
          <ProtectedRoute>
            <ProdutoresPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/propriedades"
        element={
          <ProtectedRoute>
            <PropriedadesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/safras"
        element={
          <ProtectedRoute>
            <SafrasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/culturas"
        element={
          <ProtectedRoute>
            <CulturasPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
