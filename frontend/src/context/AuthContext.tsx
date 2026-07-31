import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import api, { setToken } from "../services/api";

interface User {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  timezone?: string;
  slug?: string;
  calendarConnected?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
   loadUser: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

    async function loadUser() {
    try {
      const res = await api.get("/users/me");
          console.log("Axios response:", res);
          console.log("Axios response.data:", res.data);
      setUser({
        username: res.data.username,
        email: res.data.email,
        bio: res.data.bio,
        avatar: res.data.avatar,
        timezone: res.data.timezone,
        slug: res.data.slug,
        calendarConnected: res.data.calendarConnected
      });
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(token: string) {
  setToken(token);

  localStorage.setItem("accessToken", token);

  await loadUser();
}

async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.log(err);
  } finally {
    setToken(null);
    localStorage.removeItem("accessToken");
    setUser(null);
  }
}
useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    setToken(token);
    loadUser();
  } else {
    setLoading(false);
  }
}, []);

return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      setUser,
      loadUser,
      login,
      logout,
    }}
  >
    {children}
  </AuthContext.Provider>
);

}

