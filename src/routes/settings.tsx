import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Globe, Check, X } from "lucide-react";

import { supabase, type Profile } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Chronos" }] }),
  component: SettingsPage,
});

type PendingRequest = {
  id: string;
  follower_id: string;
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};

function SettingsPage() {
  const { loading } = useRequireAuth();
  const { profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [requests, setRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setIsPrivate(profile.is_private);
    }
  }, [profile]);

  const loadRequests = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("follows")
      .select(
        "id, follower_id, profile:profiles!follows_follower_id_fkey(username, display_name, avatar_url)",
      )
      .eq("following_id", profile.id)
      .eq("status", "pending");
    setRequests((data as unknown as PendingRequest[]) ?? []);
  };

  useEffect(() => {
    if (!loading && profile) loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        is_private: isPrivate,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Saved.");
      refreshProfile();
    }
  };

  const respond = async (requestId: string, accept: boolean) => {
    setRequests((r) => r.filter((req) => req.id !== requestId));
    if (accept) {
      await supabase.from("follows").update({ status: "accepted" }).eq("id", requestId);
    } else {
      await supabase.from("follows").delete().eq("id", requestId);
    }
  };

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-4xl leading-tight">Settings</h1>

        {isPrivate && requests.length > 0 && (
          <section className="mt-10 rounded-[1.75rem] border border-border bg-card p-6 shadow-paper">
            <h2 className="text-xl">Follow requests</h2>
            <div className="mt-4 space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={req.profile.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {(req.profile.display_name || req.profile.username).slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="flex-1 text-sm">
                    <span className="font-medium">
                      {req.profile.display_name || req.profile.username}
                    </span>{" "}
                    <span className="text-muted-foreground">@{req.profile.username}</span>
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8 rounded-full"
                    onClick={() => respond(req.id, true)}
                  >
                    <Check className="size-4" strokeWidth={1.75} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 rounded-full"
                    onClick={() => respond(req.id, false)}
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        <form
          onSubmit={handleSave}
          className="mt-10 space-y-6 rounded-[1.75rem] border border-border bg-card p-7 shadow-paper"
        >
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-24 resize-none rounded-xl"
              placeholder="A line or two about you."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="rounded-xl"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3.5">
            <div className="flex items-center gap-3">
              {isPrivate ? (
                <Lock className="size-4 text-muted-foreground" strokeWidth={1.5} />
              ) : (
                <Globe className="size-4 text-muted-foreground" strokeWidth={1.5} />
              )}
              <div>
                <p className="text-sm font-medium">Private account</p>
                <p className="text-xs text-muted-foreground">
                  Only approved followers see your profile's shared letters.
                </p>
              </div>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          {message && <p className="text-sm text-muted-foreground">{message}</p>}

          <Button type="submit" disabled={saving} className="w-full rounded-full">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </main>
    </div>
  );
}
