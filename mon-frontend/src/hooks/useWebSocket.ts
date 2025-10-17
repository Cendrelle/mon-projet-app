import { useEffect, useRef, useState } from 'react';

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

export const useOrderWebSocket = (onNewOrder: (order: Order) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>(); // Stocker le ping interval séparément

  useEffect(() => {
    const connect = () => {
      // Connexion WebSocket
      const token = localStorage.getItem("token"); // ou récupéré après login
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/orders/?token=${token}`);

      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connecté');
        setIsConnected(true);
        
        // Ping pour maintenir la connexion
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // Ping toutes les 30s
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_order') {
          console.log('Nouvelle commande reçue:', data.order);
          onNewOrder(data.order);
          
          // Notification sonore
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Erreur audio:', e));
        }
        
        if (data.type === 'order_updated') {
          console.log('Commande mise à jour:', data.order);
          // Logique de mise à jour
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket erreur:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket déconnecté');
        setIsConnected(false);
        
        // Nettoyer l'interval de ping
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
        
        // Reconnexion automatique après 3 secondes
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Tentative de reconnexion...');
          connect();
        }, 3000);
      };
    };

    connect();

    // Nettoyage
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onNewOrder]);

  return { isConnected };
};