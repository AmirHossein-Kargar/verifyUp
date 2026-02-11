import { useEffect, useState } from "react";

export function useLocalOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orders");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setOrders(parsed);
    } catch (e) {
      console.error("Failed to parse orders:", e);
    }
  }, []);

  return orders;
}
