
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentSelectorProps {
  onSelectPayment: (method: 'cash' | 'mobile') => void;
  total: number;
}

const PaymentSelector = ({ onSelectPayment, total }: PaymentSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mode de paiement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-restaurant-600">
            Total: {total.toFixed(2)}FCFA
          </span>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => onSelectPayment('mobile')}
            className="w-full h-16 bg-restaurant-500 hover:bg-restaurant-600 text-white flex items-center justify-center space-x-3"
            size="lg"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-lg">Paiement mobile</span>
          </Button>

          <Button
            onClick={() => onSelectPayment('cash')}
            variant="outline"
            className="w-full h-16 border-restaurant-500 text-restaurant-600 hover:bg-restaurant-50 flex items-center justify-center space-x-3"
            size="lg"
          >
            <Banknote className="w-6 h-6" />
            <span className="text-lg">Paiement en espèces</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSelector;
