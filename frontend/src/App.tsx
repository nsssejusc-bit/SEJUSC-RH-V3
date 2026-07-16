import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"; // Corrigido para react-router-dom
import { Toaster } from "sonner";

import AuthProvider from "@/context/AuthProvider";
import {
  DashboardPage,
  DesenvolvidoPage,
  FeriadosPage, // Página adicionada
  FrequenciaPage,
  FuncionariosPage,
  HistoricoPage,
  LoginPage,
} from "@/pages";

import PrivateLayout from "./shared/PrivateLayout";
import ProtectedRoute from "./shared/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/desenvolvido" element={<DesenvolvidoPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/frequencia" element={<FrequenciaPage />} />
              <Route path="/funcionarios" element={<FuncionariosPage />} />
              <Route path="/historico" element={<HistoricoPage />} />
              {/* NOVA ROTA ADICIONADA AQUI */}
              <Route path="/feriados" element={<FeriadosPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}
