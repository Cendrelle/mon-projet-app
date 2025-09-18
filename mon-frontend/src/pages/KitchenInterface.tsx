import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChefHat,
  Clock,
  AlertCircle,
  CheckCircle,
  Timer,
  Flame,
  Users,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: number;
  client: null | any;
  table: number; 
  date_commande: string;
  statut: "en_attente" | "confirmee" | "en_cours" | "pretee" | "servie";
  total: string;
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

  // Actualisation de l'heure toutes les 30s
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

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
        setOrders(data);       // ← stocke les commandes
        setLoading(false);     // ← fin du chargement
      } catch (error) {
        console.error("Erreur lors du fetch des commandes:", error);
        setLoading(false);     // ← fin du chargement même si erreur
      }
    };

    fetchOrders();
  }, []);


  const getStatusColor = (status: Order["statut"]) => {
    switch (status) {
      case "en_attente":
        return "bg-red-100 text-red-800 border-red-200";
      case "confirmee":
        return "bg-red-100 text-red-800 border-red-200";
      case "en_cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pretee":
        return "bg-green-100 text-green-800 border-green-200";
      case "servie":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Order["statut"]) => {
    switch (status) {
      case "en_attente":
        return <AlertCircle className="w-4 h-4" />;
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
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
    }
  };


  const getTimeElapsed = (date_commande: string) => {
    const orderTime = new Date(date_commande);
    return Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
  };

  const pendingOrders = orders?.filter((order) => order.statut === "confirmee") || [];
  const preparingOrders = orders?.filter((order) => order.statut === "en_cours") || [];
  const readyOrders = orders?.filter((order) => order.statut === "pretee") || [];


  if (loading) {
    return <div className="p-6">Chargement des commandes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Interface Cuisine
                </h1>
                <p className="text-gray-600">Commandes en temps réel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString("fr-FR")}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{orders.length} commandes</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
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
          <h2 className="text-lg font-semibold text-red-700 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            En attente ({pendingOrders.length})
          </h2>
          {pendingOrders && pendingOrders.map((order) => (
            <Card key={order.id} className="border-2 border-red-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Table {order.table}</h3>
                  <Badge className={getStatusColor(order.statut)}>
                    {getStatusIcon(order.statut)}
                    <span className="ml-1">À préparer</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Commandé il y a {getTimeElapsed(order.date_commande)} min
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.plats.map((pc, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {pc.quantite}x {pc.plat.nom_plat}
                    </span>
                    <span className="text-sm font-medium">{pc.prix} FCFA</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: {order.total} FCFA</span>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => updateOrderStatus(order.id, "en_cours")}
                  >
                    <Flame className="w-4 h-4 mr-1" />
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preparing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center">
            <Flame className="w-5 h-5 mr-2" />
            En préparation ({preparingOrders.length})
          </h2>
          {preparingOrders.map((order) => (
            <Card key={order.id} className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Table {order.table}</h3>
                  <Badge className={getStatusColor(order.statut)}>
                    {getStatusIcon(order.statut)}
                    <span className="ml-1">En cours</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Depuis {getTimeElapsed(order.date_commande)} min
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.plats.map((pc, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {pc.quantite}x {pc.plat.nom_plat}
                    </span>
                    <span className="text-sm font-medium">{pc.prix} FCFA</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: {order.total} FCFA</span>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateOrderStatus(order.id, "pretee")}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Terminer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ready */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-green-700 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Prêt ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <Card key={order.id} className="border-2 border-green-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Table {order.table}</h3>
                  <Badge className={getStatusColor(order.statut)}>
                    {getStatusIcon(order.statut)}
                    <span className="ml-1">Prêt</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Prêt depuis {getTimeElapsed(order.date_commande)} min
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.plats.map((pc, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {pc.quantite}x {pc.plat.nom_plat}
                    </span>
                    <span className="text-sm font-medium">{pc.prix} FCFA</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-700">✓ Prêt à servir</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-100"
                    onClick={() => updateOrderStatus(order.id, "servie")}
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
  );
};

export default KitchenInterface;
