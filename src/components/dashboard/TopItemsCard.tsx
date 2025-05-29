
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coffee } from 'lucide-react';
import { TopItemInfo } from '@/services/dashboardService';

interface TopItemsCardProps {
  topVendidos: TopItemInfo[];
}

export function TopItemsCard({ topVendidos }: TopItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Coffee className="h-5 w-5 mr-2 text-green-600" />
          Top 5 Mais Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topVendidos.length > 0 ? (
          <div className="space-y-3">
            {topVendidos.map((item, index) => (
              <div key={item.nomeItem} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{item.nomeItem}</span>
                </div>
                <span className="font-bold text-green-600">{item.valorAgregado} unidades</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum item vendido no período</p>
        )}
      </CardContent>
    </Card>
  );
}
