
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import { QualityMetrics } from '@/services/dashboardService';

interface QualityMetricsCardProps {
  quality: QualityMetrics | null;
}

export function QualityMetricsCard({ quality }: QualityMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-600" />
          Métricas de Qualidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quality ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">
                    {quality.notaMediaComida?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Nota Comida</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-blue-500 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">
                    {quality.notaMediaAtendimento?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Nota Atendimento</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Total de Feedbacks</span>
              </div>
              <span className="font-bold text-gray-900">{quality.totalFeedbacksRecebidos}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Carregando métricas de qualidade...</p>
        )}
      </CardContent>
    </Card>
  );
}
