import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/hooks/use-auth";

/** Redirects to /login once we know for sure there's no session. */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: "/login" });
    }
  }, [loading, user, router]);

  return { user, loading };
}
