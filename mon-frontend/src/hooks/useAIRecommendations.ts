import { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '@/types/restaurant';
import { useAuth } from './useAuth';

export const useAIRecommendations = () => {
  const { authFetch, user } = useAuth();
  const [recommendations, setRecommendations] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await authFetch(`http://localhost:8000/api/recommandations/`);
        if (!res.ok) throw new Error('Erreur lors de la récupération des recommandations');
        
        const data = await res.json();             // data = { count, results, ...}
        const arr = Array.isArray(data) ? data : data.results;

        const mapped: MenuItemType[] = arr.map((item:any) => ({
          id: item.id.toString(),
          name: item.nom_plat,
          price: Number(item.prix),
          description: item.description,
          category: item.categorie,
          isAvailable: item.disponibilite,
          image: item.image || '',
          ingredients: item.ingredients,
        }));

        setRecommendations(mapped);  // ✔ utiliser mapped ici
      } catch (err:any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return { recommendations, loading, error };
};
