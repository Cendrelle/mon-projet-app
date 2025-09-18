
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, X, Star, Trophy } from 'lucide-react';
import { User } from '@/types/restaurant';

interface LoyaltyPointsModalProps {
  user: User;
  onClose: () => void;
}

const LoyaltyPointsModal = ({ user, onClose }: LoyaltyPointsModalProps) => {
  const nextRewardThreshold = 250;
  const pointsNeeded = nextRewardThreshold - user.loyaltyPoints;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span>Points de Fidélité</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {user.loyaltyPoints} points
            </h3>
            <p className="text-gray-600">Vos points de fidélité actuels</p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
            {pointsNeeded > 0 ? (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-amber-700">Prochaine récompense</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  À partir de <strong>{nextRewardThreshold} points</strong>, vous bénéficiez d'une réduction de 10% sur votre prochaine commande !
                </p>
                <Badge variant="outline" className="bg-white border-amber-300 text-amber-700">
                  Plus que {pointsNeeded} points à gagner
                </Badge>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Trophy className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-700">Félicitations !</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Vous avez droit à une réduction de 10% sur votre prochaine commande !
                </p>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Réduction disponible
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <h4 className="font-medium text-gray-900">Comment gagner des points :</h4>
            <ul className="space-y-1">
              <li>• 1 point = 1€ de commande soit 656 FCFA</li>
              <li>• Bonus de 20 points à chaque 5ème commande</li>
              <li>• Points doublés les weekends</li>
            </ul>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-restaurant-500 hover:bg-restaurant-600"
          >
            Continuer mes achats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyPointsModal;
