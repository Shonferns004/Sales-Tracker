import { useCallback, useEffect, useState } from 'react';

const SESSION_KEY = 'app_session';
const SESSION_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => getStoredSession());

  useEffect(() => {
    const session = getStoredSession();
    if (session) setUser(session);
  }, []);

  const login = useCallback((username, password) => {
    const validUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const validPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (username !== validUser || password !== validPass) {
      return false;
    }
    const session = {
      username: validUser,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, login, logout, isAuthenticated: !!user };
}
