import { Link, useRouter } from "@tanstack/react-router";
import { Mail, LogOut, Settings, User as UserIcon } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/letters", label: "Letters" },
  { to: "/global", label: "Global Board" },
  { to: "/people", label: "People" },
  { to: "/messages", label: "Messages" },
];

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const initials = (profile?.display_name || profile?.username || "?").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card">
            <Mail className="size-4 text-brass" strokeWidth={1.5} />
          </span>
          <span className="font-display text-xl">Chronos</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user && profile?.username && (
            <Link
              to="/profile/$username"
              params={{ username: profile.username }}
              className="transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              My Profile
            </Link>
          )}
        </nav>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 transition-colors hover:border-foreground/40">
                <Avatar className="size-7">
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.username} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">{profile?.username ?? "…"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  to="/profile/$username"
                  params={{ username: profile?.username ?? "" }}
                  className="flex w-full items-center gap-2"
                >
                  <UserIcon className="size-4" strokeWidth={1.5} />
                  My profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full items-center gap-2">
                  <Settings className="size-4" strokeWidth={1.5} />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  router.navigate({ to: "/" });
                }}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="size-4" strokeWidth={1.5} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
