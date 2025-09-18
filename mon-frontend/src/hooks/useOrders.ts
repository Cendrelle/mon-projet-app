// src/hooks/useOrders.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Order, BackendCommande } from "@/types/restaurant";

const mapStatus = (status: string): "pending" | "confirmed" | "preparing" | "ready" | "delivered" => {
  switch (status) {
    case "en_attente":
      return "pending";
    case "confirmee":
      return "confirmed";
    case "en_cours":
      return "preparing";
    case "pretee":
      return "ready";
    case "servie":
      return "delivered";
    default:
      return "pending";
  }
};

export const mapBackendToOrder = (backendOrder: BackendCommande): Order => ({
  id: `order-${backendOrder.commande}`,
  tableNumber: "",  // si tu n’as pas la table
  items: backendOrder.plats.map(p => ({
    id: String(p.plat),
    menuItem: {
      id: String(p.plat),
      name: `Plat ${p.plat}`,   // placeholder si le nom n’est pas fourni
      description: "",
      category: "",
      price: p.prix,
      isAvailable: true,
    },
    quantity: p.quantite,
    price: p.prix,
    customizations: {},
  })),
  status: mapStatus(backendOrder.statut),
  total: backendOrder.plats.reduce(
    (sum, p) => sum + p.prix * p.quantite,
    0
  ),
  timestamp: new Date(backendOrder.date),
  orderType: "dine-in", // ou "takeaway" si tu as type_service
  paymentMethod: "cash", // par défaut si mode n’est pas renvoyé
  rating: undefined,     // si pas de rating
});


export const useOrders = () => {
  const [backendOrders, setBackendOrders] = useState<BackendCommande[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const { authFetch, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/mes-commandes/");
        console.log(res.status, res.url);  
        if (!res.ok) {
          console.error("Erreur fetch:", res.status, await res.text());
          return;
        }
         const text = await res.text();
          try {
            const data: BackendCommande[] = JSON.parse(text);
            setBackendOrders(data);
            const mappedOrders = data.map(mapBackendToOrder);
            setOrderHistory(mappedOrders);
      } catch (err) {
        console.error("Réponse reçue n’est pas du JSON :", text.slice(0, 200));
      }
      } catch (err) {
        console.error("Erreur récupération commandes:", err);
      }
    };

    fetchOrders();
  }, [user]);

  // Ajouter une nouvelle commande
  const addOrder = (order: Order) => {
    setCurrentOrder(order);
    setOrderHistory(prev => [order, ...prev]);
  };

  // Mettre à jour le statut de la commande actuelle
  const updateCurrentOrderStatus = (status: Order['status']) => {
    if (currentOrder) {
      const updatedOrder = { ...currentOrder, status };
      setCurrentOrder(updatedOrder);
      setOrderHistory(prev => 
        prev.map(order => order.id === currentOrder.id ? updatedOrder : order)
      );
    }
  };

  // Marquer la commande comme terminée
  const completeCurrentOrder = () => {
    if (currentOrder) {
      const completedOrder = { ...currentOrder, status: 'delivered' as const };
      setOrderHistory(prev => 
        prev.map(order => order.id === currentOrder.id ? completedOrder : order)
      );
      setCurrentOrder(null);
    }
  };

  // Récupérer une commande par ID
  const getOrderById = (orderId: string) => {
    return orderHistory.find(order => order.id === orderId);
  };

  return {
    currentOrder,
    orderHistory,
    backendOrders,
    addOrder,
    updateCurrentOrderStatus,
    completeCurrentOrder,
    getOrderById,
    setCurrentOrder
  };
};
