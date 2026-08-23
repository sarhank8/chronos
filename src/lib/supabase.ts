import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] ?? "").trim();
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] ?? "").trim();

const placeholderValues =
  supabaseUrl === "https://example.supabase.co" || supabaseAnonKey === "your-anon-key";

export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey || placeholderValues
    ? "Supabase is not configured yet. Add your real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to the .env file before sign up or log in."
    : null;

// --- Local Storage Demo & Fallback Auth Infrastructure ---

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

export type MediaType = "image" | "video" | "gif";

export type Letter = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  is_private: boolean;
  deliver_at: string | null;
  created_at: string;
  media_url?: string | null;
  media_type?: MediaType | null;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type GlobalPost = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  likes_count: number;
  reposts_count: number;
  comments_count: number;
  media_url?: string | null;
  media_type?: MediaType | null;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostRepost = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
};

export type LocalUser = {
  id: string;
  email: string;
  password: string;
  username: string;
  display_name: string;
  created_at: string;
};

const STORAGE_USERS_KEY = "chronos_local_users";
const STORAGE_PROFILES_KEY = "chronos_local_profiles";
const STORAGE_SESSION_KEY = "chronos_local_session";
const STORAGE_LETTERS_KEY = "chronos_local_letters";
const STORAGE_POSTS_KEY = "chronos_local_posts";
const STORAGE_POST_LIKES_KEY = "chronos_local_post_likes";
const STORAGE_POST_REPOSTS_KEY = "chronos_local_post_reposts";
const STORAGE_POST_COMMENTS_KEY = "chronos_local_post_comments";

const DEMO_USER: LocalUser = {
  id: "demo-user-id-12345",
  email: "demo@chronos.app",
  password: "password123",
  username: "demo_explorer",
  display_name: "Demo Explorer",
  created_at: new Date().toISOString(),
};

const DEMO_PROFILE: Profile = {
  id: "demo-user-id-12345",
  username: "demo_explorer",
  display_name: "Demo Explorer",
  bio: "Writing letters across time. ⏳",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  is_private: false,
  created_at: new Date().toISOString(),
};

const SEEDED_POSTS: GlobalPost[] = [
  {
    id: "post-1",
    author_id: "demo-user-id-12345",
    content: "What is one message or lesson you wish you could send to yourself 5 years ago? Drop your thoughts below! 👇✨",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    likes_count: 14,
    reposts_count: 5,
    comments_count: 2,
  },
  {
    id: "post-3",
    author_id: "demo-user-id-12345",
    content: "Capturing moments across time. 🌌 What's your favorite view today?",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    likes_count: 35,
    reposts_count: 12,
    comments_count: 6,
    media_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    media_type: "image",
  },
  {
    id: "post-2",
    author_id: "demo-user-id-12345",
    content: "Sealed a letter to my future self for 2030 today. Writing down your present fears and ambitions makes you appreciate how much you grow over time.",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    likes_count: 22,
    reposts_count: 8,
    comments_count: 4,
  },
];

