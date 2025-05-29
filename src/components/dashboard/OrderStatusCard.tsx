
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { PedidoStatusCount } from '@/services/dashboardService';

interface OrderStatusCardProps {
  pedidosStatus: PedidoStatusCount | null;
}

export function OrderStatusCard({ pedidosStatus }: OrderStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
          Status dos Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pedidosStatus ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-gray-700">Pendentes</span>
              <span className="font-bold text-yellow-700">{pedidosStatus.PENDENTE}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-700">Entregues (Não Pagos)</span>
              <span className="font-bold text-blue-700">{pedidosStatus.ENTREGUE_NAO_PAGO}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-700">Pagos</span>
              <span className="font-bold text-green-700">{pedidosStatus.PAGO}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Carregando status dos pedidos...</p>
        )}
      </CardContent>
    </Card>
  );
}
