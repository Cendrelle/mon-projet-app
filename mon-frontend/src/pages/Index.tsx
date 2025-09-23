import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth'
import { useMenu } from '@/hooks/useMenu';
import { MenuItem as MenuItemType } from '@/types/restaurant';
import { useCart } from '@/hooks/useCart';
import { MenuItem, Order, User } from '@/types/restaurant';
import QRCodeScanner from '@/components/QRCodeScanner';
import OrderTypeSelector from '@/components/OrderTypeSelector';
import MenuCategory from '@/components/MenuCategory';
import CartSidebar from '@/components/CartSidebar';
import OrderTracking from '@/components/OrderTracking';
import LoginPrompt from '@/components/LoginPrompt';
import PaymentSelector from '@/components/PaymentSelector';
import DailySpecials from '@/components/DailySpecials';
import AIRecommendations from '@/components/AIRecommendations';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import LoyaltyPointsModal from '@/components/LoyaltyPointsModal';
import OrderHistory from '@/components/OrderHistory';
import RatingNotification from '@/components/RatingNotification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, MapPin, User as UserIcon, Gift, LogOut, History, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from "@/hooks/useOrders";
import NotesModal from '@/components/NotesModal';
import { v4 as uuidv4 } from 'uuid';


type AppState = 'scanner' | 'login' | 'menu' | 'orderType' | 'payment' | 'tracking' | 'history';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('scanner');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [user, setUser] = useState<User>({
  id: "",
  name: "",
  email: "",
  firstname: "",
  lastname: "",
  phone: "",
  loyaltyPoints: {
    earned_points: 0,
    total_points: 0,
  },
  orderHistory: [],
  preferences: [],
  date_joined: "",
});

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [showRatingNotification, setShowRatingNotification] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { recommendations, loading: loadingRecs, error: recsError } = useAIRecommendations();
  const { currentOrder, orderHistory, addOrder, completeCurrentOrder, updateCurrentOrderStatus, setCurrentOrder } = useOrders();
  const [dailySpecials, setDailySpecials] = useState<MenuItem[]>([])
  const { authFetch } = useAuth()
  const [loyaltyPoints, setLoyaltyPoints] = useState<{ earned_points: number; total_points: number } | null>(null);
  // State pour gérer le texte et la note en attente
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingRating, setPendingRating] = useState<number | null>(null);

  
  const handleCloseModal = () => setShowLoyaltyModal(false);
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!user) return;

      try {
        const res = await authFetch("http://localhost:8000/api/loyalty/");
        if (!res.ok) throw new Error("Erreur lors de la récupération des points");

        const data = await res.json();
        console.log("Points de fidélité :", data);

        setLoyaltyPoints(data.total_points); 
      } catch (err) {
        console.error("Erreur fetch loyauté:", err);
      }
    };
    fetchLoyaltyPoints();
  }, [user]);

  useEffect(() => {
    const fetchDailySpecials = async () => {
      try {
        const response = await authFetch("http://localhost:8000/api/daily-menu/")
        if (response.ok) {
          const data = await response.json()

          if (Array.isArray(data) && data.length > 0) {
            // On prend le premier menu du jour (ou tu peux boucler si tu veux plusieurs dates)
            const todayMenu = data[0]

            if (todayMenu.plats && Array.isArray(todayMenu.plats)) {
              const mapped: MenuItem[] = todayMenu.plats.map((plat: any) => ({
                id: plat.id.toString(),
                name: plat.name,
                description: plat.description,
                price: parseFloat(plat.prix),
                category: plat.category,
                isAvailable: plat.isAvailable,
                isDailySpecial: true
              }))
              setDailySpecials(mapped)
            } else {
              console.warn("Menu trouvé mais aucun plat :", todayMenu)
              setDailySpecials([])
            }
          } else {
            console.warn("Aucun menu du jour disponible :", data)
            setDailySpecials([])
          }
        }
      } catch (error) {
        console.error('Erreur lors du fetch du menu du jour', error)
      }
    }

    fetchDailySpecials()
  }, [])

  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  } = useCart();

  const handleScanComplete = (table: string) => {
    console.log('handleScanComplete appelé avec table:', table);
    console.log('État actuel avant mise à jour:', appState);
    setTableNumber(table);
    setAppState('login');
    setShowLoginPrompt(true);
    console.log('État mis à jour vers login');
    toast({
      title: "Table détectée !",
      description: `Bienvenue à la ${table}.`,
    });
  };

  const handleLogin = (userData: User) => {
    //console.log('handleLogin appelé:', userData);
    setUser(userData);
    setShowLoginPrompt(false);
    setAppState('menu');
    toast({
      title: "Connexion réussie !",
      description: `Bienvenue ${userData.name}. Vous avez ${userData.loyaltyPoints} points de fidélité.`,
    });
  };

  const handleSkipLogin = () => {
    console.log('handleSkipLogin appelé');
    setShowLoginPrompt(false);
    setAppState('menu');
    toast({
      title: "Bienvenue !",
      description: "Explorez notre menu.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
  };

  const handleAddToCart = (menuItem: MenuItem, customizations?: any) => {
    addItem(menuItem, customizations);
    toast({
      title: "Ajouté au panier",
      description: `${menuItem.name} a été ajouté à votre commande.`,
    });
  };

  const handleCheckout = () => {
    setAppState('orderType');
  };

  const handleOrderTypeSelect = (type: 'dine-in' | 'takeaway') => {
    console.log('Type de service sélectionné:', type);
    setOrderType(type);
    setAppState('payment');
    toast({
      title: "Type de service sélectionné",
      description: `Vous avez choisi: ${type === 'dine-in' ? 'Sur place' : 'À emporter'}`,
    });
  };

  
  const handleBack = () => {
    setShowOrderHistory(false);
  };

  const handleTrackOrder = (order) => {
    setCurrentOrder(order);
    setShowOrderTracking(true); 
    navigate(`/suivi/${order.commande_uuid}`);
  };

  const handlePaymentSelect = async (paymentMethod: 'cash' | 'mobile') => {
    try {
      const tableNumInt = parseInt(tableNumber.replace(/\D/g, ''), 10);

      const res = await fetch('http://localhost:8000/api/valider-commande/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_service: orderType === 'dine-in' ? 'sur_place' : 'emporter',
          table_number: tableNumInt,
          plats: items.map(item => ({
            plat: item.menuItem.id,
            quantite: item.quantity,
            prix: item.menuItem.price, 
          }))
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la validation de la commande");
      }

      // Ici tu vois la réponse complète
      const data = await res.json();
      console.log("Réponse backend:", data);

      const order: Order = {
        id: `order-${Date.now()}`,
        tableNumber,
        items: items.map(item => ({
          ...item,
          customizations: {
            ...item.customizations,
            generalNotes: orderNotes
          }
        })),
        status: 'confirmed',
        total: data.total || getTotal(),
        timestamp: new Date(),
        orderType,
        paymentMethod,
        customerInfo: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          loyaltyPoints: user.loyaltyPoints = data.total_points
        } : undefined,
        commande_uuid: data.commande_uuid,
      };

      addOrder(order);
      clearCart();
      setOrderNotes('');
      setAppState('tracking');

      // Simulation de points de fidélité
      if (user.id) {
        const pointsEarned = Math.floor(getTotal());
        const earned = user.loyaltyPoints?.earned_points ?? 0;
        const total = user.loyaltyPoints?.total_points ?? 0;
        setUser({ ...user, loyaltyPoints: {
          ...user.loyaltyPoints,
          earned_points: earned + pointsEarned,
          total_points: total + pointsEarned, // si tu veux aussi incrémenter
        }});
        toast({
          title: "Commande confirmée !",
          description: `Votre commande a été transmise. +${pointsEarned} points de fidélité gagnés !`,
        });
      } else {
        toast({
          title: "Commande confirmée !",
          description: "Votre commande a été transmise à la cuisine.",
        });
      }

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erreur",
        description: err.message,
        // status: "error",
      });
    }
    
  };


  const handleBackToMenu = () => {
    setAppState('menu');
  };

  const handleShowHistory = () => {
    setAppState('history');
  };

  const handleBackFromHistory = () => {
    setAppState('menu');
  };
  
  // Système de notification de rating automatique
  useEffect(() => {
    let ratingTimer: NodeJS.Timeout;
    
    if (currentOrder?.status === 'delivered') {
      // Attendre 3 minutes après que la commande soit servie
      ratingTimer = setTimeout(() => {
        setOrderToRate(currentOrder);
        setShowRatingNotification(true);
      }, 180000); // 3 minutes = 180000ms
    }
    
    return () => {
      if (ratingTimer) {
        clearTimeout(ratingTimer);
      }
    };
  }, [currentOrder?.status]);
  const submitRating = async (rating: number, notes: string) => {
    if (!orderToRate) return;

    try {
      const response = await authFetch('http://localhost:8000/api/avis/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: user?.id,
          commande: orderToRate.id,
          note: rating,
          description: notes
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de l’envoi de la note');

      toast({
        title: 'Merci pour votre avis !',
        description: 'Votre note a été enregistrée avec succès.',
      });

      setShowRatingNotification(false);
      setOrderToRate(null);
      completeCurrentOrder();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d’envoyer votre note.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDismissRating = () => {
    setShowRatingNotification(false);
    setOrderToRate(null);
  };

  // après avoir récupéré le menu depuis useMenu
  const { menu } = useMenu();

  const categories: MenuItemType['category'][] = [
    'entree',
    'plat_principal',
    'dessert',
    'boisson',
    'accompagnement',
    'autre',
  ];

  const groupedMenuItems: Record<string, MenuItemType[]> = {};
  categories.forEach(category => {
    groupedMenuItems[category] = menu.filter(
      item => item.category === category && item.isAvailable
    );
  });


  console.log('État actuel de l\'app:', appState);

  if (appState === 'scanner') {
    console.log('Rendu du scanner QR');
    return <QRCodeScanner onScanComplete={handleScanComplete} />;
  }

  if (appState === 'login' && showLoginPrompt) {
    console.log('Rendu de la page de connexion');
    return (
      <div className="min-h-screen bg-gradient-to-br from-restaurant-400 to-restaurant-600 flex items-center justify-center p-4">
        <LoginPrompt
          onLogin={handleLogin}
          onSkip={handleSkipLogin}
          onClose={() => {
            setShowLoginPrompt(false);
            setAppState('menu');
          }}
        />
      </div>
    );
  }

  if (appState === 'orderType') {
    return <OrderTypeSelector onSelectType={handleOrderTypeSelect} />;
  }

  if (appState === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <PaymentSelector onSelectPayment={handlePaymentSelect} total={getTotal()} />
      </div>
    );
  }

  if (appState === 'tracking' && currentOrder) {
    return <OrderTracking 
      order={currentOrder} 
      onBackToMenu={handleBackToMenu}  
      commande_uuid={currentOrder.commande_uuid}    
    />;
  }

  if (appState === 'history') {
    return <OrderHistory
      user={user}
      onBack={handleBackFromHistory}
      currentOrder={currentOrder}
      orderHistory={orderHistory}  
      onTrackOrder={(order) => {
        setCurrentOrder(order);
        setAppState('tracking');
      }}
    />
  }

  const restaurantInfo = {
    name: "Easy Restaurant",
    description: "Passez vos commandes rapidement",
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {showLoyaltyModal && user && (
        <LoyaltyPointsModal
          user={{ ...user, loyaltyPoints }} 
          onClose={handleCloseModal}
          onBack={() => navigate('/')}
        />

      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between'}`}>
            {/* Restaurant Info */}
            <div className={isMobile ? 'text-center' : ''}>
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {restaurantInfo.name}
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>{restaurantInfo.description}</p>
            </div>
            
            {/* Actions */}
            <div className={`${isMobile ? 'space-y-3' : 'flex items-center space-x-3'}`}>
              {/* Table Badge */}
              <div className={isMobile ? 'flex justify-center' : ''}>
                <Badge variant="outline" className={`flex items-center space-x-1 ${isMobile ? 'px-4 py-2 text-base font-medium' : ''}`}>
                  <MapPin className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                  <span>{tableNumber}</span>
                </Badge>
              </div>
              
              {/* User Actions */}
              {user ? (
                <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex items-center space-x-2'}`}>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => setShowLoyaltyModal(true)}
                    className={`bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 ${isMobile ? 'min-h-12 px-4' : ''}`}
                  >
                    <Gift className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-3 h-3 mr-1'}`} />
                    {user?.loyaltyPoints?.total_points ?? 0} pts
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => navigate('/profile')}
                    className={`${isMobile ? 'min-h-12 px-4' : ''}`}
                  >
                    <Settings className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    {isMobile ? 'Mon profil' : 'Profil'}
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={handleShowHistory}
                    className={`${isMobile ? 'min-h-12 px-4' : ''}`}
                  >
                    <History className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    {isMobile ? 'Historique' : 'Historique'}
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={handleLogout}
                    className={`${isMobile ? 'min-h-12 px-4' : ''}`}
                  >
                    <LogOut className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    {isMobile ? 'Déconnexion' : 'Déconnexion'}
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => setAppState('scanner')}
                    className={`${isMobile ? 'min-h-12 px-4' : ''}`}
                  >
                    <QrCode className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    {isMobile ? 'Changer table' : 'Changer table'}
                  </Button>
                </div>
              ) : (
                <div className={`${isMobile ? 'flex space-x-3' : 'flex items-center space-x-2'}`}>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => {
                      setAppState('login');
                      setShowLoginPrompt(true);
                    }}
                    className={`${isMobile ? 'min-h-12 px-4 flex-1' : ''}`}
                  >
                    <UserIcon className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    Se connecter
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => setAppState('scanner')}
                    className={`${isMobile ? 'min-h-12 px-4 flex-1' : ''}`}
                  >
                    <QrCode className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 mr-1'}`} />
                    Changer table
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Daily Specials */}
        <DailySpecials 
          specialItems={dailySpecials} 
          onAddToCart={handleAddToCart}
        />
        
        {/* AI Recommendations - uniquement pour les clients connectés */}
        {user && (
          <AIRecommendations 
            user={user} 
            menuItems={recommendations}
            onAddToCart={handleAddToCart}
          />
        )}

        <Tabs defaultValue={categories[0]} className="space-y-6">
          <TabsList className={`${isMobile ? 'grid w-full grid-cols-2 h-auto' : 'grid w-full grid-cols-4'}`}>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className={`data-[state=active]:bg-restaurant-500 data-[state=active]:text-white ${isMobile ? 'py-3 text-sm' : ''}`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <MenuCategory
                category={category}
                items={groupedMenuItems[category] || []}
                onAddToCart={handleAddToCart}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Rating Notification */}
      {showRatingNotification && orderToRate && (
        <RatingNotification
          order={orderToRate}
          onRate={(rating: number) => {
            setPendingRating(rating);  // stocke la note
            setShowNotesModal(true);   // ouvre le modal pour le commentaire
            setShowRatingNotification(false); // masque notification mais ne supprime pas orderToRate
          }}
          onDismiss={() => {
            setShowRatingNotification(false);
            setOrderToRate(null); // supprimer seulement si l'utilisateur ignore la note
          }}
        />
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal
          currentNotes=""
          onConfirm={(notes) => {
            if (pendingRating !== null && orderToRate) {
              submitRating(pendingRating, notes); // fetch sera lancé ici
              setPendingRating(null);
              setShowNotesModal(false);
              setOrderToRate(null); // nettoyage après l'envoi
            }
          }}
          onCancel={() => {
            setPendingRating(null);
            setShowNotesModal(false);
          }}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        total={getTotal()}
        itemCount={getItemCount()}
        orderNotes={orderNotes}
        onUpdateNotes={setOrderNotes}
        tableNumber={tableNumber}
      />
    </div>
  );
};

export default Index;