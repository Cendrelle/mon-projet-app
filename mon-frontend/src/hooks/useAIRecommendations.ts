import { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '@/types/restaurant';
import { useAuth } from './useAuth';

export const useAIRecommendations = () => {
  const { authFetch, user } = useAuth(); // on a besoin de l'utilisateur connecté
  const [recommendations, setRecommendations] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return; // pas d'utilisateur → pas de recommandations

      try {
        setLoading(true);
        const res = await authFetch(`http://localhost:8000/api/recommandations/`);
        if (!res.ok) throw new Error('Erreur lors de la récupération des recommandations');
        const data: MenuItemType[] = await res.json();

        setRecommendations(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, authFetch]);

  return { recommendations, loading, error };
};
