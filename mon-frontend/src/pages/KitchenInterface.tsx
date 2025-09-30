import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast"
import {
  ChefHat,
  Clock,
  AlertCircle,
  CheckCircle,
  Timer,
  Flame,
  Users,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useOrderWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: number;
  client: null | any;
  table: number; 
  date_commande: string;
  statut: "en_attente" | "confirmee" | "en_cours" | "pretee" | "servie";
  total: string;
  description?: string;
  type_service: string;
  plats: Array<{
    id: number;
    plat: {
      id: number;
      nom_plat: string;
      prix: string;
      categorie: string;
      disponibilite: boolean;
      description: string;
      image: string;
      ingredients: string;
    };
    quantite: number;
    prix: string;
  }>;
}

const KitchenInterface = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  // Fonction pour gérer les nouvelles commandes via WebSocket
  const handleNewOrder = (order: Order) => {
    // Ajouter la nouvelle commande en haut de la liste
    setOrders(prev => [order, ...prev]);
    
    // Notification visuelle
    toast({
      title: "🔔 Nouvelle commande !",
      description: `Table ${order.table} - ${order.plats.length} plat(s)`,
      duration: 5000,
    });
    
    // Notification sonore
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Erreur audio:', e));
  };

  // Hook WebSocket pour recevoir les commandes en temps réel
  const { isConnected } = useOrderWebSocket(handleNewOrder);

  // Actualisation de l'heure toutes les 30s
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Chargement initial des commandes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");

        const response = await fetch("http://localhost:8000/api/admin/commandes/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur API");

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du fetch des commandes:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order["statut"]) => {
    switch (status) {
      case "en_attente":
      case "confirmee":
        return "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-300";
      case "en_cours":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-300";
      case "pretee":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-300";
      case "servie":
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Order["statut"]) => {
    switch (status) {
      case "en_attente":
      case "confirmee":
        return <AlertCircle className="w-4 h-4" />;
      case "en_cours":
        return <Flame className="w-4 h-4" />;
      case "pretee":
        return <CheckCircle className="w-4 h-4" />;
      case "servie":
        return <Timer className="w-4 h-4" />;
      default:
        return <Timer className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = async (id: number, newStatus: Order["statut"]) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");
      
      const response = await fetch(`http://127.0.0.1:8000/api/admin/commandes/${id}/update-status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!response.ok) throw new Error("Erreur API");

      const updatedOrder = await response.json();

      // Mettre à jour l'état local
      setOrders(prev =>
        prev.map(order => (order.id === id ? { ...order, statut: updatedOrder.statut } : order))
      );

      // Notification de succès
      toast({
        title: "Statut mis à jour",
        description: `Commande #${id} passée à ${newStatus}`,
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getTimeElapsed = (date_commande: string) => {
    const orderTime = new Date(date_commande);
    return Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
  };

  const pendingOrders = orders?.filter((order) => order.statut === "en_attente" || order.statut === "confirmee") || [];
  const preparingOrders = orders?.filter((order) => order.statut === "en_cours") || [];
  const readyOrders = orders?.filter((order) => order.statut === "pretee") || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Chargement de l'interface cuisine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Interface Cuisine
                </h1>
                <p className="text-white/90">Commandes en temps réel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Indicateur de connexion WebSocket */}
              <Badge 
                variant="outline" 
                className={`flex items-center space-x-2 ${
                  isConnected 
                    ? 'bg-green-500/20 border-green-300 text-white' 
                    : 'bg-red-500/20 border-red-300 text-white'
                }`}
              >
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Connecté</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Déconnecté</span>
                  </>
                )}
              </Badge>
              
              <Badge variant="outline" className="flex items-center space-x-1 bg-white/20 border-white/30 text-white">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString("fr-FR")}</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center space-x-1 bg-white/20 border-white/30 text-white">
                <Users className="w-4 h-4" />
                <span>{orders.length} commandes</span>
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-red-700 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              En attente
            </h2>
            <Badge className="bg-red-500 text-white">{pendingOrders.length}</Badge>
          </div>
          
          {pendingOrders.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-8 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune commande en attente</p>
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map((order) => (
              <Card 
                key={order.id} 
                className="border-2 border-red-200 hover:shadow-lg transition-shadow animate-pulse-border"
              >
                <CardHeader className="bg-red-50/50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Table {order.table}</h3>
                    <Badge className={getStatusColor(order.statut)}>
                      {getStatusIcon(order.statut)}
                      <span className="ml-1">À préparer</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    ⏰ Il y a {getTimeElapsed(order.date_commande)} min
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  {order.plats.map((pc, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="font-medium">
                        <span className="inline-block w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-center text-sm mr-2">
                          {pc.quantite}
                        </span>
                        {pc.plat.nom_plat}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{pc.prix} FCFA</span>
                    </div>
                  ))}
                  
                  {order.description && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                      <p className="text-sm text-yellow-800">
                        <strong>Remarque:</strong> {order.description}
                      </p>
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Total: {order.total} FCFA</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={() => updateOrderStatus(order.id, "en_cours")}
                    >
                      <Flame className="w-4 h-4 mr-1" />
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preparing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              En préparation
            </h2>
            <Badge className="bg-blue-500 text-white">{preparingOrders.length}</Badge>
          </div>
          
          {preparingOrders.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-8 text-center text-gray-500">
                <Flame className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune commande en préparation</p>
              </CardContent>
            </Card>
          ) : (
            preparingOrders.map((order) => (
              <Card key={order.id} className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-blue-50/50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Table {order.table}</h3>
                    <Badge className={getStatusColor(order.statut)}>
                      {getStatusIcon(order.statut)}
                      <span className="ml-1">En cours</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    🔥 Depuis {getTimeElapsed(order.date_commande)} min
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  {order.plats.map((pc, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="font-medium">
                        <span className="inline-block w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-center text-sm mr-2">
                          {pc.quantite}
                        </span>
                        {pc.plat.nom_plat}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{pc.prix} FCFA</span>
                    </div>
                  ))}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Total: {order.total} FCFA</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      onClick={() => updateOrderStatus(order.id, "pretee")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Terminer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Ready */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-700 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Prêt à servir
            </h2>
            <Badge className="bg-green-500 text-white">{readyOrders.length}</Badge>
          </div>
          
          {readyOrders.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune commande prête</p>
              </CardContent>
            </Card>
          ) : (
            readyOrders.map((order) => (
              <Card key={order.id} className="border-2 border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-green-50/50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Table {order.table}</h3>
                    <Badge className={getStatusColor(order.statut)}>
                      {getStatusIcon(order.statut)}
                      <span className="ml-1">Prêt</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    ✅ Prêt depuis {getTimeElapsed(order.date_commande)} min
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  {order.plats.map((pc, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="font-medium">
                        <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center text-sm mr-2">
                          {pc.quantite}
                        </span>
                        {pc.plat.nom_plat}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{pc.prix} FCFA</span>
                    </div>
                  ))}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-green-700">✓ Prêt à servir</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-700 hover:bg-green-50"
                      onClick={() => updateOrderStatus(order.id, "servie")}
                    >
                      <Timer className="w-4 h-4 mr-1" />
                      Servir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenInterface;