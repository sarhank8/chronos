import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Lock, Check, Clock3, UserPlus } from "lucide-react";

import { supabase, type Profile, type FollowStatus } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "People — Future Me" }] }),
  component: PeoplePage,
});

function PeoplePage() {
  const { loading } = useRequireAuth();
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Profile[]>([]);
  const [followMap, setFollowMap] = useState<Record<string, FollowStatus>>({});
  const [searching, setSearching] = useState(true);

  const loadPeople = async (q: string) => {
    setSearching(true);
    let request = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (q.trim()) {
      request = request.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`);
    }
    if (profile) request = request.neq("id", profile.id);
    const { data } = await request;
    setPeople((data as Profile[]) ?? []);

    if (profile && data && data.length > 0) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id, status")
        .eq("follower_id", profile.id)
        .in(
          "following_id",
          data.map((p) => p.id),
        );
      const map: Record<string, FollowStatus> = {};
      follows?.forEach((f) => {
        map[f.following_id] = f.status as FollowStatus;
      });
      setFollowMap(map);
    }
    setSearching(false);
  };

  useEffect(() => {
    if (!loading) loadPeople(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleFollow = async (target: Profile) => {
    if (!profile) return;
    setFollowMap((m) => ({ ...m, [target.id]: target.is_private ? "pending" : "accepted" }));
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: profile.id, following_id: target.id });
    if (error) {
      setFollowMap((m) => {
        const next = { ...m };
        delete next[target.id];
        return next;
      });
    }
  };

  const handleUnfollow = async (target: Profile) => {
    if (!profile) return;
    setFollowMap((m) => {
      const next = { ...m };
      delete next[target.id];
      return next;
    });
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", profile.id)
      .eq("following_id", target.id);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl leading-tight">People</h1>
        <p className="mt-2 text-muted-foreground">Find people to follow.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadPeople(query);
          }}
          className="relative mt-8"
        >
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or name"
            className="rounded-full py-5 pl-11"
          />
        </form>

        <div className="mt-8 divide-y divide-border border-y border-border">
          {searching && <p className="py-8 text-sm text-muted-foreground">Searching…</p>}
          {!searching && people.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">No one found.</p>
          )}
          {people.map((person) => {
            const status = followMap[person.id];
            return (
              <div key={person.id} className="flex items-center gap-4 py-5">
                <Avatar className="size-11">
                  <AvatarImage src={person.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {(person.display_name || person.username).slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/profile/$username"
                    params={{ username: person.username }}
                    className="flex items-center gap-1.5 font-medium hover:underline"
                  >
                    {person.display_name || person.username}
                    {person.is_private && (
                      <Lock className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">@{person.username}</p>
                </div>

                {status === "accepted" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleUnfollow(person)}
                  >
                    <Check className="size-4" strokeWidth={1.75} /> Following
                  </Button>
                ) : status === "pending" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-muted-foreground"
                    onClick={() => handleUnfollow(person)}
                  >
                    <Clock3 className="size-4" strokeWidth={1.75} /> Requested
                  </Button>
                ) : (
                  <Button size="sm" className="rounded-full" onClick={() => handleFollow(person)}>
                    <UserPlus className="size-4" strokeWidth={1.75} /> Follow
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
