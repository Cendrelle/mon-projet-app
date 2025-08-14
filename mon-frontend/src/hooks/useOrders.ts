import { useState, useEffect } from 'react';
import { Order } from '@/types/restaurant';

export const useOrders = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

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
        prev.map(order => 
          order.id === currentOrder.id ? updatedOrder : order
        )
      );
    }
  };

  // Marquer la commande comme terminée
  const completeCurrentOrder = () => {
    if (currentOrder) {
      const completedOrder = { ...currentOrder, status: 'delivered' as const };
      setOrderHistory(prev => 
        prev.map(order => 
          order.id === currentOrder.id ? completedOrder : order
        )
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
    addOrder,
    updateCurrentOrderStatus,
    completeCurrentOrder,
    getOrderById,
    setCurrentOrder
  };
};