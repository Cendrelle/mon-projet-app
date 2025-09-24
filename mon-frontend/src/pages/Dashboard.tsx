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
  Flame,
  Filter,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  total_clients: number;       // total des clients
  total_commandes: number;
  todaySales: number;
  active_orders: number;
  avgWaitTime: number;
  customerCount: number;
  completedOrders: number;
  revenue: number;
  plats_populaires: 
    {
      nom_plat: string,
      nb_ventes: number
    }[],
}

interface PlatMenu {
  id: number;
  nom_plat: string;
  prix: number;
  categorie: string;
  disponibilite: boolean;
  description: string;
  image?: File | null;
}

interface Order {
  id: number;
  client: null | any;
  table: number; // juste l'id de la table
  date_commande: string;
  statut: "confirmee" | "en_cours" | "pretee" | "servie";
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

interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  loyalty_points: number;
  last_login?: string; // ou autre champ pour dernière visite
}

interface AnalyticsStats {
  total_clients: number;       // total des clients
  total_commandes: number;     // total des commandes
  ventes_totales: number;      // total des ventes
  todaySales: number;          // ventes du jour
  activeOrders: number;        // commandes en cours
  completedOrders: number;     // commandes servies
  avgWaitTime: number;         // temps moyen de préparation (en minutes)
  plats_populaires: {
    nom_plat: string;
    nb_ventes: number;
  }[];
}



