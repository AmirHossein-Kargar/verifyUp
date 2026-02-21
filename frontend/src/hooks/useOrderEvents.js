"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Subscribe to Server-Sent Events for order status updates.
 * When admin updates an order belonging to the current user, onOrderUpdate is called.
 * Uses fetch + stream (EventSource doesn't send cookies cross-origin).
 */
export function useOrderEvents(onOrderUpdate) {
  const { user, loading: authLoading } = useAuth();
  const callbackRef = useRef(onOrderUpdate);
  const abortRef = useRef(null);

  callbackRef.current = onOrderUpdate;

  useEffect(() => {
    if (authLoading || !user) return;

    const url = `${API_BASE}/orders/me/events`;
    const controller = new AbortController();
    abortRef.current = controller;

    let buffer = "";

    const run = async () => {
      try {
        const res = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok || !res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const raw = line.slice(6).trim();
              if (!raw) continue;
              try {
                const data = JSON.parse(raw);
                if (data?.type === "ORDER_STATUS_UPDATED" && data?.order) {
                  callbackRef.current?.(data);
                }
              } catch (_) {
                // ignore non-JSON or comment lines
              }
            }
          }
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("Order events SSE error:", err);
        }
      }
    };

    run();

    return () => {
      controller.abort();
    };
  }, [authLoading, user]);

  return null;
}
