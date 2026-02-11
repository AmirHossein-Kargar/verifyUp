"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Require authenticated user.
 * Optionally restricts access to specific roles.
 *
 * @param {Object} options
 * @param {string[]} [options.allowedRoles] - Allowed user roles (e.g. ['admin'])
 */
export function useRequireAuth(options = {}) {
  const { allowedRoles } = options;
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Not authenticated → go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Role-based guard when allowedRoles is provided
    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      const userRole = user.role || "user";
      if (!allowedRoles.includes(userRole)) {
        // Non-authorized role → send to main user dashboard
        router.replace("/dashboard");
      }
    }
  }, [loading, user, router, allowedRoles]);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(t);
  }, [loading]);

  return { user, loading, showSkeleton };
}
