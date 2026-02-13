"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for pages that should only be accessible to guests (non-authenticated users)
 * Redirects to dashboard if user is already logged in
 */
export function useGuestOnly() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to dashboard
        setIsTransitioning(true);
        router.replace("/dashboard");
      } else {
        // User is not logged in, show the page
        setShowSkeleton(false);
      }
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    showSkeleton,
    isTransitioning,
  };
}

/**
 * Hook for pages that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to login
        setIsTransitioning(true);
        router.replace("/login");
      } else {
        // User is logged in, show the page
        setShowSkeleton(false);
      }
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    showSkeleton,
    isTransitioning,
  };
}

/**
 * Hook for pages that require admin role
 * Redirects to dashboard if user is not admin, or to login if not authenticated
 */
export function useRequireAdmin() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to login
        setIsTransitioning(true);
        router.replace("/login");
      } else if (user.role !== "admin") {
        // User is not admin, redirect to dashboard
        setIsTransitioning(true);
        router.replace("/dashboard");
      } else {
        // User is admin, show the page
        setShowSkeleton(false);
      }
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    showSkeleton,
    isTransitioning,
  };
}
