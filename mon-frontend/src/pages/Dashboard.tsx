import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ChefHat, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Star,
  AlertCircle,
  CheckCircle,
  Timer,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  CreditCard,
  MessageSquare,
  UserCheck,
  PieChart,
  Edit,
  Trash2,
  Plus,
  Eye,
  Filter
} from 'lucide-react';

interface DashboardStats {
  todaySales: number;
  activeOrders: number;
  avgWaitTime: number;
  customerCount: number;
  completedOrders: number;
  revenue: number;
}

interface Order {
  id: string;
  tableNumber: string;
  items: string[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  total: number;
  orderTime: Date;
  estimatedTime: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 1847,
    activeOrders: 12,
    avgWaitTime: 18,
    customerCount: 156,
    completedOrders: 89,
    revenue: 4230
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      tableNumber: 'Table 5',
      items: ['Burger Royal', 'Frites', 'Coca'],
      status: 'preparing',
      total: 24.50,
      orderTime: new Date(Date.now() - 15 * 60000),
      estimatedTime: 5
    },
    {
      id: 'ORD-002',
      tableNumber: 'Table 12',
      items: ['Pizza Margherita', 'Salade César'],
      status: 'pending',
      total: 31.00,
      orderTime: new Date(Date.now() - 8 * 60000),
      estimatedTime: 12
    },
    {
      id: 'ORD-003',
      tableNumber: 'Table 3',
      items: ['Pâtes Carbonara', 'Tiramisu'],
      status: 'ready',
      total: 19.50,
      orderTime: new Date(Date.now() - 25 * 60000),
      estimatedTime: 0
    },
    {
      id: 'ORD-004',
      tableNumber: 'Table 8',
      items: ['Steak Frites', 'Salade verte'],
      status: 'preparing',
      total: 28.00,
      orderTime: new Date(Date.now() - 12 * 60000),
      estimatedTime: 8
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'served': return <CheckCircle className="w-4 h-4" />;
      default: return <Timer className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Restaurant</h1>
              <p className="text-muted-foreground">Tableau de bord en temps réel</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('fr-FR')}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.open('/kitchen', '_blank')}>
                <ChefHat className="w-4 h-4 mr-2" />
                Interface Cuisine
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
                App Client
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="kitchen">Cuisine</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus du jour</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.revenue}€</div>
                  <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes actives</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">En cours de traitement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temps d'attente</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgWaitTime} min</div>
                  <p className="text-xs text-muted-foreground">Temps moyen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients servis</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.customerCount}</div>
                  <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commandes récentes</CardTitle>
                  <CardDescription>Les 4 dernières commandes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <div>
                          <p className="font-medium">{order.tableNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}€</p>
                        <p className="text-sm text-muted-foreground">
                          {order.estimatedTime > 0 ? `${order.estimatedTime} min` : 'Prêt'}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance du jour</CardTitle>
                  <CardDescription>Objectifs et réalisations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Objectif revenus</span>
                      <span>{stats.revenue}/5000€</span>
                    </div>
                    <Progress value={(stats.revenue / 5000) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Commandes servies</span>
                      <span>{stats.completedOrders}/120</span>
                    </div>
                    <Progress value={(stats.completedOrders / 120) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Satisfaction client</span>
                      <span>4.8/5.0</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Menu className="w-5 h-5" />
                      <span>Gestion du Menu</span>
                    </CardTitle>
                    <CardDescription>Gérer les plats, prix et disponibilité</CardDescription>
                  </div>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un plat</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Burger Royal', price: '14.50€', category: 'Burgers', available: true },
                    { name: 'Pizza Margherita', price: '16.00€', category: 'Pizzas', available: true },
                    { name: 'Pâtes Carbonara', price: '12.50€', category: 'Pâtes', available: false },
                    { name: 'Salade César', price: '11.00€', category: 'Salades', available: true }
                  ].map((dish, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{dish.name}</h4>
                            <p className="text-sm text-muted-foreground">{dish.category}</p>
                          </div>
                          <Badge variant={dish.available ? "default" : "secondary"}>
                            {dish.available ? "Disponible" : "Indisponible"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-lg">{dish.price}</span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commandes</CardTitle>
                <CardDescription>Suivi en temps réel de toutes les commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                          <div>
                            <h4 className="font-semibold">{order.id} - {order.tableNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              Commandé il y a {Math.floor((Date.now() - order.orderTime.getTime()) / 60000)} min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{order.total}€</p>
                            <p className="text-sm text-muted-foreground">
                              {order.estimatedTime > 0 ? `${order.estimatedTime} min restantes` : 'Prêt à servir'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                Préparer
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                              >
                                Prêt
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'served')}
                              >
                                Servir
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Articles commandés:</p>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm text-muted-foreground">• {item}</p>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Gestion des Paiements</span>
                </CardTitle>
                <CardDescription>Suivi des paiements et validation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { orderId: 'ORD-001', amount: '24.50€', method: 'mobile', status: 'paid', table: 'Table 5' },
                    { orderId: 'ORD-002', amount: '31.00€', method: 'cash', status: 'pending', table: 'Table 12' },
                    { orderId: 'ORD-003', amount: '19.50€', method: 'mobile', status: 'paid', table: 'Table 3' },
                    { orderId: 'ORD-004', amount: '28.00€', method: 'cash', status: 'pending', table: 'Table 8' }
                  ].map((payment, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{payment.orderId} - {payment.table}</h4>
                            <p className="text-sm text-muted-foreground">
                              {payment.method === 'mobile' ? 'Paiement mobile' : 'Paiement espèces'}
                            </p>
                          </div>
                          <Badge variant={payment.status === 'paid' ? "default" : "secondary"}>
                            {payment.status === 'paid' ? 'Payé' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-lg">{payment.amount}</span>
                          {payment.status === 'pending' && (
                            <Button size="sm">
                              Valider
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Avis Clients</span>
                </CardTitle>
                <CardDescription>Gestion et réponse aux avis clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      customer: 'Marie D.', 
                      rating: 5, 
                      comment: 'Excellent service et nourriture délicieuse !', 
                      order: 'ORD-001',
                      responded: false
                    },
                    { 
                      customer: 'Jean P.', 
                      rating: 4, 
                      comment: 'Très bon mais un peu long à servir.', 
                      order: 'ORD-002',
                      responded: true
                    },
                    { 
                      customer: 'Sophie L.', 
                      rating: 5, 
                      comment: 'Parfait comme toujours !', 
                      order: 'ORD-003',
                      responded: false
                    }
                  ].map((review, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{review.customer}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <Badge variant="outline">{review.order}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                          {review.responded && (
                            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                              Réponse: Merci pour votre retour ! Nous sommes ravis que vous ayez apprécié.
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!review.responded && (
                            <Button size="sm">
                              Répondre
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5" />
                      <span>Clients Inscrits</span>
                    </CardTitle>
                    <CardDescription>Gestion de la base clients</CardDescription>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filtrer</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: 'Marie Dubois', 
                      email: 'marie.d@email.com', 
                      orders: 23, 
                      total: '450€', 
                      lastVisit: '2 jours',
                      loyalty: 245
                    },
                    { 
                      name: 'Jean Petit', 
                      email: 'jean.p@email.com', 
                      orders: 15, 
                      total: '320€', 
                      lastVisit: '1 semaine',
                      loyalty: 156
                    },
                    { 
                      name: 'Sophie Laurent', 
                      email: 'sophie.l@email.com', 
                      orders: 31, 
                      total: '670€', 
                      lastVisit: '1 jour',
                      loyalty: 389
                    }
                  ].map((customer, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{customer.orders} commandes</p>
                            <p className="text-xs text-muted-foreground">Total: {customer.total}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{customer.loyalty} pts</p>
                            <p className="text-xs text-muted-foreground">Fidélité</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm">Dernière visite</p>
                            <p className="text-xs text-muted-foreground">{customer.lastVisit}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes mensuelles</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847€</div>
                  <p className="text-xs text-muted-foreground">+18% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket moyen</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18.50€</div>
                  <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <p className="text-xs text-muted-foreground">+0.2 vs mois dernier</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Ventes par heure</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique des ventes par heure
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Plats les plus commandés</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Burger Royal</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <Badge>23</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pizza Margherita</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-20 h-2" />
                        <Badge>18</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pâtes Carbonara</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={55} className="w-20 h-2" />
                        <Badge>15</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Salade César</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-20 h-2" />
                        <Badge>12</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Répartition des paiements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Paiement mobile</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Paiement espèces</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={25} className="w-20 h-2" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Performances temps réel</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Temps moyen de préparation</span>
                      <span className="font-medium">12 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Temps moyen de service</span>
                      <span className="font-medium">3 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de satisfaction</span>
                      <span className="font-medium">96%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kitchen Tab */}
          <TabsContent value="kitchen" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <span>Vue Cuisine</span>
                </CardTitle>
                <CardDescription>Commandes à préparer et en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.filter(order => order.status === 'pending' || order.status === 'preparing').map((order) => (
                    <Card key={order.id} className="p-4 border-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-lg">{order.tableNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status === 'pending' ? 'À préparer' : 'En cours'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {Math.floor((Date.now() - order.orderTime.getTime()) / 60000)} min
                          </span>
                          <Button 
                            size="sm" 
                            variant={order.status === 'pending' ? 'default' : 'outline'}
                            onClick={() => updateOrderStatus(
                              order.id, 
                              order.status === 'pending' ? 'preparing' : 'ready'
                            )}
                          >
                            {order.status === 'pending' ? 'Commencer' : 'Terminer'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;