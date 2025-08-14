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

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access_token');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    await fetchProfile(data.access);

    if (!user) throw new Error('Impossible de récupérer le profil');

    return user;
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
    login,
    logout,
    authFetch,
  };
};
