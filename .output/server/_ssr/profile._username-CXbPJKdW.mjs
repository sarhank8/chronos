import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as supabase, i as useAuth, n as Route } from "./router-T3nTODM3.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { g as Clock3, h as Globe, i as UserPlus, m as Lock, o as Settings, u as MessageCircle, y as Check } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./site-header-BwfxK3TA.mjs";
import { t as useRequireAuth } from "./use-require-auth-C335W4BK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile._username-CXbPJKdW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { username } = Route.useParams();
	const { loading } = useRequireAuth();
	const { profile: me } = useAuth();
	const [person, setPerson] = (0, import_react.useState)(void 0);
	const [letters, setLetters] = (0, import_react.useState)([]);
	const [followStatus, setFollowStatus] = (0, import_react.useState)(null);
	const [followerCount, setFollowerCount] = (0, import_react.useState)(0);
	const [followingCount, setFollowingCount] = (0, import_react.useState)(0);
	const load = async () => {
		const { data: personData } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
		setPerson(personData);
		if (!personData) return;
		const [{ count: followers }, { count: following }] = await Promise.all([supabase.from("follows").select("*", {
			count: "exact",
			head: true
		}).eq("following_id", personData.id).eq("status", "accepted"), supabase.from("follows").select("*", {
			count: "exact",
			head: true
		}).eq("follower_id", personData.id).eq("status", "accepted")]);
		setFollowerCount(followers ?? 0);
		setFollowingCount(following ?? 0);
		if (me) {
			const { data: relation } = await supabase.from("follows").select("status").eq("follower_id", me.id).eq("following_id", personData.id).maybeSingle();
			setFollowStatus(relation?.status ?? null);
		}
		const { data: letterData } = await supabase.from("letters").select("*").eq("author_id", personData.id).order("created_at", { ascending: false });
		setLetters(letterData ?? []);
	};
	(0, import_react.useEffect)(() => {
		if (!loading) load();
	}, [loading, username]);
	const handleFollow = async () => {
		if (!me || !person) return;
		setFollowStatus(person.is_private ? "pending" : "accepted");
		const { error } = await supabase.from("follows").insert({
			follower_id: me.id,
			following_id: person.id
		});
		if (error) setFollowStatus(null);
		else load();
	};
	const handleUnfollow = async () => {
		if (!me || !person) return;
		setFollowStatus(null);
		await supabase.from("follows").delete().eq("follower_id", me.id).eq("following_id", person.id);
		load();
	};
	if (loading || person === void 0) return null;
	if (person === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-6 py-24 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "No one here by that name."
			})
		})]
	});
	const isMe = me?.id === person.id;
	const canSeeLetters = isMe || followStatus === "accepted" || !person.is_private;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-6 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-16",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: person.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-lg",
								children: (person.display_name || person.username).slice(0, 1).toUpperCase()
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "flex items-center gap-2 text-3xl leading-tight",
							children: [person.display_name || person.username, person.is_private && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								className: "size-4 text-muted-foreground",
								strokeWidth: 1.5
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["@", person.username]
						})] })]
					}), isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/settings",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "size-4",
								strokeWidth: 1.75
							}), " Edit profile"]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [followStatus === "accepted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "rounded-full",
							onClick: handleUnfollow,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-4",
								strokeWidth: 1.75
							}), " Following"]
						}) : followStatus === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "rounded-full text-muted-foreground",
							onClick: handleUnfollow,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
								className: "size-4",
								strokeWidth: 1.75
							}), " Requested"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "rounded-full",
							onClick: handleFollow,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
								className: "size-4",
								strokeWidth: 1.75
							}), " Follow"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/messages/$username",
								params: { username: person.username },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
									className: "size-4",
									strokeWidth: 1.75
								}), " Message"]
							})
						})]
					})]
				}),
				person.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-lg text-muted-foreground",
					children: person.bio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: followerCount
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "followers"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: followingCount
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "following"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-12 text-2xl",
					children: "Letters"
				}),
				!canSeeLetters ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-2xl border border-dashed border-border py-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
						className: "mx-auto size-6 text-muted-foreground",
						strokeWidth: 1.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "This account is private. Follow to see their shared letters."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 divide-y divide-border border-y border-border",
					children: [letters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-sm text-muted-foreground",
						children: "No letters to show."
					}), letters.map((letter) => {
						const isFuture = letter.deliver_at && new Date(letter.deliver_at) > /* @__PURE__ */ new Date();
						if (!isMe && letter.is_private) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "py-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl",
									children: letter.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex items-center gap-1 text-xs text-muted-foreground",
									children: letter.is_private ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										className: "size-3.5",
										strokeWidth: 1.5
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
										className: "size-3.5",
										strokeWidth: 1.5
									})
								})]
							}), isFuture && !isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex items-center gap-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										className: "size-4",
										strokeWidth: 1.5
									}),
									" Sealed until",
									" ",
									new Date(letter.deliver_at).toLocaleDateString()
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap text-[1.0625rem] leading-relaxed text-muted-foreground",
								children: letter.content
							})]
						}, letter.id);
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProfilePage as component };
