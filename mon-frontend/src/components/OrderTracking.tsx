import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ChefHat, Bell, Star, Gift } from 'lucide-react';
import { Order } from '@/types/restaurant';
import OrderRating from './OrderRating';
import { useToast } from '@/hooks/use-toast';

interface OrderTrackingProps {
  order: Order;
  onBackToMenu: () => void;
}

const OrderTracking = ({ order, onBackToMenu }: OrderTrackingProps) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const statusProgression = ['confirmed', 'preparing', 'ready', 'delivered'];
    let currentIndex = statusProgression.indexOf(currentStatus);
    
    const timer = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        const newStatus = statusProgression[currentIndex] as any;
        setCurrentStatus(newStatus);
        setEstimatedTime(prev => Math.max(0, prev - 7));
        
        // Notifications en temps réel
        if (newStatus === 'preparing') {
          toast({
            title: "🍳 Préparation commencée",
            description: "Votre commande est en cours de préparation !",
          });
        } else if (newStatus === 'ready') {
          toast({
            title: "🔔 Commande prête !",
            description: "Votre repas vous attend !",
          });
          
          // Simulation de vibration pour mobile
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
        } else if (newStatus === 'delivered') {
          toast({
            title: "✅ Bon appétit !",
            description: "Votre commande a été servie.",
          });
        }
      } else {
        clearInterval(timer);
        setTimeout(() => setShowRating(true), 2000);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [toast]);

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
                  {currentStatus === 'confirmed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {currentStatus === 'preparing' && <ChefHat className="w-5 h-5 text-restaurant-500" />}
                  {currentStatus === 'ready' && <Bell className="w-5 h-5 text-blue-500 animate-pulse" />}
                  {currentStatus === 'delivered' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <span className="font-medium text-lg">
                    {currentStatus === 'confirmed' && 'Commande confirmée'}
                    {currentStatus === 'preparing' && 'En préparation'}
                    {currentStatus === 'ready' && 'Prête à servir !'}
                    {currentStatus === 'delivered' && 'Servie'}
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
