import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { supabase, type Profile } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Future Me" }] }),
  component: MessagesInbox,
});

type Conversation = {
  partner: Pick<Profile, "id" | "username" | "display_name" | "avatar_url">;
  lastContent: string;
  lastAt: string;
  unread: boolean;
};

function MessagesInbox() {
  const { loading } = useRequireAuth();
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (loading || !profile) return;

    const load = async () => {
      setLoadingList(true);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order("created_at", { ascending: false });

      if (!data) {
        setLoadingList(false);
        return;
      }

      const byPartner = new Map<string, { content: string; at: string; unread: boolean }>();
      for (const m of data) {
        const partnerId = m.sender_id === profile.id ? m.recipient_id : m.sender_id;
        if (!byPartner.has(partnerId)) {
          byPartner.set(partnerId, {
            content: m.content,
            at: m.created_at,
            unread: m.recipient_id === profile.id && !m.read_at,
          });
        }
      }

      const partnerIds = Array.from(byPartner.keys());
      if (partnerIds.length === 0) {
        setConversations([]);
        setLoadingList(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", partnerIds);

      const list: Conversation[] = (profiles ?? []).map((p) => {
        const info = byPartner.get(p.id)!;
        return { partner: p, lastContent: info.content, lastAt: info.at, unread: info.unread };
      });
      list.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
      setConversations(list);
      setLoadingList(false);
    };

    load();
  }, [loading, profile]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-4xl leading-tight">Messages</h1>
        <p className="mt-2 text-muted-foreground">
          Private conversations. Find someone on the People page to start.
        </p>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {loadingList && <p className="py-8 text-sm text-muted-foreground">Loading…</p>}
          {!loadingList && conversations.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">No messages yet.</p>
          )}
          {conversations.map((c) => (
            <Link
              key={c.partner.id}
              to="/messages/$username"
              params={{ username: c.partner.username }}
              className="flex items-center gap-4 py-5 transition-colors hover:bg-accent/40"
            >
              <Avatar className="size-11">
                <AvatarImage src={c.partner.avatar_url ?? undefined} />
                <AvatarFallback>
                  {(c.partner.display_name || c.partner.username).slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.partner.display_name || c.partner.username}</p>
                <p className="truncate text-sm text-muted-foreground">{c.lastContent}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.lastAt), { addSuffix: true })}
                </span>
                {c.unread && <span className="size-2 rounded-full bg-brass" />}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
