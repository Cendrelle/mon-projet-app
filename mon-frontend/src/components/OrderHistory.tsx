
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, Star } from 'lucide-react';
import { User, Order } from '@/types/restaurant';

interface OrderHistoryProps {
  user: User | null;
  onBack: () => void;
  currentOrder?: Order | null;
  orderHistory?: Order[];
  onTrackOrder?: (order: Order) => void;
}

const OrderHistory = ({ user, onBack, currentOrder, orderHistory = [], onTrackOrder }: OrderHistoryProps) => {
  // Combiner commande actuelle et historique
  const allOrders = currentOrder 
    ? [currentOrder, ...orderHistory]
    : orderHistory;
    
  // Données simulées d'historique de commandes
  const mockOrders: Order[] = [
    
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'ready':
        return 'Prêt';
      case 'preparing':
        return 'En préparation';
      case 'confirmed':
        return 'Confirmée';
      default:
        return 'En attente';
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Historique des commandes</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">
                Connectez-vous pour accéder à votre historique de commandes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Historique des commandes</h1>
        </div>
        
        <div className="space-y-4">
          {(allOrders.length > 0 ? allOrders : mockOrders).map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Commande n° {order.id.replace('order-', '')}
                      </CardTitle>
                      {order === currentOrder && (
                        <Badge className="bg-restaurant-500 text-white">En cours</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.timestamp.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    {/* Bouton de suivi pour commande en cours */}
                    {order === currentOrder && onTrackOrder && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTrackOrder(order)}
                        className="mt-2 bg-restaurant-50 text-restaurant-700 border-restaurant-200 hover:bg-restaurant-100"
                      >
                        Suivre ma commande
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{order.total.toFixed(2)}FCFA</p>
                    <Badge 
                      variant="outline" 
                      className="flex items-center space-x-1 w-fit"
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>{order.tableNumber}</span>
                  <span>{order.orderType === 'dine-in' ? 'Sur place' : 'À emporter'}</span>
                  <span>Payé par {order.paymentMethod === 'mobile' ? 'mobile' : 'espèces'}</span>
                </div>
                
                {order.rating && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">Votre évaluation :</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= order.rating!.score
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {order.rating.comment && (
                      <p className="text-sm text-gray-600 italic">
                        "{order.rating.comment}"
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {(allOrders.length === 0 && mockOrders.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">
                Aucune commande dans votre historique pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
