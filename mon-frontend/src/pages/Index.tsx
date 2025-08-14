import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { restaurantInfo, menuItems, dailySpecials } from '@/data/menuData';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
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
import LoyaltyPointsModal from '@/components/LoyaltyPointsModal';
import OrderHistory from '@/components/OrderHistory';
import RatingNotification from '@/components/RatingNotification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, MapPin, User as UserIcon, Gift, LogOut, History, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AppState = 'scanner' | 'login' | 'menu' | 'orderType' | 'payment' | 'tracking' | 'history';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('scanner');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [user, setUser] = useState<User | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [showRatingNotification, setShowRatingNotification] = useState(false);
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const { currentOrder, orderHistory, addOrder, completeCurrentOrder, setCurrentOrder } = useOrders();
  
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
    console.log('handleLogin appelé:', userData);
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

  const handlePaymentSelect = (paymentMethod: 'cash' | 'mobile') => {
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
      total: getTotal(),
      timestamp: new Date(),
      orderType,
      paymentMethod,
      customerInfo: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints
      } : undefined
    };
    
    addOrder(order);
    clearCart();
    setOrderNotes('');
    setAppState('tracking');
    
    // Simulation de points de fidélité
    if (user) {
      const pointsEarned = Math.floor(getTotal());
      setUser({ ...user, loyaltyPoints: user.loyaltyPoints + pointsEarned });
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
  
  const handleRateOrder = (rating: number) => {
    if (orderToRate) {
      // Ici on pourrait envoyer la note au backend
      console.log('Rating submitted:', { orderId: orderToRate.id, rating });
      setShowRatingNotification(false);
      setOrderToRate(null);
      completeCurrentOrder();
    }
  };
  
  const handleDismissRating = () => {
    setShowRatingNotification(false);
    setOrderToRate(null);
  };

  const groupedMenuItems = restaurantInfo.categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category && item.isAvailable);
    return acc;
  }, {} as Record<string, MenuItem[]>);

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
    return <OrderTracking order={currentOrder} onBackToMenu={handleBackToMenu} />;
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
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showLoyaltyModal && user && (
        <LoyaltyPointsModal
          user={user}
          onClose={() => setShowLoyaltyModal(false)}
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
                    {user.loyaltyPoints} pts
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
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
          />
        )}

        <Tabs defaultValue={restaurantInfo.categories[0]} className="space-y-6">
          <TabsList className={`${isMobile ? 'grid w-full grid-cols-2 h-auto' : 'grid w-full grid-cols-4'}`}>
            {restaurantInfo.categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className={`data-[state=active]:bg-restaurant-500 data-[state=active]:text-white ${isMobile ? 'py-3 text-sm' : ''}`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {restaurantInfo.categories.map((category) => (
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
          onRate={handleRateOrder}
          onDismiss={handleDismissRating}
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
      />
    </div>
  );
};

export default Index;