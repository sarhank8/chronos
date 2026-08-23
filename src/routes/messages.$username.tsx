import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

import { supabase, type Message, type Profile } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/messages/$username")({
  head: ({ params }) => ({ meta: [{ title: `${params.username} — Messages` }] }),
  component: ConversationPage,
});

function ConversationPage() {
  const { username } = Route.useParams();
  const { loading } = useRequireAuth();
  const { profile: me } = useAuth();

  const [partner, setPartner] = useState<Profile | null | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !me) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      const { data: partnerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      setPartner((partnerData as Profile) ?? null);
      if (!partnerData) return;

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${me.id},recipient_id.eq.${partnerData.id}),and(sender_id.eq.${partnerData.id},recipient_id.eq.${me.id})`,
        )
        .order("created_at", { ascending: true });
      setMessages((msgs as Message[]) ?? []);

      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", partnerData.id)
        .eq("recipient_id", me.id)
        .is("read_at", null);

      channel = supabase
        .channel(`dm:${[me.id, partnerData.id].sort().join(":")}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload: any) => {
            const row = payload.new as Message;
            const involvesUs =
              (row.sender_id === me.id && row.recipient_id === partnerData.id) ||
              (row.sender_id === partnerData.id && row.recipient_id === me.id);
            if (involvesUs) setMessages((prev) => [...prev, row]);
          },
        )
        .subscribe();
    };

    load();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [loading, me, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me || !partner || !draft.trim()) return;
    setSending(true);
    const content = draft.trim();
    setDraft("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: me.id, recipient_id: partner.id, content })
      .select()
      .single();
    setSending(false);
    if (!error && data) {
      setMessages((prev) =>
        prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message],
      );
    }
  };

  if (loading || partner === undefined) return null;

  if (partner === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-muted-foreground">No one here by that name.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-6">
        <div className="flex items-center gap-3 border-b border-border py-4">
          <Link to="/messages" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" strokeWidth={1.75} />
          </Link>
          <Avatar className="size-9">
            <AvatarImage src={partner.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">
              {(partner.display_name || partner.username).slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            to="/profile/$username"
            params={{ username: partner.username }}
            className="font-medium hover:underline"
          >
            {partner.display_name || partner.username}
          </Link>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto py-6">
          {messages.map((m) => {
            const mine = m.sender_id === me?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine ? "bg-foreground text-background" : "border border-border bg-card"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border py-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message…"
            className="rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !draft.trim()}
            className="shrink-0 rounded-full"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </Button>
        </form>
      </div>
    </div>
  );
}
