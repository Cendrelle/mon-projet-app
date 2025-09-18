import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLogin from '@/pages/AdminLogin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ('admin' | 'kitchen')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  const mapRoleToFrontend = (role: "ADMIN" | "CUISINIER" | "CLIENT"): "admin" | "kitchen" => {
    switch (role) {
      case "ADMIN":
        return "admin";
      case "CUISINIER":
        return "kitchen";
      default:
        return "kitchen"; // ou "client"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin role={allowedRoles[0]} />;
  }

  const userRole = mapRoleToFrontend(user.role);

  // Vérifie si le rôle de l'utilisateur est dans la liste des rôles autorisés
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette interface.
            <br />
            <span className="text-sm">Rôle requis: {allowedRoles.join(", ")}, votre rôle: {userRole}</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};


export default ProtectedRoute;

