import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiPost } from '@/lib/api';

interface AuthState {
  loggedIn: boolean;
  token: string | null;
  username: string;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthFromToken: (token: string) => void;
}

interface LoginResponse {
  token?: string;
  username?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loggedIn: false,
    token: null,
    username: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const storedToken = localStorage.getItem('token');
    if (tokenFromUrl) {
      verifyAndSet(tokenFromUrl);
    } else if (storedToken) {
      verifyAndSet(storedToken);
    }
  }, []);

  async function verifyAndSet(token: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/verify-token/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setState({ loggedIn: true, token, username: data.username });
        localStorage.setItem('token', token);
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      // offline
    }
  }

  async function login(username: string, password: string) {
    const res = await apiPost('login/', { username, password });
    const resData = res.data as LoginResponse;
    if (res.status === 200 && resData?.token) {
      setState({ loggedIn: true, token: resData.token, username: resData.username ?? '' });
      localStorage.setItem('token', resData.token);
      return true;
    }
    return false;
  }

  function logout() {
    if (state.token) apiPost('logout/', {}, state.token).catch(() => {});
    setState({ loggedIn: false, token: null, username: '' });
    localStorage.removeItem('token');
  }

  function setAuthFromToken(token: string) {
    verifyAndSet(token);
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setAuthFromToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}