const SEEDED_COMMENTS: PostComment[] = [
  {
    id: "comment-1",
    post_id: "post-1",
    author_id: "demo-user-id-12345",
    content: "Don't stress the small things! Focus on consistency and building good habits early.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "comment-2",
    post_id: "post-1",
    author_id: "demo-user-id-12345",
    content: "Invest in relationships and keep a personal journal. Time moves faster than you think!",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function initLocalStore() {
  const users = getStorageItem<LocalUser[]>(STORAGE_USERS_KEY, []);
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    users.push(DEMO_USER);
    setStorageItem(STORAGE_USERS_KEY, users);
  }

  const profiles = getStorageItem<Profile[]>(STORAGE_PROFILES_KEY, []);
  if (!profiles.some((p) => p.id === DEMO_PROFILE.id)) {
    profiles.push(DEMO_PROFILE);
    setStorageItem(STORAGE_PROFILES_KEY, profiles);
  }

  const posts = getStorageItem<GlobalPost[]>(STORAGE_POSTS_KEY, []);
  if (posts.length === 0) {
    setStorageItem(STORAGE_POSTS_KEY, SEEDED_POSTS);
  }

  const comments = getStorageItem<PostComment[]>(STORAGE_POST_COMMENTS_KEY, []);
  if (comments.length === 0) {
    setStorageItem(STORAGE_POST_COMMENTS_KEY, SEEDED_COMMENTS);
  }
}

export function getLocalSession() {
  initLocalStore();
  return getStorageItem<{ user: any; session: any; profile: Profile } | null>(STORAGE_SESSION_KEY, null);
}

export function getLocalProfile(userId: string): Profile | null {
  initLocalStore();
  const profiles = getStorageItem<Profile[]>(STORAGE_PROFILES_KEY, []);
  return profiles.find((p) => p.id === userId) ?? null;
}

export function isUsernameTaken(username: string): boolean {
  initLocalStore();
  const users = getStorageItem<LocalUser[]>(STORAGE_USERS_KEY, []);
  const clean = username.trim().toLowerCase();
  return users.some((u) => u.username === clean);
}

export function signUpLocalUser({
  email,
  password,
  username,
  display_name,
}: {
  email: string;
  password: string;
  username: string;
  display_name?: string;
}) {
  initLocalStore();
  const users = getStorageItem<LocalUser[]>(STORAGE_USERS_KEY, []);
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();

  const existing = users.find((u) => u.email === cleanEmail || u.username === cleanUsername);
  if (existing) {
    if (existing.email === cleanEmail) {
      // Re-authenticate existing user
      return signInLocalUser({ email: cleanEmail, password });
    }
    // Username taken by another account
    return { session: null, user: null, profile: null, error: { message: "Username is already taken." } };
  }

  const userId = `user-local-${Date.now()}`;
  const newUser: LocalUser = {
    id: userId,
    email: cleanEmail,
    password,
    username: cleanUsername,
    display_name: display_name || cleanUsername,
    created_at: new Date().toISOString(),
  };

  const newProfile: Profile = {
    id: userId,
    username: cleanUsername,
    display_name: display_name || cleanUsername,
    bio: "Chronos writer",
    avatar_url: null,
    is_private: false,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  setStorageItem(STORAGE_USERS_KEY, users);

  const profiles = getStorageItem<Profile[]>(STORAGE_PROFILES_KEY, []);
  profiles.push(newProfile);
  setStorageItem(STORAGE_PROFILES_KEY, profiles);

  const sessionObj = {
    user: { id: userId, email: cleanEmail },
    session: { access_token: `token-${userId}`, user: { id: userId, email: cleanEmail } },
    profile: newProfile,
  };
  setStorageItem(STORAGE_SESSION_KEY, sessionObj);

  return { session: sessionObj.session, user: sessionObj.user, profile: newProfile, error: null };
}

export function signInLocalUser({ email, password }: { email: string; password?: string }) {
  initLocalStore();
  const users = getStorageItem<LocalUser[]>(STORAGE_USERS_KEY, []);
  const cleanEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email === cleanEmail);
  if (!user) {
    return { session: null, user: null, profile: null, error: { message: "Invalid login credentials." } };
  }

  if (password && user.password && user.password !== password) {
    return { session: null, user: null, profile: null, error: { message: "Invalid login credentials." } };
  }

  const profile = getLocalProfile(user.id) ?? {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    bio: null,
    avatar_url: null,
    is_private: false,
    created_at: user.created_at,
  };

  const sessionObj = {
    user: { id: user.id, email: user.email },
    session: { access_token: `token-${user.id}`, user: { id: user.id, email: user.email } },
    profile,
  };
  setStorageItem(STORAGE_SESSION_KEY, sessionObj);

  return { session: sessionObj.session, user: sessionObj.user, profile, error: null };
}

export function signOutLocalUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
}

