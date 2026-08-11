import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] ?? "").trim();
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] ?? "").trim();

const placeholderValues =
  supabaseUrl === "https://example.supabase.co" || supabaseAnonKey === "your-anon-key";

export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey || placeholderValues
    ? "Supabase is not configured yet. Add your real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to the .env file before sign up or log in."
    : null;

const createErrorResult = <T>(fallback: T) => ({ data: fallback, error: { message: supabaseConfigError } });

const makeSupabaseFallback = () => {
  const emptyData = { data: null, error: { message: supabaseConfigError } };

  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: supabaseConfigError } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: supabaseConfigError } }),
    signOut: async () => ({ error: { message: supabaseConfigError } }),
    onAuthStateChange: () => ({
      data: {
        subscription: { unsubscribe: () => undefined },
      },
    }),
  };

  const from = () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => createErrorResult(null),
      }),
      order: async () => createErrorResult([]),
    }),
    insert: async () => createErrorResult(null),
    update: async () => createErrorResult(null),
    delete: async () => createErrorResult(null),
    or: async () => createErrorResult([]),
    is: async () => createErrorResult(null),
    single: async () => createErrorResult(null),
  });

  return {
    auth,
    from,
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({})
    }),
    removeChannel: () => undefined,
    ...emptyData,
  } as any;
};

if (supabaseConfigError) {
  console.warn(supabaseConfigError);
}

export const supabase = supabaseConfigError
  ? makeSupabaseFallback()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_private: boolean;
  created_at: string;
};

export type FollowStatus = "pending" | "accepted";

export type Follow = {
  id: string;
  follower_id: string;
  following_id: string;
  status: FollowStatus;
  created_at: string;
};

export type Letter = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  is_private: boolean;
  deliver_at: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};
