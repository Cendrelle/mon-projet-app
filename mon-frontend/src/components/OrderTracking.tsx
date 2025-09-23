import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ChefHat, Bell, Star, Gift } from 'lucide-react';
import { Order } from '@/types/restaurant';
import OrderRating from './OrderRating';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface OrderTrackingProps {
  order: Order;
  onBackToMenu: () => void;
  commande_uuid?: string;
}

const OrderTracking = ({ order, onBackToMenu, commande_uuid: propUuid }: OrderTrackingProps) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderState, setOrderState] = useState<Order>(order);

  const { commande_uuid: paramUuid } = useParams<{ commande_uuid: string }>();
  const commande_uuid = propUuid || paramUuid;

  // Mapper backend -> frontend
  const mapBackendToFrontendStatus = (backendStatut: string): Order['status'] => {
    switch (backendStatut) {
      case 'en_attente':
        return 'pending';
      case 'confirmee':
        return 'confirmed';
      case 'en_cours':
        return 'preparing';
      case 'pretee':
        return 'ready';
      case 'servie':
        return 'delivered';
      default:
        return 'pending'; // fallback
    }
  };


  useEffect(() => {
    if (!commande_uuid) {
      console.log("Aucun commande_uuid, on ne lance pas la récupération");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/suivi/${commande_uuid}/`);

        if (!res.ok) {
          throw new Error(`Erreur serveur ${res.status}`);
        }
        const data = await res.json();

        const frontendStatus = mapBackendToFrontendStatus(data.statut);

        console.log("Statut backend:", data.statut, "→ Statut frontend:", frontendStatus);

        setOrderState(prev => ({ ...prev, status: frontendStatus })); 
        setCurrentStatus(frontendStatus);

        if (frontendStatus === 'delivered' && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          console.log("Commande servie, arrêt du fetch automatique");
        }

      } catch (err) {
        console.error("Erreur récupération statut:", err);
        toast({ title: "Erreur", description: "Impossible de récupérer le statut de la commande" });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
    const timerRef = { current: setInterval(fetchOrderStatus, 10000) };

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [commande_uuid]);

  /* if (loading) return <div>Chargement de la commande...</div>;
  if (!order) return <div>Aucune commande trouvée.</div>;
  if (showRating) return <OrderRating order={order} onComplete={onBackToMenu} />;

 */
 
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-restaurant-500" />;
      case 'ready':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Commande confirmée';
      case 'preparing':
        return 'En préparation';
      case 'ready':
        return 'Prête à servir';
      case 'delivered':
        return 'Servie';
      default:
        return 'En attente';
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'En attente' },
    { key: 'confirmed', label: 'Confirmée' },
    { key: 'preparing', label: 'En préparation' },
    { key: 'ready', label: 'Prête' },
    { key: 'delivered', label: 'Servie' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  if (showRating) {
    return <OrderRating order={order} onComplete={onBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Commande #{order.id.slice(-6)}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-restaurant-600 border-restaurant-600">
                  {order.tableNumber}
                </Badge>
                <Badge variant="outline" className={order.orderType === 'dine-in' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}>
                  {order.orderType === 'dine-in' ? 'Sur place' : 'À emporter'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {orderState?.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                  {orderState?.status === 'confirmed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {orderState?.status === 'preparing' && <ChefHat className="w-5 h-5 text-restaurant-500" />}
                  {orderState?.status === 'ready' && <Bell className="w-5 h-5 text-blue-500 animate-pulse" />}
                  {orderState?.status === 'delivered' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <span className="font-medium text-lg">
                    {orderState?.status === 'pending' && 'Commande en attente'}
                    {orderState?.status === 'confirmed' && 'Commande confirmée'}
                    {orderState?.status === 'preparing' && 'En préparation'}
                    {orderState?.status === 'ready' && 'Prête à servir !'}
                    {orderState?.status === 'delivered' && 'Servie'}
                  </span>
                </div>
                {currentStatus !== 'delivered' && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Temps estimé</div>
                    <div className="font-bold text-restaurant-600">
                      {estimatedTime} min
                    </div>
                  </div>
                )}
              </div>

              {/* Notification spéciale quand c'est prêt */}
              {currentStatus === 'ready' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">🔔 Votre commande est prête !</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {order.orderType === 'dine-in' 
                      ? 'Votre serveur va vous apporter votre commande.'
                      : 'Vous pouvez venir récupérer votre commande au comptoir.'
                    }
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        index <= getCurrentStepIndex() 
                          ? 'bg-restaurant-500' 
                          : 'bg-gray-300'
                      }`} />
                      <span className="text-xs text-gray-600 mt-1">{step.label}</span>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
                  <div 
                    className="absolute top-0 left-0 h-1 bg-restaurant-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Détail de la commande</span>
              {order.paymentMethod && (
                <Badge variant="outline">
                  {order.paymentMethod === 'cash' ? 'Espèces' : 'Mobile'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium">{item.quantity}x {item.menuItem.name}</span>
                    {(item.customizations.cooking || item.customizations.sides?.length || item.customizations.notes) && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item.customizations.cooking && <div>Cuisson: {item.customizations.cooking}</div>}
                        {item.customizations.sides?.length > 0 && <div>Accompagnements: {item.customizations.sides.join(', ')}</div>}
                        {item.customizations.notes && <div>Notes: {item.customizations.notes}</div>}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">
                    {(item.menuItem.price * item.quantity).toFixed(2)}FCFA
                  </span>
                </div>
              ))}
              
              {order.customerInfo?.loyaltyPoints && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{Math.floor(order.total)} points de fidélité gagnés !
                    </span>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{order.total.toFixed(2)}FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={onBackToMenu}
            className="bg-restaurant-500 hover:bg-restaurant-600"
          >
            Retour au menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