const Dashboard = () => {

  // States pour le modal
  const [showDishModal, setShowDishModal] = useState(false);

  // State pour le formulaire d'ajout
  const [newDish, setNewDish] = useState({
    nom_plat: "",
    prix: "",
    categorie: "",
    description: "",
    ingredients: "",
    disponibilite: true,
    image: null
  });

  const [editingDish, setEditingDish] = useState<any>(null); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [menu, setMenu] = useState<PlatMenu[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>(
    {todaySales: 0,
      total_clients: 0,      // total des clients
      total_commandes: 0,
      active_orders: 0,
      avgWaitTime: 0,
      customerCount: 0,
      completedOrders: 0,
      revenue: 0,
      plats_populaires: 
      [{
        nom_plat: "",
        nb_ventes: 0
      },]
    });
      
  const [loadingStats, setLoadingStats] = useState(true);

  // --- pour ouvrir le modal et pré-remplir ---
  const startEditDish = (dish: any) => {
    console.log("Edition d'un plat:", dish);
    setCurrentDish(dish);
    setEditingDish(dish);      // stocke le plat en cours d’édition
    setNewDish(dish);          // pré-remplit le formulaire avec ses valeurs
    setShowAddModal(true); 
    setShowDishModal(true); 
    console.log("currentDish après set:", currentDish, "showDishModal:", showDishModal);    // ouvre le modal
  };

  const handleOpenEdit = (dish: any) => {
    setEditingDish(dish); // tu stockes le plat en cours d'édition
  };


  // State pour le plat en cours de modification (null si ajout)
  const [currentDish, setCurrentDish] = useState<null | {
    id?: number;
    nom_plat: string;
    prix: string;
    categorie: string;
    description: string;
    ingredients: string;
    disponibilite: boolean;
    image?: File | null;
  }>(null);

  const [analytics, setAnalytics] = useState({
    total_clients: 0,
    total_commandes: 0,
    completed_orders: 0,
    active_orders: 0,
    revenue: 0,
    avgWaitTime: 0,
    plats_populaires: []
  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");

        const response = await fetch("http://localhost:8000/api/admin/stats/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur API statistiques");

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors du fetch des statistiques:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Pas de token trouvé");

        const response = await fetch("http://localhost:8000/api/admin/clients/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur API");

        const data = await response.json();
        setClients(data);
        setLoadingClients(false);
      } catch (error) {
        console.error("Erreur fetch clients:", error);
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleViewClient = async (id: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Pas de token trouvé");
    const res = await fetch(`http://localhost:8000/api/admin/clients/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération du client");
    const data = await res.json();
    console.log("Détails client:", data);
    // Ouvrir un modal si tu veux afficher les infos
  } catch (err) {
    console.error(err);
  }
};

const handleEditClient = (client: Client) => {
  console.log("Modifier client:", client);
  // Pré-remplir un formulaire dans un modal
};

const handleDeleteClient = async (id: number) => {
  if (!confirm("Supprimer ce client ?")) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`http://localhost:8000/api/admin/clients/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur suppression client");
    setClients(clients.filter((c) => c.id !== id));
  } catch (err) {
    console.error(err);
  }
};


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

    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");
          const response = await fetch("http://localhost:8000/api/admin/menu/", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Erreur lors du fetch du menu");
          const data = await response.json();
          setMenu(data);
        } catch (error) {
          console.error(error);
      }
    };
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/admin/paiements/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des paiements");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPayments();
  }, []);

  // Valider un paiement
  const handleValidatePayment = async (paymentId: number) => {
    try {
      // trouve le paiement correspondant dans ton state
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) return;

      // prépare les données à envoyer
      const updatedPayment = {
        ...payment,
        status: "success" // on passe de pending → success
      };

      // envoie le PUT au backend
      const res = await fetch(`http://localhost:8000/api/admin/paiements/${paymentId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(updatedPayment)
      });

      if (!res.ok) throw new Error("Erreur lors de la validation");

      const data = await res.json();
      console.log("Paiement validé:", data);

      // met à jour le state local pour refléter le changement
      setPayments(prev =>
        prev.map(p => (p.id === paymentId ? { ...p, status: "success" } : p))
      );
    } catch (err) {
      console.error("Erreur validate payment:", err);
    }
  };


  // Récupérer les avis
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/admin/avis/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors du fetch des avis");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  // Répondre à un avis
  const handleRespondReview = async (id: number, message: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/api/admin/avis/${id}/respond/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Erreur réponse avis");
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  
  
    const getStatusColor = (status: Order["statut"]) => {
      switch (status) {
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
  
    const updateOrderStatus = (orderId: number, newStatus: Order["statut"]) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, statut: newStatus } : order
        )
      );
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

    
  const handleAddDish = async () => {
    const formData = new FormData();
    formData.append("nom_plat", newDish.nom_plat);
    formData.append("prix", newDish.prix.toString());
    formData.append("categorie", newDish.categorie);
    formData.append("description", newDish.description);
    formData.append("image", newDish.image);
    formData.append("disponibilite", newDish.disponibilite ? "true" : "false");
    if (newDish.image) formData.append("image", newDish.image);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");
      const url = editingDish
        ? `http://localhost:8000/api/admin/menu/${editingDish.id}/`
        : "http://localhost:8000/api/admin/menu/";
      
      const method = editingDish ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          // Supprime "Content-Type" pour que FormData fonctionne correctement
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi du plat");

      fetchMenu(); // Recharger le menu
      setShowDishModal(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout/modification du plat");
    }
  };


  const handleEditDish = async (id: number, updatedDish: any) => {
    try {
      const formData = new FormData();
      formData.append("nom_plat", updatedDish.nom_plat);
      formData.append("prix", updatedDish.prix);
      formData.append("categorie", updatedDish.categorie);
      formData.append("description", updatedDish.description);
      formData.append("disponibilite", updatedDish.disponibilite);
      formData.append("ingredients", updatedDish.ingredients);
      if (updatedDish.image instanceof File)formData.append("image", updatedDish.image);
      for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Pas de token trouvé, reconnectez-vous");
      const response = await fetch(`http://localhost:8000/api/admin/menu/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la modification du plat");

      // Mettre à jour la liste locale après modification
      const updated = await response.json();
      setMenu(menu.map((m) => (m.id === id ? updated : m)));

      setShowDishModal(false);
      setCurrentDish(null);
    } catch (error) {
      console.error("Erreur du backend :", error);
      alert("Erreur lors de la modification du plat");
    }
  };

  const handleDeleteDish = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/api/admin/menu/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setMenu((prev) => prev.filter((dish) => dish.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewDish = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/api/admin/menu/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération du plat");

      const dishDetails = await response.json();
      console.log(dishDetails);
      // ici tu peux ouvrir un modal pour afficher les infos
    } catch (error) {
      console.error(error);
    }
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
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
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
                  <div className="text-2xl font-bold">{stats.revenue}FCFA</div>
                  <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes actives</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active_orders}</div>
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
                  <div className="text-2xl font-bold">{stats.total_clients}</div>
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
                        <Badge className={getStatusColor(order.statut)}>
                          {getStatusIcon(order.statut)}
                          <span className="ml-1 capitalize">{order.statut}</span>
                        </Badge>
                        <div>
                          <p className="font-medium">{order.table}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.plats.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}FCFA</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor((currentTime.getTime() - new Date(order.date_commande).getTime()) / 60000)} min
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
                      <span>{stats.todaySales}/5000FCFA</span>
                    </div>
                    <Progress value={(stats.todaySales / 5000) * 100} className="h-2" />
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
                  {/* Bouton pour ouvrir le formulaire d'ajout */}
                  <Button
                    className="flex items-center space-x-2"
                    onClick={() => {
                      setCurrentDish(null); // ajout
                      setShowDishModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un plat</span>
                  </Button>

                  
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {menu.map((dish) => (
                    <Card key={dish.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{dish.nom_plat}</h4>
                            <p className="text-sm text-muted-foreground">{dish.categorie}</p>
                          </div>
                          <Badge variant={dish.disponibilite ? "default" : "secondary"}>
                            {dish.disponibilite ? "Disponible" : "Indisponible"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-lg">{dish.prix} FCFA</span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditDish(dish)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => alert(JSON.stringify(dish, null, 2))}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDish(dish.id)}
                            >
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
                  {orders
                  .slice() 
                  .sort((a, b) => new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime())
                  .map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(order.statut)}>
                            {getStatusIcon(order.statut)}
                            <span className="ml-1 capitalize">{order.statut}</span>
                          </Badge>
                          <div>
                            <h4 className="font-semibold">{order.id} - {order.table}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getTimeElapsed(order.date_commande) >= 0
                                ? `${getTimeElapsed(order.date_commande)} min`
                                : 'Prêt'}
                            </p>

                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{order.total}FCFA</p>
                            <p className="text-sm text-muted-foreground">
                              {getTimeElapsed(order.date_commande) > 0
                                ? `${getTimeElapsed(order.date_commande)} min`
                                : 'Prêt'}
                            </p>

                          </div>
                          <div className="flex space-x-2">
                            {order.statut === 'confirmee' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'en_cours')}
                              >
                                Préparer
                              </Button>
                            )}
                            {order.statut === 'en_cours' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'pretee')}
                              >
                                Prêt
                              </Button>
                            )}
                            {order.statut === 'pretee' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'servie')}
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
                        <p className="text-sm text-muted-foreground">
                          {order.client ? `Client: ${order.client}` : `Table ${order.table}`}
                        </p>
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
                  {payments.map((payment) => (
                    <Card key={payment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            {/* commande au lieu de order, et pas de table (sauf si tu ajoutes table côté backend) */}
                            <h4 className="font-semibold">Commande #{payment.commande.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {payment.mode === 'en_ligne' ? 'Paiement en ligne' : 'Paiement en espèces'}
                            </p>
                          </div>
                          <Badge variant={payment.status === 'success' ? "default" : "secondary"}>
                            {payment.status === 'success' ? 'Payé' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-lg">{payment.montant} FCFA</span>
                          {payment.status === 'pending' && (
                            <Button size="sm" onClick={() => handleValidatePayment(payment.id)}>
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
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {/* Pas de champ 'customer', on peut afficher review.client ou "Client #id" */}
                            <h4 className="font-semibold">Client #{review.client}</h4>

                            {/* Affichage des étoiles en fonction de review.note */}
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>

                            {/* Pas 'order', donc on affiche l'id de la commande liée */}
                            <Badge variant="outline">Commande #{review.commande.id}</Badge>
                          </div>

                          {/* description au lieu de comment */}
                          <p className="text-sm text-muted-foreground mb-2">{review.description}</p>

                          {/* Ici pas de champ response (sauf si tu l’ajoutes dans ton modèle plus tard) */}
                        </div>

                        <div className="flex space-x-2">
                          {/* Si tu ajoutes une API pour répondre, tu peux garder ce bouton */}
                          <Button
                            size="sm"
                            onClick={() => handleRespondReview(review.id, "Merci pour votre retour !")}
                          >
                            Répondre
                          </Button>

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
                  {loadingClients ? (
                    <p>Chargement des clients...</p>
                  ) : (
                    clients.map((client) => (
                      <Card key={client.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-semibold">{client.firstname} {client.lastname}</h4>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                            <div className="text-center">
                              {/* <p className="text-sm font-medium">{client.orders?.length || 0} commandes</p> */}
                              <p className="text-xs text-muted-foreground">
                                Total: {client.loyalty_points || "0€"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{client.loyalty_points} pts</p>
                              <p className="text-xs text-muted-foreground">Fidélité</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm">Dernière visite</p>
                              <p className="text-xs text-muted-foreground">{client.last_login || "—"}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewClient(client.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditClient(client)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
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
                  <div className="text-2xl font-bold">{stats?.revenue?.toLocaleString()} FCFA</div>
                  {/* <p className="text-xs text-muted-foreground">+18% vs mois dernier</p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_commandes}</div>
                  {/* <p className="text-xs text-muted-foreground">+12% vs mois dernier</p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket moyen</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.total_commandes > 0 
                      ? (stats.revenue / stats.total_commandes).toFixed(2) 
                      : 0} FCFA
                  </div>
                  {/* <p className="text-xs text-muted-foreground">+5% vs mois dernier</p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgWaitTime} min 
                  </div>
                  {/* <p className="text-xs text-muted-foreground">+0.2 vs mois dernier</p> */}
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
                    {stats?.plats_populaires?.map((plat, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{plat.nom_plat}</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={(plat.nb_ventes / stats.plats_populaires[0].nb_ventes) * 100}
                            className="w-20 h-2"
                          />
                          <Badge>{plat.nb_ventes}</Badge>
                        </div>
                      </div>
                    ))}
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

        </Tabs>
      </div>
      {/* Modal/Formulaire */}
        {showDishModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                  {currentDish ? "Modifier le plat" : "Ajouter un nouveau plat"}
                </h2>

                <input
                  type="text"
                  placeholder="Nom du plat"
                  className="w-full mb-2 p-2 border rounded"
                  value={currentDish?.nom_plat || newDish.nom_plat}
                  onChange={(e) =>
                    currentDish
                    ? setCurrentDish({ ...currentDish, nom_plat: e.target.value })
                    : setNewDish({ ...newDish, nom_plat: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Prix"
                  className="w-full mb-2 p-2 border rounded"
                  value={currentDish?.prix || newDish.prix}
                  onChange={(e) =>
                    currentDish
                    ? setCurrentDish({ ...currentDish, prix: e.target.value })
                    : setNewDish({ ...newDish, prix: e.target.value })
                  }
                />
                        <select
                          className="w-full mb-2 p-2 border rounded"
                          value={currentDish ? currentDish.categorie : newDish.categorie}
                          onChange={(e) => {
                            currentDish
                              ? setCurrentDish({ ...currentDish, categorie: e.target.value })
                              : setNewDish({ ...newDish, categorie: e.target.value });
                          }}
                        >
                          <option value="">-- Sélectionner une catégorie --</option>
                          <option value="entree">Entrée</option>
                          <option value="plat_principal">Plat principal</option>
                          <option value="dessert">Dessert</option>
                          <option value="boisson">Boisson</option>
                          <option value="accompagnement">Accompagnement</option>
                          <option value="autre">Autre</option>
                        </select>

                        <textarea
                          placeholder="Description"
                          className="w-full mb-2 p-2 border rounded"
                          value={currentDish?.description || newDish.description}
                          onChange={(e) =>
                            currentDish
                              ? setCurrentDish({ ...currentDish, description: e.target.value })
                              : setNewDish({ ...newDish, description: e.target.value })
                          }
                        />
                        <textarea
                          placeholder="Ingredients"
                          className="w-full mb-4 p-2 border rounded"
                          value={currentDish?.ingredients || newDish.ingredients}
                          onChange={(e) =>
                            currentDish
                              ? setCurrentDish({ ...currentDish, ingredients: e.target.value })
                              : setNewDish({ ...newDish, ingredients: e.target.value })
                          }
                        />

                        <input
                          type="file"
                          accept="image/*"
                          className="w-full mb-4"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              currentDish
                                ? setCurrentDish({ ...currentDish, image: file })
                                : setNewDish({ ...newDish, image: file });
                            }
                          }}
                        />

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowDishModal(false)}>
                            Annuler
                          </Button>
                          <Button
                            onClick={() => {
                              if (currentDish) {
                                handleEditDish(currentDish.id, currentDish); // modification
                              } else {
                                handleAddDish(); // ajout
                              }
                            }}
                          >
                            {currentDish ? "Modifier" : "Ajouter"}
                          </Button>

                        </div>
                      </div>
                    </div>
                  )}
    </div>
  );
};

export default Dashboard;