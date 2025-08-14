

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Gift, X, LogIn } from 'lucide-react';

interface LoginPromptProps {
  onLogin: (user: any) => void;
  onSkip: () => void;
  onClose: () => void;
}

const LoginPrompt = ({ onLogin, onSkip, onClose }: LoginPromptProps) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = () => {
    // Simulation d'un utilisateur connecté ou inscrit
    const mockUser = {
      id: 'user-1',
      name: isRegistering ? `${firstName} ${lastName}` : 'Client Fidèle',
      email: email || 'client@example.com',
      phone: phone || '',
      loyaltyPoints: isRegistering ? 0 : 150,
      preferences: ['viande', 'dessert'],
      orderHistory: []
    };
    onLogin(mockUser);
  };

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
            <User className="w-5 h-5 text-restaurant-500" />
            <span>{isRegistering ? 'Inscription' : 'Connexion optionnelle'}</span>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Gift className="w-4 h-4 text-amber-500" />
            <span>Gagnez des points de fidélité et accédez aux recommandations IA</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {isRegistering && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Nom de famille"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isRegistering && (
              <>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full bg-restaurant-500 hover:bg-restaurant-600"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isRegistering ? "S'inscrire" : "Se connecter"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full"
            >
              {isRegistering ? "Déjà inscrit ? Se connecter" : "Pas encore inscrit ? S'inscrire"}
            </Button>

            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full text-sm"
            >
              Continuer sans se connecter
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
              <Gift className="w-3 h-3 mr-1" />
              Vous avez 150 points de fidélité !
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPrompt;