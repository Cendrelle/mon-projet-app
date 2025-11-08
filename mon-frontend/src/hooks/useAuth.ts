import { useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: 'ADMIN' | 'CUISINIER' | 'CLIENT';
  loyaltyPoints?: number;
  date_joined: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setUser({

      id: data.id, // Si tu veux l'id, il faut soit le renvoyer dans le login, soit faire une requête 'me'
      name: '',
      email: data.email,
      token: data.access,
      role: data.role
    });
    
    //const data = await res.json();

    if (!res.ok) throw new Error(data.detail || 'Login failed');

    localStorage.setItem('access_token', data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setAccessToken(data.access);

    // Récupérer le profil après login
    const profile = await fetchProfile(data.access);

    return profile; 
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string,
    phone?: string
  ) => {
    try {
      const userData = {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        password_confirm: passwordConfirm,
        phone,
      };
      console.log("Données envoyées:", userData);
      const res = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        const messages = Object.entries(data)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        throw new Error(messages || "Inscription échouée");
      }


      // Récupérer le token après inscription si le backend le renvoie
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
        await fetchProfile(data.access); // récupère le profil complet
      }

      return data;
    } catch (err) {
      console.error('Erreur lors de l’inscription:', err);
      throw err;
    }
  };


  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;  // <-- retourne le profil ici
      } else {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access_token');
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    try {
      if (refresh) {
        // Appel backend pour blacklist le refresh token
        await fetch("http://127.0.0.1:8000/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // obligatoire car IsAuthenticated
          },
          body: JSON.stringify({ refresh }),
        });
      }
    } catch (error) {
      console.error("Erreur logout:", error);
    } finally {
      // Nettoyage côté client
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null);
      setUser(null);
    }
  };



  const authFetch = async (url: string, options: RequestInit = {}) => {
    // Si pas de token → on fait un simple fetch normal
    if (!accessToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Content-Type': 'application/json',
        },
      });
    }

    // Sinon on met le token
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const getUserRole = () => user?.role || null;


  return {
    user,
    loading,
    accessToken,
    register,
    login,
    logout,
    authFetch,
    setUser,
    getUserRole
  };
};