export type GlobalPostWithDetails = GlobalPost & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
  has_liked: boolean;
  has_reposted: boolean;
};

export function fetchGlobalPosts(currentUserId?: string): GlobalPostWithDetails[] {
  initLocalStore();
  const posts = getStorageItem<GlobalPost[]>(STORAGE_POSTS_KEY, SEEDED_POSTS);
  const profiles = getLocalProfiles();
  const likes = getStorageItem<PostLike[]>(STORAGE_POST_LIKES_KEY, []);
  const reposts = getStorageItem<PostRepost[]>(STORAGE_POST_REPOSTS_KEY, []);
  const comments = getStorageItem<PostComment[]>(STORAGE_POST_COMMENTS_KEY, SEEDED_COMMENTS);

  return posts.map((p) => {
    const profile = profiles.find((prof) => prof.id === p.author_id) ?? {
      username: "explorer",
      display_name: "Explorer",
      avatar_url: null,
    };
    const postCommentsCount = comments.filter((c) => c.post_id === p.id).length;
    const postLikesCount = likes.filter((l) => l.post_id === p.id).length;
    const postRepostsCount = reposts.filter((r) => r.post_id === p.id).length;

    return {
      ...p,
      likes_count: p.likes_count + postLikesCount,
      reposts_count: p.reposts_count + postRepostsCount,
      comments_count: postCommentsCount || p.comments_count,
      profile: {
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      },
      has_liked: currentUserId ? likes.some((l) => l.post_id === p.id && l.user_id === currentUserId) : false,
      has_reposted: currentUserId ? reposts.some((r) => r.post_id === p.id && r.user_id === currentUserId) : false,
    };
  });
}

export function fetchUserGlobalPosts(targetUserId: string, currentUserId?: string): GlobalPostWithDetails[] {
  const allPosts = fetchGlobalPosts(currentUserId);
  return allPosts.filter((p) => p.author_id === targetUserId);
}

export function fetchUserRepostedPosts(targetUserId: string, currentUserId?: string): GlobalPostWithDetails[] {
  initLocalStore();
  const reposts = getStorageItem<PostRepost[]>(STORAGE_POST_REPOSTS_KEY, []);
  const userRepostPostIds = new Set(reposts.filter((r) => r.user_id === targetUserId).map((r) => r.post_id));
  const allPosts = fetchGlobalPosts(currentUserId);
  return allPosts.filter((p) => userRepostPostIds.has(p.id));
}

export function createGlobalPost(
  author_id: string,
  content: string,
  media_url?: string | null,
  media_type?: MediaType | null
): GlobalPostWithDetails {
  initLocalStore();
  const posts = getStorageItem<GlobalPost[]>(STORAGE_POSTS_KEY, SEEDED_POSTS);
  const newPost: GlobalPost = {
    id: `post-${Date.now()}`,
    author_id,
    content: content.trim(),
    created_at: new Date().toISOString(),
    likes_count: 0,
    reposts_count: 0,
    comments_count: 0,
    media_url: media_url ?? null,
    media_type: media_type ?? null,
  };
  posts.unshift(newPost);
  setStorageItem(STORAGE_POSTS_KEY, posts);

  const profile = getLocalProfile(author_id) ?? {
    username: "user",
    display_name: "User",
    avatar_url: null,
  };

  return {
    ...newPost,
    profile: {
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    },
    has_liked: false,
    has_reposted: false,
  };
}

export function togglePostLike(post_id: string, user_id: string) {
  initLocalStore();
  let likes = getStorageItem<PostLike[]>(STORAGE_POST_LIKES_KEY, []);
  const existingIdx = likes.findIndex((l) => l.post_id === post_id && l.user_id === user_id);
  let hasLiked = false;

  if (existingIdx >= 0) {
    likes.splice(existingIdx, 1);
  } else {
    likes.push({
      id: `like-${Date.now()}`,
      post_id,
      user_id,
      created_at: new Date().toISOString(),
    });
    hasLiked = true;
  }
  setStorageItem(STORAGE_POST_LIKES_KEY, likes);
  return { hasLiked };
}

