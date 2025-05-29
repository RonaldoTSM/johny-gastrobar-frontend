import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart,
  Users,
  Coffee,
  MapPin,
  Calendar,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: BarChart },
  { path: '/funcionarios', label: 'Funcionários', icon: Users },
  { path: '/itens', label: 'Cardápio', icon: Coffee },
  { path: '/mesas', label: 'Mesas', icon: MapPin },
  { path: '/reservas', label: 'Reservas', icon: Calendar },
  { path: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { path: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { path: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800 truncate">Johny GastroBar</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex-shrink-0"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <nav className="p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${!sidebarOpen && 'px-3 justify-center'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 truncate">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="text-sm text-gray-600 hidden sm:block">
              Sistema de Gestão do Bar
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
