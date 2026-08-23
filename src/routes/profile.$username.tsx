import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Globe, Clock3, UserPlus, Check, MessageCircle, Settings, Mail, Repeat, Heart, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  supabase,
  fetchUserGlobalPosts,
  fetchUserRepostedPosts,
  togglePostLike,
  togglePostRepost,
  fetchPostComments,
  addPostComment,
  type Profile,
  type Letter,
  type FollowStatus,
  type GlobalPostWithDetails,
  type CommentWithAuthor,
} from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile/$username")({
  head: ({ params }) => ({ meta: [{ title: `@${params.username} — Chronos` }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { loading } = useRequireAuth();
  const { profile: me } = useAuth();

  const [person, setPerson] = useState<Profile | null | undefined>(undefined);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [userThoughts, setUserThoughts] = useState<GlobalPostWithDetails[]>([]);
  const [userReposts, setUserReposts] = useState<GlobalPostWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<"letters" | "reposts" | "thoughts">("letters");

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

    // Load thoughts & reposts
    const thoughts = fetchUserGlobalPosts(personData.id, me?.id);
    setUserThoughts(thoughts);

    const reposts = fetchUserRepostedPosts(personData.id, me?.id);
    setUserReposts(reposts);
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
  const canSeeContent = isMe || followStatus === "accepted" || !person.is_private;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        {/* Profile Card Header */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={person.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg">
                {(person.display_name || person.username).slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="flex items-center gap-2 text-3xl leading-tight font-display">
                {person.display_name || person.username}
                {person.is_private && (
                  <Lock className="size-4 text-muted-foreground" strokeWidth={1.5} />
                )}
              </h1>
              <p className="text-sm text-muted-foreground">@{person.username}</p>
            </div>
          </div>

          {isMe ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brass/10 px-3 py-1 text-xs font-medium text-brass border border-brass/30">
                {person.is_private ? "Private Account 🔒" : "Public Account 🌐"}
              </span>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/settings">
                  <Settings className="size-4" strokeWidth={1.75} /> Edit profile
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground border border-border">
                {person.is_private ? "Private 🔒" : "Public 🌐"}
              </span>
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

        {/* Profile Navigation Tabs */}
        <div className="mt-10 flex border-b border-border text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("letters")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "letters"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="size-4" strokeWidth={1.75} /> Letters ({letters.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reposts")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "reposts"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Repeat className="size-4" strokeWidth={1.75} /> Reposts ({userReposts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("thoughts")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "thoughts"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="size-4" strokeWidth={1.75} /> Thoughts ({userThoughts.length})
          </button>
        </div>

        {!canSeeContent ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border py-12 text-center">
            <Lock className="mx-auto size-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted-foreground">
              This account is private. Follow to see their shared letters, reposts, and thoughts.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            {/* Letters Tab Content */}
            {activeTab === "letters" && (
              <div className="divide-y divide-border border-y border-border">
                {letters.length === 0 && (
                  <p className="py-8 text-sm text-muted-foreground">No letters written yet.</p>
                )}
                {letters.map((letter) => {
                  const isFuture = letter.deliver_at && new Date(letter.deliver_at) > new Date();
                  const hiddenFromMe = !isMe && letter.is_private;
                  if (hiddenFromMe) return null;
                  return (
                    <article key={letter.id} className="py-7">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-display">{letter.title}</h3>
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
                        <>
                          <p className="mt-2 whitespace-pre-wrap text-[1.0625rem] leading-relaxed text-muted-foreground">
                            {letter.content}
                          </p>
                          {letter.media_url && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background max-w-xl">
                              {letter.media_type === "video" ? (
                                <video src={letter.media_url} controls className="max-h-96 w-full object-cover" />
                              ) : (
                                <img src={letter.media_url} alt="Letter attachment" className="max-h-96 w-full object-cover" />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {/* Reposts Tab Content */}
            {activeTab === "reposts" && (
              <div className="space-y-6">
                {userReposts.length === 0 && (
                  <p className="py-8 text-sm text-muted-foreground">No reposts yet.</p>
                )}
                {userReposts.map((post) => (
                  <ProfilePostCard key={post.id} post={post} currentUserId={me?.id ?? undefined} />
                ))}
              </div>
            )}

            {/* Thoughts Tab Content */}
            {activeTab === "thoughts" && (
              <div className="space-y-6">
                {userThoughts.length === 0 && (
                  <p className="py-8 text-sm text-muted-foreground">No thoughts posted yet.</p>
                )}
                {userThoughts.map((post) => (
                  <ProfilePostCard key={post.id} post={post} currentUserId={me?.id ?? undefined} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ProfilePostCard({ post, currentUserId }: { post: GlobalPostWithDetails; currentUserId?: string | undefined }) {
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count);
  const [hasReposted, setHasReposted] = useState(post.has_reposted);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments_count);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = () => {
    if (!currentUserId) return;
    const res = togglePostLike(post.id, currentUserId);
    setHasLiked(res.hasLiked);
    setLikesCount((prev) => (res.hasLiked ? prev + 1 : prev - 1));
  };

  const handleRepost = () => {
    if (!currentUserId) return;
    const res = togglePostRepost(post.id, currentUserId);
    setHasReposted(res.hasReposted);
    setRepostsCount((prev) => (res.hasReposted ? prev + 1 : prev - 1));
  };

  const toggleCommentsView = () => {
    if (!showComments) {
      const fetched = fetchPostComments(post.id);
      setComments(fetched);
    }
    setShowComments((prev) => !prev);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !commentText.trim()) return;
    setSubmittingComment(true);

    const added = addPostComment(post.id, currentUserId, commentText);
    setComments((prev) => [...prev, added]);
    setCommentCount((prev) => prev + 1);
    setCommentText("");
    setSubmittingComment(false);
  };

  return (
    <article className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm transition-all hover:border-border/90">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={post.profile.avatar_url ?? undefined} />
          <AvatarFallback className="text-sm">
            {(post.profile.display_name || post.profile.username).slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            to="/profile/$username"
            params={{ username: post.profile.username }}
            className="font-medium hover:underline"
          >
            {post.profile.display_name || post.profile.username}
          </Link>
          <p className="text-xs text-muted-foreground">
            @{post.profile.username} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {post.content && <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-foreground">{post.content}</p>}

      {/* Media Rendering */}
      {post.media_url && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
          {post.media_type === "video" ? (
            <video src={post.media_url} controls className="max-h-96 w-full object-cover" />
          ) : (
            <img src={post.media_url} alt="Post media attachment" className="max-h-96 w-full object-cover" />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-6 border-t border-border/50 pt-4 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors hover:text-red-500 ${
            hasLiked ? "text-red-500 font-medium" : ""
          }`}
        >
          <Heart className={`size-4 ${hasLiked ? "fill-red-500" : ""}`} strokeWidth={1.75} />
          <span>{likesCount}</span>
        </button>

        <button
          type="button"
          onClick={handleRepost}
          className={`flex items-center gap-1.5 transition-colors hover:text-emerald-600 ${
            hasReposted ? "text-emerald-600 font-medium" : ""
          }`}
        >
          <Repeat className="size-4" strokeWidth={1.75} />
          <span>{repostsCount}</span>
        </button>

        <button
          type="button"
          onClick={toggleCommentsView}
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <MessageSquare className="size-4" strokeWidth={1.75} />
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-5 border-t border-dashed border-border/80 pt-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Comments ({comments.length})
          </h4>

          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 rounded-xl bg-background/60 p-3 text-sm">
                <Avatar className="size-7 mt-0.5">
                  <AvatarImage src={comment.profile.avatar_url ?? undefined} />
                  <AvatarFallback className="text-[0.65rem]">
                    {(comment.profile.display_name || comment.profile.username).slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile/$username"
                      params={{ username: comment.profile.username }}
                      className="font-medium hover:underline text-xs"
                    >
                      {comment.profile.display_name || comment.profile.username}
                    </Link>
                    <span className="text-[0.7rem] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="rounded-full text-sm"
            />
            <Button type="submit" disabled={submittingComment || !commentText.trim()} size="sm" className="rounded-full px-4">
              Reply
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
