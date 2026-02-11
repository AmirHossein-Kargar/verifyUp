import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function useOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    // Don't fetch until auth state is known and user is available
    if (authLoading || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getMyOrders();
      setOrders(response.data?.orders || []);
    } catch (err) {
      // If unauthorized, treat as no orders instead of hard error
      if (err?.status === 401) {
        setOrders([]);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to fetch orders:", err);
        }
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
