import { useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUISINIER' | 'CLIENT';
  loyaltyPoints?: number;
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

    if (!res.ok) throw new Error(data.detail || 'Login failed');

    localStorage.setItem('access_token', data.access);
    setAccessToken(data.access);

    // Récupérer le profil après login
    const profile = await fetchProfile(data.access);
    return profile; 
  };

  const register = async (firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string,
    phone?: string
  ) => {
    try {
      const res = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          password,
          password_confirm: passwordConfirm, // <- ici
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Inscription échouée');

      // Récupérer le token après inscription si le backend le renvoie
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
        await fetchProfile(data.access); // récupère le profil complet
      }

      return user;
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
    localStorage.removeItem('access_token');
    setUser(null);
    setAccessToken(null);
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) throw new Error('No access token');
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return res;
  };

  return {
    user,
    loading,
    accessToken,
    register,
    login,
    logout,
    authFetch,
  };
};