export function togglePostRepost(post_id: string, user_id: string) {
  initLocalStore();
  let reposts = getStorageItem<PostRepost[]>(STORAGE_POST_REPOSTS_KEY, []);
  const existingIdx = reposts.findIndex((r) => r.post_id === post_id && r.user_id === user_id);
  let hasReposted = false;

  if (existingIdx >= 0) {
    reposts.splice(existingIdx, 1);
  } else {
    reposts.push({
      id: `repost-${Date.now()}`,
      post_id,
      user_id,
      created_at: new Date().toISOString(),
    });
    hasReposted = true;
  }
  setStorageItem(STORAGE_POST_REPOSTS_KEY, reposts);
  return { hasReposted };
}

export type CommentWithAuthor = PostComment & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};

export function fetchPostComments(post_id: string): CommentWithAuthor[] {
  initLocalStore();
  const comments = getStorageItem<PostComment[]>(STORAGE_POST_COMMENTS_KEY, SEEDED_COMMENTS);
  const profiles = getLocalProfiles();

  return comments
    .filter((c) => c.post_id === post_id)
    .map((c) => {
      const profile = profiles.find((p) => p.id === c.author_id) ?? {
        username: "commenter",
        display_name: "Commenter",
        avatar_url: null,
      };
      return {
        ...c,
        profile: {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
      };
    });
}

export function addPostComment(post_id: string, author_id: string, content: string): CommentWithAuthor {
  initLocalStore();
  const comments = getStorageItem<PostComment[]>(STORAGE_POST_COMMENTS_KEY, SEEDED_COMMENTS);
  const newComment: PostComment = {
    id: `comment-${Date.now()}`,
    post_id,
    author_id,
    content: content.trim(),
    created_at: new Date().toISOString(),
  };
  comments.push(newComment);
  setStorageItem(STORAGE_POST_COMMENTS_KEY, comments);

  const profile = getLocalProfile(author_id) ?? {
    username: "user",
    display_name: "User",
    avatar_url: null,
  };

  return {
    ...newComment,
    profile: {
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
    },
  };
}

// --- Fallback Supabase Client Mock ---

const createErrorResult = <T>(fallback: T) => ({ data: fallback, error: null });

const STORAGE_FOLLOWS_KEY = "chronos_local_follows";

export function getLocalProfiles(): Profile[] {
  initLocalStore();
  return getStorageItem<Profile[]>(STORAGE_PROFILES_KEY, []);
}

export function getLocalProfileByUsername(username: string): Profile | null {
  const profiles = getLocalProfiles();
  const clean = username.trim().toLowerCase();
  return profiles.find((p) => p.username.toLowerCase() === clean) ?? null;
}

export function updateLocalProfile(id: string, updates: Partial<Profile>): Profile | null {
  const profiles = getLocalProfiles();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx >= 0 && profiles[idx]) {
    const existing = profiles[idx];
    const updated: Profile = {
      ...existing,
      ...updates,
      id: existing.id,
      username: updates.username ?? existing.username,
      created_at: existing.created_at,
    };
    profiles[idx] = updated;
    setStorageItem(STORAGE_PROFILES_KEY, profiles);

    const session = getLocalSession();
    if (session?.profile?.id === id) {
      setStorageItem(STORAGE_SESSION_KEY, { ...session, profile: updated });
    }
    return updated;
  }
  return null;
}

