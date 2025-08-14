import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLogin from '@/pages/AdminLogin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  role: 'admin' | 'kitchen';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading, getUserRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin role={role} />;
  }

  const userRole = getUserRole();
  
  // Vérifier si l'utilisateur a le bon rôle
  if (userRole !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette interface.
            <br />
            <span className="text-sm">Rôle requis: {role}, votre rôle: {userRole}</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;