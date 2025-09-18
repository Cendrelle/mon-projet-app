
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, MessageSquare } from 'lucide-react';
import { CartItem } from '@/types/restaurant';
import { useIsMobile } from '@/hooks/use-mobile';
import NotesModal from './NotesModal';
import { useAuth } from '@/hooks/useAuth';

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  total: number;
  itemCount: number;
  orderNotes?: string;
  onUpdateNotes?: (notes: string) => void;
  tableNumber: string;
  // price: number;
}

const CartSidebar = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  total, 
  itemCount,
  orderNotes = '',
  onUpdateNotes,
  tableNumber
}: CartSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const isMobile = useIsMobile();
  const { authFetch } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className={`fixed ${isMobile ? 'bottom-3 right-3 w-12 h-12' : 'bottom-5 right-5 w-14 h-14'} bg-restaurant-500 hover:bg-restaurant-600 text-white rounded-full shadow-xl z-50 flex items-center justify-center`}
          size="lg"
          style={{ 
            position: 'fixed',
            right: isMobile ? '16px' : '24px',
            bottom: isMobile ? '16px' : '24px',
            zIndex: 999
          }}
        >
          <ShoppingCart className={isMobile ? 'w-7 h-7' : 'w-6 h-6'} />
          {itemCount > 0 && (
            <Badge className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full ${isMobile ? 'w-7 h-7 text-sm' : 'w-6 h-6 text-xs'} p-0 flex items-center justify-center font-bold`}>
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Votre commande</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Votre panier est vide</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                 <div key={item.id} className={`border border-gray-200 rounded-lg ${isMobile ? 'p-5' : 'p-4'}`}>
                   <div className="flex justify-between items-start mb-2">
                     <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : ''}`}>{item.menuItem.name}</h4>
                     <button
                       onClick={() => onRemoveItem(item.id)}
                       className={`text-red-500 hover:text-red-700 ${isMobile ? 'p-2' : ''}`}
                     >
                       <Trash2 className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                     </button>
                   </div>
                   
                   {(item.customizations.cooking || item.customizations.sides?.length || item.customizations.notes) && (
                     <div className={`text-gray-500 mb-2 space-y-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                       {item.customizations.cooking && (
                         <div>Cuisson: {item.customizations.cooking}</div>
                       )}
                       {item.customizations.sides?.length > 0 && (
                         <div>Accompagnements: {item.customizations.sides.join(', ')}</div>
                       )}
                       {item.customizations.notes && (
                         <div>Notes: {item.customizations.notes}</div>
                       )}
                     </div>
                   )}
                   
                   <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                       <Button
                         variant="outline"
                         size={isMobile ? 'default' : 'sm'}
                         onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                         className={isMobile ? 'w-10 h-10 p-0' : 'w-8 h-8 p-0'}
                       >
                         <Minus className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                       </Button>
                       <span className={`font-medium ${isMobile ? 'text-lg px-2' : ''}`}>{item.quantity}</span>
                       <Button
                         variant="outline"
                         size={isMobile ? 'default' : 'sm'}
                         onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                         className={isMobile ? 'w-10 h-10 p-0' : 'w-8 h-8 p-0'}
                       >
                         <Plus className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                       </Button>
                     </div>
                     <span className={`font-semibold ${isMobile ? 'text-lg' : ''}`}>
                       {(item.menuItem.price * item.quantity).toFixed(2)}FCFA
                     </span>
                   </div>
                 </div>
              ))}
              
              <div className="border-t pt-4 space-y-4">
                {/* Remarques */}
                {orderNotes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Remarques :</strong> {orderNotes}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}FCFA</span>
                </div>
                
                <div className="space-y-2">
                  {onUpdateNotes && (
                    <Button
                      variant="outline"
                      onClick={() => setShowNotesModal(true)}
                      className={`w-full ${isMobile ? 'min-h-12 text-base' : 'h-10 text-sm'}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Autres remarques
                    </Button>
                  )}
                  
                  {/* <Button 
                    onClick={async () => {
                      if (items.length === 0) return;
                      console.log({ tableNumber, items });

                      setIsSubmitting(true);
                      try {
                        const tableNumInt = parseInt(tableNumber.replace(/\D/g, ''), 10);
                        const res = await authFetch('http://localhost:8000/api/valider-commande/', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            type_service: 'sur_place', 
                            table_number: tableNumInt,
                            plats: items.map((item: CartItem) => ({
                              plat: item.menuItem.id,       
                              quantite: item.quantity,
                              prix: item.menuItem.price   
                            }))
                          }), 
                        });

                        const data = await res.json();

                        if (!res.ok) {
                          throw new Error(data.error || "Erreur lors de la validation de la commande");
                        }

                        // alert(`Commande validée ! Total: ${data.total} FCFA`);
                        // onClearCart(); // Vider le panier côté frontend
                        // setIsOpen(false);

                      } catch (err: any) {
                        alert(err.message);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className={`w-full bg-restaurant-500 hover:bg-restaurant-600 text-white ${isMobile ? 'min-h-14 text-lg' : ''}`}
                    size="lg"
                    disabled={items.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? 'Validation...' : 'Commander'}
                  </Button> */}
                  <Button onClick={onCheckout}>
                    Commander
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
      
      {showNotesModal && onUpdateNotes && (
        <NotesModal
          currentNotes={orderNotes}
          onConfirm={(notes) => {
            onUpdateNotes(notes);
            setShowNotesModal(false);
          }}
          onCancel={() => setShowNotesModal(false)}
        />
      )}
    </Sheet>
  );
};

export default CartSidebar;