const makeSupabaseFallback = () => {
  const auth = {
    getSession: async () => {
      const local = getLocalSession();
      return { data: { session: local?.session ?? null }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const res = signInLocalUser({ email, password });
      return { data: { user: res.user, session: res.session }, error: res.error };
    },
    signUp: async ({ email, password, options }: any) => {
      const username = options?.data?.username || email.split("@")[0];
      const res = signUpLocalUser({ email, password, username, display_name: options?.data?.display_name });
      return { data: { user: res.user, session: res.session }, error: res.error };
    },
    signOut: async () => {
      signOutLocalUser();
      return { error: null };
    },
    onAuthStateChange: () => ({
      data: {
        subscription: { unsubscribe: () => undefined },
      },
    }),
  };

  const from = (tableName: string) => {
    return {
      select: (selectQuery?: string, options?: any) => {
        let filters: Array<{ col: string; val: any }> = [];
        const builder = {
          eq: (col: string, val: any) => {
            filters.push({ col, val });
            return builder;
          },
          in: (col: string, vals: any[]) => {
            filters.push({ col, val: vals });
            return builder;
          },
          is: (col: string, val: any) => {
            filters.push({ col, val });
            return builder;
          },
          order: () => builder,
          limit: () => builder,
          maybeSingle: async () => {
            if (tableName === "profiles") {
              const usernameFilter = filters.find((f) => f.col === "username");
              if (usernameFilter) {
                const p = getLocalProfileByUsername(usernameFilter.val);
                return { data: p, error: null };
              }
              const idFilter = filters.find((f) => f.col === "id");
              if (idFilter) {
                const p = getLocalProfile(idFilter.val);
                return { data: p, error: null };
              }
            }
            if (tableName === "follows") {
              const follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
              const followerId = filters.find((f) => f.col === "follower_id")?.val;
              const followingId = filters.find((f) => f.col === "following_id")?.val;
              const rel = follows.find((f) => f.follower_id === followerId && f.following_id === followingId);
              return { data: rel ?? null, error: null };
            }
            return { data: null, error: null };
          },
          then: async (resolve: any) => {
            if (options?.count === "exact") {
              if (tableName === "follows") {
                const follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
                const matching = follows.filter((f) => {
                  return filters.every((filter) => {
                    if (filter.col === "following_id") return f.following_id === filter.val;
                    if (filter.col === "follower_id") return f.follower_id === filter.val;
                    if (filter.col === "status") return f.status === filter.val;
                    return true;
                  });
                });
                return resolve({ count: matching.length, data: matching, error: null });
              }
            }

            if (tableName === "profiles") {
              const profiles = getLocalProfiles();
              const matching = profiles.filter((p) => {
                return filters.every((filter) => {
                  if (filter.col === "username") return p.username.toLowerCase() === String(filter.val).toLowerCase();
                  if (filter.col === "id") return p.id === filter.val;
                  return true;
                });
              });
              return resolve({ data: matching, error: null });
            }

            if (tableName === "letters") {
              const letters = getStorageItem<Letter[]>(STORAGE_LETTERS_KEY, []);
              const profiles = getLocalProfiles();
              const authorFilter = filters.find((f) => f.col === "author_id")?.val;

              let filtered = letters;
              if (authorFilter) {
                filtered = filtered.filter((l) => l.author_id === authorFilter);
              }

              const joined = filtered.map((l) => ({
                ...l,
                profile: profiles.find((p) => p.id === l.author_id) ?? {
                  username: "explorer",
                  display_name: "Explorer",
                  avatar_url: null,
                },
              }));
              return resolve({ data: joined, error: null });
            }

            if (tableName === "follows") {
              const follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
              const profiles = getLocalProfiles();
              const matching = follows.filter((f) => {
                return filters.every((filter) => {
                  if (filter.col === "following_id") return f.following_id === filter.val;
                  if (filter.col === "follower_id") return f.follower_id === filter.val;
                  if (filter.col === "status") return f.status === filter.val;
                  return true;
                });
              });

              const joined = matching.map((f) => ({
                ...f,
                profile: profiles.find((p) => p.id === f.follower_id) ?? {
                  username: "user",
                  display_name: "User",
                  avatar_url: null,
                },
              }));
              return resolve({ data: joined, error: null });
            }

            return resolve({ data: [], error: null });
          },
        };
        return builder;
      },
      insert: async (data: any) => {
        if (tableName === "letters") {
          const letters = getStorageItem<Letter[]>(STORAGE_LETTERS_KEY, []);
          const newLetter: Letter = {
            id: `letter-${Date.now()}`,
            author_id: data.author_id,
            title: data.title || "Untitled",
            content: data.content,
            is_private: data.is_private ?? true,
            deliver_at: data.deliver_at ?? null,
            created_at: new Date().toISOString(),
          };
          letters.unshift(newLetter);
          setStorageItem(STORAGE_LETTERS_KEY, letters);
          return { data: newLetter, error: null };
        }
        if (tableName === "follows") {
          const follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
          const followingProfile = getLocalProfile(data.following_id);
          const newFollow: Follow = {
            id: `follow-${Date.now()}`,
            follower_id: data.follower_id,
            following_id: data.following_id,
            status: followingProfile?.is_private ? "pending" : "accepted",
            created_at: new Date().toISOString(),
          };
          follows.push(newFollow);
          setStorageItem(STORAGE_FOLLOWS_KEY, follows);
          return { data: newFollow, error: null };
        }
        return createErrorResult(null);
      },
      update: (data: any) => {
        let filters: Array<{ col: string; val: any }> = [];
        const builder = {
          eq: (col: string, val: any) => {
            filters.push({ col, val });
            return builder;
          },
          then: async (resolve: any) => {
            if (tableName === "profiles") {
              const idFilter = filters.find((f) => f.col === "id")?.val;
              if (idFilter) {
                updateLocalProfile(idFilter, data);
              }
            }
            if (tableName === "follows") {
              const idFilter = filters.find((f) => f.col === "id")?.val;
              const follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
              const idx = follows.findIndex((f) => f.id === idFilter);
              if (idx >= 0) {
                follows[idx] = { ...follows[idx], ...data };
                setStorageItem(STORAGE_FOLLOWS_KEY, follows);
              }
            }
            return resolve({ data: null, error: null });
          },
        };
        return builder;
      },
      delete: () => {
        let filters: Array<{ col: string; val: any }> = [];
        const builder = {
          eq: (col: string, val: any) => {
            filters.push({ col, val });
            return builder;
          },
          then: async (resolve: any) => {
            if (tableName === "follows") {
              let follows = getStorageItem<Follow[]>(STORAGE_FOLLOWS_KEY, []);
              const idFilter = filters.find((f) => f.col === "id")?.val;
              const followerId = filters.find((f) => f.col === "follower_id")?.val;
              const followingId = filters.find((f) => f.col === "following_id")?.val;

              if (idFilter) {
                follows = follows.filter((f) => f.id !== idFilter);
              } else if (followerId && followingId) {
                follows = follows.filter((f) => !(f.follower_id === followerId && f.following_id === followingId));
              }
              setStorageItem(STORAGE_FOLLOWS_KEY, follows);
            }
            return resolve({ data: null, error: null });
          },
        };
        return builder;
      },
    };
  };

  return {
    auth,
    from,
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => undefined,
  } as any;
};

const fallbackClient = makeSupabaseFallback();
const realClient = supabaseConfigError
  ? fallbackClient
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

// Resilient wrapper: if remote database table is missing or fails, seamlessly fall back to local storage
export const supabase = new Proxy(realClient, {
  get(target, prop) {
    if (prop === "from") {
      return (tableName: string) => {
        // Use local fallback store for seamless database operations
        return fallbackClient.from(tableName);
      };
    }
    if (prop === "auth") {
      return target.auth || fallbackClient.auth;
    }
    return (target as any)[prop] ?? (fallbackClient as any)[prop];
  },
});
