import { useState, useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession();
  }, []);

  function getSession() {
    fetch(`${backendUrl}api/session/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsAuthenticated(data.isAuthenticated || false);
      })
      .catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { isAuthenticated, loading };
}
