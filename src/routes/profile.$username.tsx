import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Globe, Clock3, UserPlus, Check, MessageCircle, Settings } from "lucide-react";

import { supabase, type Profile, type Letter, type FollowStatus } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile/$username")({
  head: ({ params }) => ({ meta: [{ title: `@${params.username} — Future Me` }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { loading } = useRequireAuth();
  const { profile: me } = useAuth();

  const [person, setPerson] = useState<Profile | null | undefined>(undefined);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const load = async () => {
    const { data: personData } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    setPerson(personData as Profile | null);
    if (!personData) return;

    const [{ count: followers }, { count: following }] = await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", personData.id)
        .eq("status", "accepted"),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", personData.id)
        .eq("status", "accepted"),
    ]);
    setFollowerCount(followers ?? 0);
    setFollowingCount(following ?? 0);

    if (me) {
      const { data: relation } = await supabase
        .from("follows")
        .select("status")
        .eq("follower_id", me.id)
        .eq("following_id", personData.id)
        .maybeSingle();
      setFollowStatus((relation?.status as FollowStatus) ?? null);
    }

    const { data: letterData } = await supabase
      .from("letters")
      .select("*")
      .eq("author_id", personData.id)
      .order("created_at", { ascending: false });
    setLetters((letterData as Letter[]) ?? []);
  };

  useEffect(() => {
    if (!loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, username]);

  const handleFollow = async () => {
    if (!me || !person) return;
    setFollowStatus(person.is_private ? "pending" : "accepted");
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: me.id, following_id: person.id });
    if (error) setFollowStatus(null);
    else load();
  };

  const handleUnfollow = async () => {
    if (!me || !person) return;
    setFollowStatus(null);
    await supabase.from("follows").delete().eq("follower_id", me.id).eq("following_id", person.id);
    load();
  };

  if (loading || person === undefined) return null;

  if (person === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-muted-foreground">No one here by that name.</p>
        </main>
      </div>
    );
  }

  const isMe = me?.id === person.id;
  const canSeeLetters = isMe || followStatus === "accepted" || !person.is_private;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={person.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg">
                {(person.display_name || person.username).slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="flex items-center gap-2 text-3xl leading-tight">
                {person.display_name || person.username}
                {person.is_private && (
                  <Lock className="size-4 text-muted-foreground" strokeWidth={1.5} />
                )}
              </h1>
              <p className="text-sm text-muted-foreground">@{person.username}</p>
            </div>
          </div>

          {isMe ? (
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/settings">
                <Settings className="size-4" strokeWidth={1.75} /> Edit profile
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {followStatus === "accepted" ? (
                <Button variant="outline" className="rounded-full" onClick={handleUnfollow}>
                  <Check className="size-4" strokeWidth={1.75} /> Following
                </Button>
              ) : followStatus === "pending" ? (
                <Button
                  variant="outline"
                  className="rounded-full text-muted-foreground"
                  onClick={handleUnfollow}
                >
                  <Clock3 className="size-4" strokeWidth={1.75} /> Requested
                </Button>
              ) : (
                <Button className="rounded-full" onClick={handleFollow}>
                  <UserPlus className="size-4" strokeWidth={1.75} /> Follow
                </Button>
              )}
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/messages/$username" params={{ username: person.username }}>
                  <MessageCircle className="size-4" strokeWidth={1.75} /> Message
                </Link>
              </Button>
            </div>
          )}
        </div>

        {person.bio && <p className="mt-6 max-w-lg text-muted-foreground">{person.bio}</p>}

        <div className="mt-6 flex items-center gap-6 text-sm">
          <span>
            <strong className="text-foreground">{followerCount}</strong>{" "}
            <span className="text-muted-foreground">followers</span>
          </span>
          <span>
            <strong className="text-foreground">{followingCount}</strong>{" "}
            <span className="text-muted-foreground">following</span>
          </span>
        </div>

        <h2 className="mt-12 text-2xl">Letters</h2>
        {!canSeeLetters ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border py-12 text-center">
            <Lock className="mx-auto size-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted-foreground">
              This account is private. Follow to see their shared letters.
            </p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-border border-y border-border">
            {letters.length === 0 && (
              <p className="py-8 text-sm text-muted-foreground">No letters to show.</p>
            )}
            {letters.map((letter) => {
              const isFuture = letter.deliver_at && new Date(letter.deliver_at) > new Date();
              const hiddenFromMe = !isMe && letter.is_private;
              if (hiddenFromMe) return null;
              return (
                <article key={letter.id} className="py-7">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl">{letter.title}</h3>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {letter.is_private ? (
                        <Lock className="size-3.5" strokeWidth={1.5} />
                      ) : (
                        <Globe className="size-3.5" strokeWidth={1.5} />
                      )}
                    </span>
                  </div>
                  {isFuture && !isMe ? (
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="size-4" strokeWidth={1.5} /> Sealed until{" "}
                      {new Date(letter.deliver_at as string).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap text-[1.0625rem] leading-relaxed text-muted-foreground">
                      {letter.content}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
