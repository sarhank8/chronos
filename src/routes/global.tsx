import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Heart, Repeat, MessageSquare, Send, Globe, Flame, Sparkles, Image as ImageIcon, Video as VideoIcon, Film, X, Link2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  fetchGlobalPosts,
  createGlobalPost,
  togglePostLike,
  togglePostRepost,
  fetchPostComments,
  addPostComment,
  type GlobalPostWithDetails,
  type CommentWithAuthor,
  type MediaType,
} from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/global")({
  head: () => ({ meta: [{ title: "Global Board — Chronos" }] }),
  component: GlobalBoardPage,
});

function GlobalBoardPage() {
  const { loading } = useRequireAuth();
  const { profile } = useAuth();
  const [posts, setPosts] = useState<GlobalPostWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<"latest" | "trending">("latest");
  const [newContent, setNewContent] = useState("");
  
  // Media Attachment State
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = () => {
    const data = fetchGlobalPosts(profile?.id);
    if (activeTab === "trending") {
      data.sort((a, b) => b.likes_count + b.reposts_count + b.comments_count - (a.likes_count + a.reposts_count + a.comments_count));
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    setPosts(data);
  };

  useEffect(() => {
    if (!loading) loadPosts();
  }, [loading, activeTab, profile?.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith("video/");
    const isGif = file.type === "image/gif";
    const type: MediaType = isVid ? "video" : isGif ? "gif" : "image";

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setMediaUrl(evt.target.result as string);
        setMediaType(type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    const url = customUrl.trim();
    const isVid = url.match(/\.(mp4|webm|ogg)$/i);
    const isGif = url.match(/\.gif$/i);
    const type: MediaType = isVid ? "video" : isGif ? "gif" : "image";

    setMediaUrl(url);
    setMediaType(type);
    setCustomUrl("");
    setShowUrlModal(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!newContent.trim() && !mediaUrl) {
      setError("Please write something or attach media to share.");
      return;
    }
    setError(null);
    setPosting(true);

    const created = createGlobalPost(profile.id, newContent, mediaUrl, mediaType);
    setPosts((prev) => [created, ...prev]);
    setNewContent("");
    setMediaUrl(null);
    setMediaType(null);
    setPosting(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2.5 text-4xl leading-tight font-display">
              <Globe className="size-8 text-brass" strokeWidth={1.5} /> Global Board
            </h1>
            <p className="mt-2 text-muted-foreground">
              A public square for everyone to post thoughts, pictures, GIFs, videos, and connect.
            </p>
          </div>

          <div className="flex rounded-full border border-border bg-card p-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("latest")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${
                activeTab === "latest" ? "bg-foreground text-background font-medium" : "text-muted-foreground"
              }`}
            >
              <Sparkles className="size-3.5" strokeWidth={1.75} /> Latest
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${
                activeTab === "trending" ? "bg-foreground text-background font-medium" : "text-muted-foreground"
              }`}
            >
              <Flame className="size-3.5" strokeWidth={1.75} /> Trending
            </button>
          </div>
        </div>

        {/* Thought & Media Composer */}
        <form
          onSubmit={handleCreatePost}
          className="mt-8 rounded-[1.75rem] border border-border bg-card p-6 shadow-paper"
        >
          <div className="flex items-start gap-4">
            <Avatar className="size-10 mt-1">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-sm">
                {(profile?.display_name || profile?.username || "?").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share a thought, image, GIF, or video with the community..."
                className="min-h-24 resize-none border-none p-0 text-base shadow-none focus-visible:ring-0"
              />

              {/* Media Preview Box */}
              {mediaUrl && (
                <div className="relative mt-3 max-w-md overflow-hidden rounded-2xl border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUrl(null);
                      setMediaType(null);
                    }}
                    className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="size-4" />
                  </button>
                  {mediaType === "video" ? (
                    <video src={mediaUrl} controls className="max-h-64 w-full object-cover" />
                  ) : (
                    <img src={mediaUrl} alt="Attached media preview" className="max-h-64 w-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          {/* URL Input Bar if opened */}
          {showUrlModal && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/80 p-2">
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Paste Image, GIF, or Video URL (e.g. https://...)"
                className="text-sm rounded-lg"
              />
              <Button type="button" size="sm" onClick={handleAddUrl} className="rounded-lg">
                Attach
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowUrlModal(false)} className="rounded-lg">
                <X className="size-4" />
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <ImageIcon className="size-3.5 text-blue-500" /> Image / GIF
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <VideoIcon className="size-3.5 text-emerald-500" /> Video
              </button>

              <button
                type="button"
                onClick={() => setShowUrlModal((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Link2 className="size-3.5 text-purple-500" /> Media URL
              </button>
            </div>

            <Button type="submit" disabled={posting || (!newContent.trim() && !mediaUrl)} className="ml-auto rounded-full px-6">
              <Send className="size-4" strokeWidth={1.75} />
              {posting ? "Posting..." : "Post Thought"}
            </Button>
          </div>
        </form>

        {/* Global Feed */}
        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={profile?.id ?? undefined} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PostCard({ post, currentUserId }: { post: GlobalPostWithDetails; currentUserId?: string | undefined }) {
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

