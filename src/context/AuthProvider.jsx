import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import apiClient from "../api/client";

const getApiErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || fallback;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get("/auth/me", {
        signal: controller.signal,
      })
      .then((response) => {
        if (controller.signal.aborted) return;

        setUser(response.data.data);
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post(
        "/auth/login",
        credentials
      );

      const authenticatedUser = response.data.data;

      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (err) {
      const message = getApiErrorMessage(err, "Login failed");

      throw new Error(message, {
        cause: err,
      });
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Logout failed");

      throw new Error(message, {
        cause: err,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}