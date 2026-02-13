"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/**
 * Hook for handling smooth transitions after authentication actions
 */
export function useAuthTransition() {
  const router = useRouter();
  const redirectTimerRef = useRef(null);

  const redirectToDashboard = useCallback(
    (delay = 900) => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        router.replace("/dashboard");
      }, delay);
    },
    [router],
  );

  const redirectToLogin = useCallback(
    (delay = 900) => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        router.replace("/login");
      }, delay);
    },
    [router],
  );

  const redirectTo = useCallback(
    (path, delay = 900) => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        router.replace(path);
      }, delay);
    },
    [router],
  );

  const cancelRedirect = useCallback(() => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  }, []);

  return {
    redirectToDashboard,
    redirectToLogin,
    redirectTo,
    cancelRedirect,
  };
}
