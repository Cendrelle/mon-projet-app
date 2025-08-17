import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { MenuItem as MenuItemType } from '@/types/restaurant';

export interface PlatMenuBackend {
  id: number;
  nom_plat: string;
  prix: number;
  categorie: 'entree' | 'plat_principal' | 'dessert' | 'boisson' | 'accompagnement' | 'autre';
  disponibilite: boolean;
  description: string;
  image?: string;
  ingredients: string;
}

export const useMenu = () => {
  const { authFetch } = useAuth();
  const [menu, setMenu] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/menu/');
        if (!res.ok) throw new Error('Erreur lors de la récupération du menu');

        const data = await res.json();
        console.log('Menu reçu depuis Django :', data);

        // Récupérer le tableau réel
        const menuArray: PlatMenuBackend[] = Array.isArray(data) ? data : data.results;

        // Mapping backend -> frontend type
        const mappedMenu: MenuItemType[] = menuArray.map(item => ({
          id: item.id.toString(),           // MenuItem attend string pour id
          name: item.nom_plat,
          price: Number(item.prix),         // s'assurer que c'est un nombre
          category: item.categorie,
          isAvailable: item.disponibilite,
          description: item.description,
          image: item.image || '',
          ingredients: item.ingredients,
        }));

        console.log('Menu récupéré depuis le backend (mapped) :', mappedMenu);

        setMenu(mappedMenu);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [authFetch]);

  return { menu, loading, error };
};
