"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Require authenticated user.
 * Optionally restricts access to specific roles.
 *
 * Server-side RBAC is the source of truth; this hook only improves UX
 * and client-side redirection. It must always stay in sync with backend
 * role rules (admin vs user-only routes).
 *
 * @param {Object} options
 * @param {string[]} [options.allowedRoles] - Allowed user roles (e.g. ['admin'])
 */
export function useRequireAuth(options = {}) {
  const { allowedRoles } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    // Not authenticated → redirect after short delay so in-flight checkAuth (e.g. from profile page) can complete
    if (!user) {
      redirectTimeoutRef.current = window.setTimeout(() => {
        redirectTimeoutRef.current = null;
        router.replace("/login");
      }, 300);
      return () => {
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current);
          redirectTimeoutRef.current = null;
        }
      };
    }

    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    const userRole = user.role || "user";

    // Role-based guard when allowedRoles is provided
    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        // Non-authorized role → send to main user dashboard or admin dashboard
        router.replace(userRole === "admin" ? "/admin" : "/dashboard");
        return;
      }
    }

    // Strict separation UX hint:
    // - Admins should not stay on /dashboard routes → send them to /admin
    // - Regular users should not stay on /admin routes → send them to /dashboard
    if (pathname) {
      if (pathname.startsWith("/dashboard") && userRole === "admin") {
        router.replace("/admin");
      } else if (pathname.startsWith("/admin") && userRole === "user") {
        router.replace("/dashboard");
      }
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [loading, user, router, allowedRoles, pathname]);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(t);
  }, [loading]);

  return { user, loading, showSkeleton };
}
