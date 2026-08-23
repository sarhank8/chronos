import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase, getLocalSession, getLocalProfile, signOutLocalUser, type Profile } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (data) {
      setProfile(data as Profile);
    } else {
      const localP = getLocalProfile(userId);
      setProfile(localP);
    }
  };

  const syncAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      setSession(data.session);
      await loadProfile(data.session.user.id);
      return;
    }

    const local = getLocalSession();
    if (local?.session) {
      setSession(local.session as unknown as Session);
      setProfile(local.profile);
    } else {
      setSession(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    syncAuth().finally(() => {
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, newSession: Session | null) => {
      if (!mounted) return;
      if (newSession?.user) {
        setSession(newSession);
        loadProfile(newSession.user.id);
      } else {
        const local = getLocalSession();
        if (local?.session) {
          setSession(local.session as unknown as Session);
          setProfile(local.profile);
        } else {
          setSession(null);
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const currentUserId = session?.user?.id;
    if (currentUserId) await loadProfile(currentUserId);
  };

  const signOut = async () => {
    signOutLocalUser();
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, profile, loading, refreshProfile, refreshSession: syncAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

