import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChefHat, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLoginProps {
  role: 'admin' | 'kitchen';
}

const AdminLogin = ({ role }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useAuth(); // notre hook connecté à l'API

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      // Vérifier que le rôle correspond à l'interface
      if (role === 'admin' && user.role !== 'ADMIN') {
        setError('Accès refusé. Rôle non autorisé');
        return;
      }
      if (role === 'kitchen' && user.role !== 'CUISINIER') {
        setError('Accès refusé. Rôle non autorisé');
        return;
      }

      // Redirection selon le rôle
      setUser(user);
      console.log(`Login réussi pour ${user.role}`);
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'kitchen') {
        navigate('/kitchen');
      }

    } catch (err: any) {
      setError(err.message || 'Erreur serveur, réessayez plus tard');
    } finally {
      setLoading(false);
    }
  };

  const isKitchen = role === 'kitchen';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            {isKitchen ? (
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Shield className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isKitchen ? 'Interface Cuisine' : 'Dashboard Admin'}
          </CardTitle>
          <CardDescription>
            {isKitchen 
              ? "Connectez-vous pour accéder à l'interface cuisine"
              : 'Connectez-vous pour accéder au tableau de bord'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={isKitchen ? "chef@restaurant.com" : "admin@restaurant.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
