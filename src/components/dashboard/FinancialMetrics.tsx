
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { FinancialMetrics as FinancialMetricsType } from '@/services/dashboardService';

interface FinancialMetricsProps {
  financial: FinancialMetricsType | null;
}

export function FinancialMetrics({ financial }: FinancialMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">Faturamento Bruto</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {financial ? `R$ ${financial.faturamentoBrutoTotal.toFixed(2)}` : 'R$ 0,00'}
              </p>
            </div>
            <div className="bg-green-50 p-2 lg:p-3 rounded-full flex-shrink-0 ml-3">
              <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
