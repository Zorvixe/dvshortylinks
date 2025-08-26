"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Keep token in state so it updates reactively across the app
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper: persist token both in state & localStorage
  const persistToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  // Fetch current user using /api/me
  const fetchMe = async (currentToken) => {
    try {
      const res = await fetch(`${apiUrl}/api/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (res.status === 401 || res.status === 403) {
        // Only clear token on explicit auth failures
        persistToken(null);
        setUser(null);
        return { ok: false };
      }

      if (!res.ok) {
        // Transient error (network/CORS/server). Keep token; show error state.
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to restore session");
      }

      const data = await res.json();
      setUser(data.user || null);
      return { ok: true };
    } catch (e) {
      console.error("fetchMe error:", e);
      setError(e.message || "Failed to restore session");
      // DO NOT remove token here; let user refresh or we retry on next mount
      return { ok: false, error: e.message };
    }
  };

  // Initialize on mount / when apiUrl or token changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      const currentToken = token || localStorage.getItem("token");

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const result = await fetchMe(currentToken);
      if (!cancelled) setLoading(false);
      if (!result.ok && !cancelled) {
        // keep user as-is or null; token is preserved unless 401/403
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, token]);

  // ------- Auth actions -------

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      persistToken(data.token);
      setUser(data.user || null);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, referralCode) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, referralCode }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      persistToken(data.token);
      setUser(data.user || null);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  // Called by /auth-callback after social login
  const socialLogin = async (incomingToken) => {
    try {
      setLoading(true);
      setError("");
      persistToken(incomingToken);
      const result = await fetchMe(incomingToken);
      if (!result.ok) throw new Error("Social login failed");
      return { success: true };
    } catch (e) {
      persistToken(null);
      setUser(null);
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      API_BASE_URL: apiUrl,
      isAuthenticated: !!user && !!token,
      login,
      register,
      socialLogin,
      logout,
    }),
    [user, token, loading, error, apiUrl]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
