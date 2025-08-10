import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-8">
          La page que vous cherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;