import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Globe, Users, PenLine, Clock3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { supabase, type Letter, type Profile } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/letters")({
  head: () => ({ meta: [{ title: "Letters — Future Me" }] }),
  component: LettersPage,
});

type LetterWithAuthor = Letter & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};

function LettersPage() {
  const { loading } = useRequireAuth();
  const { profile } = useAuth();
  const [letters, setLetters] = useState<LetterWithAuthor[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  // Compose state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"private" | "shared">("private");
  const [deliverAt, setDeliverAt] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLetters = async () => {
    setFeedLoading(true);
    const { data, error: fetchError } = await supabase
      .from("letters")
      .select("*, profile:profiles(username, display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!fetchError && data) setLetters(data as unknown as LetterWithAuthor[]);
    setFeedLoading(false);
  };

  useEffect(() => {
    if (!loading) loadLetters();
  }, [loading]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!content.trim()) {
      setError("Write something first.");
      return;
    }
    setError(null);
    setPosting(true);

    const { error: insertError } = await supabase.from("letters").insert({
      author_id: profile.id,
      title: title.trim() || "Untitled",
      content: content.trim(),
      is_private: visibility === "private",
      deliver_at: deliverAt ? new Date(deliverAt).toISOString() : null,
    });

    setPosting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTitle("");
    setContent("");
    setDeliverAt("");
    setVisibility("private");
    loadLetters();
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl leading-tight">Letters</h1>
        <p className="mt-2 text-muted-foreground">
          Yours, plus shared letters from people you follow and from public accounts.
        </p>

        <form
          onSubmit={handlePost}
          className="mt-10 rounded-[1.75rem] border border-border bg-card p-7 shadow-paper"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="border-none px-0 text-xl shadow-none focus-visible:ring-0"
          />
          <div
            className="mt-2 rounded-xl border border-border bg-background/60 px-4 py-4 shadow-inner shadow-stone-200/40"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, rgba(51,51,51,0.08) 0, rgba(51,51,51,0.08) 1px, transparent 1px, transparent 26px)",
              backgroundColor: "#fcfaf5",
            }}
          >
            <div className="mb-3 flex items-center justify-between border-b border-dashed border-border/80 pb-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80">
              <span style={{ fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive' }}>
                Dear future me,
              </span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Right now I’m working on…"
              className="min-h-40 resize-none border-0 bg-transparent p-0 text-base leading-8 shadow-none focus-visible:ring-0"
              style={{
                fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive',
                lineHeight: "2.1rem",
                background: "transparent",
              }}
            />
            <div className="mt-4 border-t border-dashed border-border/80 pt-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80">
              Yours, —
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-border bg-background p-1 text-sm">
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                  visibility === "private"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground"
                }`}
              >
                <Lock className="size-3.5" strokeWidth={1.75} /> Only me
              </button>
              <button
                type="button"
                onClick={() => setVisibility("shared")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                  visibility === "shared"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground"
                }`}
              >
                {profile?.is_private ? (
                  <Users className="size-3.5" strokeWidth={1.75} />
                ) : (
                  <Globe className="size-3.5" strokeWidth={1.75} />
                )}
                {profile?.is_private ? "Followers" : "Everyone"}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="size-3.5" strokeWidth={1.75} />
              Deliver on
              <input
                type="date"
                value={deliverAt}
                onChange={(e) => setDeliverAt(e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </label>

            <Button type="submit" disabled={posting} className="ml-auto rounded-full px-6">
              <PenLine className="size-4" strokeWidth={1.75} />
              {posting ? "Sealing…" : "Seal letter"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </form>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {feedLoading && <p className="py-8 text-sm text-muted-foreground">Loading letters…</p>}
          {!feedLoading && letters.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">
              No letters yet. Write one above, or follow people to see theirs.
            </p>
          )}
          {letters.map((letter) => {
            const isFuture = letter.deliver_at && new Date(letter.deliver_at) > new Date();
            return (
              <article key={letter.id} className="py-7">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={letter.profile.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {(letter.profile.display_name || letter.profile.username)
                        .slice(0, 1)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      to="/profile/$username"
                      params={{ username: letter.profile.username }}
                      className="text-sm font-medium hover:underline"
                    >
                      {letter.profile.display_name || letter.profile.username}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(letter.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    {letter.is_private ? (
                      <Lock className="size-3.5" strokeWidth={1.5} />
                    ) : (
                      <Globe className="size-3.5" strokeWidth={1.5} />
                    )}
                    {letter.is_private ? "Only them" : "Shared"}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl">{letter.title}</h3>
                {isFuture ? (
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
      </main>
    </div>
  );
}
