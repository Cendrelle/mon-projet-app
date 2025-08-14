import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChefHat, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Timer,
  Flame,
  Users,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  tableNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    notes?: string;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  total: number;
  orderTime: Date;
  estimatedTime: number;
  priority: 'normal' | 'urgent';
}

const KitchenInterface = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      tableNumber: 'Table 5',
      items: [
        { name: 'Burger Royal', quantity: 1, notes: 'Sans oignons' },
        { name: 'Frites', quantity: 1 },
        { name: 'Coca', quantity: 1 }
      ],
      status: 'preparing',
      total: 24.50,
      orderTime: new Date(Date.now() - 15 * 60000),
      estimatedTime: 5,
      priority: 'normal'
    },
    {
      id: 'ORD-002',
      tableNumber: 'Table 12',
      items: [
        { name: 'Pizza Margherita', quantity: 1 },
        { name: 'Salade César', quantity: 1, notes: 'Sauce à part' }
      ],
      status: 'pending',
      total: 31.00,
      orderTime: new Date(Date.now() - 8 * 60000),
      estimatedTime: 12,
      priority: 'urgent'
    },
    {
      id: 'ORD-003',
      tableNumber: 'Table 3',
      items: [
        { name: 'Pâtes Carbonara', quantity: 2 },
        { name: 'Tiramisu', quantity: 1 }
      ],
      status: 'ready',
      total: 19.50,
      orderTime: new Date(Date.now() - 25 * 60000),
      estimatedTime: 0,
      priority: 'normal'
    },
    {
      id: 'ORD-004',
      tableNumber: 'Table 8',
      items: [
        { name: 'Steak Frites', quantity: 1, notes: 'Saignant' },
        { name: 'Salade verte', quantity: 1 }
      ],
      status: 'preparing',
      total: 28.00,
      orderTime: new Date(Date.now() - 12 * 60000),
      estimatedTime: 8,
      priority: 'normal'
    },
    {
      id: 'ORD-005',
      tableNumber: 'Table 15',
      items: [
        { name: 'Saumon grillé', quantity: 1 },
        { name: 'Risotto', quantity: 1, notes: 'Sans champignons' }
      ],
      status: 'pending',
      total: 35.00,
      orderTime: new Date(Date.now() - 3 * 60000),
      estimatedTime: 15,
      priority: 'urgent'
    },
    {
      id: 'ORD-006',
      tableNumber: 'Table 7',
      items: [
        { name: 'Soupe du jour', quantity: 2 },
        { name: 'Pain', quantity: 1 }
      ],
      status: 'pending',
      total: 18.00,
      orderTime: new Date(Date.now() - 5 * 60000),
      estimatedTime: 8,
      priority: 'normal'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    return priority === 'urgent' 
      ? 'bg-red-500 text-white border-red-600' 
      : 'bg-gray-200 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Flame className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      default: return <Timer className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getTimeElapsed = (orderTime: Date) => {
    return Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interface Cuisine</h1>
                <p className="text-gray-600">Commandes en temps réel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString('fr-FR')}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{orders.length} commandes</span>
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{pendingOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">En préparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{preparingOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Prêt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{readyOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Temps moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {Math.round(orders.reduce((acc, order) => acc + getTimeElapsed(order.orderTime), 0) / orders.length)} min
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-red-700 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              En attente ({pendingOrders.length})
            </h2>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`border-2 ${order.priority === 'urgent' ? 'border-red-400 bg-red-50' : 'border-red-200'}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-lg">{order.tableNumber}</h3>
                        {order.priority === 'urgent' && (
                          <Badge className="bg-red-500 text-white">
                            <Flame className="w-3 h-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">À préparer</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Commandé il y a {getTimeElapsed(order.orderTime)} min
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-medium">{item.quantity}x {item.name}</span>
                            {item.notes && (
                              <p className="text-sm text-orange-600 italic">Note: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Temps estimé: {order.estimatedTime} min</span>
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                      >
                        <Flame className="w-4 h-4 mr-1" />
                        Commencer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              En préparation ({preparingOrders.length})
            </h2>
            <div className="space-y-3">
              {preparingOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="border-2 border-blue-200 bg-blue-50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{order.tableNumber}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">En cours</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      En préparation depuis {getTimeElapsed(order.orderTime)} min
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-medium">{item.quantity}x {item.name}</span>
                            {item.notes && (
                              <p className="text-sm text-orange-600 italic">Note: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Temps restant: ~{order.estimatedTime} min</span>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Terminer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-700 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Prêt à servir ({readyOrders.length})
            </h2>
            <div className="space-y-3">
              {readyOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="border-2 border-green-200 bg-green-50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{order.tableNumber}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">Prêt</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Prêt depuis {getTimeElapsed(order.orderTime) - order.estimatedTime} min
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-medium">{item.quantity}x {item.name}</span>
                            {item.notes && (
                              <p className="text-sm text-orange-600 italic">Note: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-700">✓ Prêt à servir</span>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-100"
                        onClick={() => updateOrderStatus(order.id, 'served')}
                      >
                        Servir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenInterface;