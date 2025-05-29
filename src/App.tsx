
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Itens from "./pages/Itens";
import Mesas from "./pages/Mesas";
import Reservas from "./pages/Reservas";
import Pedidos from "./pages/Pedidos";
import Pagamentos from "./pages/Pagamentos";
import Feedbacks from "./pages/Feedbacks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="itens" element={<Itens />} />
            <Route path="mesas" element={<Mesas />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="pagamentos" element={<Pagamentos />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
