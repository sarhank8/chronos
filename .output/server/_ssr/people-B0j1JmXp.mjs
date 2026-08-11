import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as supabase, i as useAuth } from "./router-T3nTODM3.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { c as Search, g as Clock3, i as UserPlus, m as Lock, y as Check } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./site-header-BwfxK3TA.mjs";
import { t as useRequireAuth } from "./use-require-auth-C335W4BK.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-B0j1JmXp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeoplePage() {
	const { loading } = useRequireAuth();
	const { profile } = useAuth();
	const [query, setQuery] = (0, import_react.useState)("");
	const [people, setPeople] = (0, import_react.useState)([]);
	const [followMap, setFollowMap] = (0, import_react.useState)({});
	const [searching, setSearching] = (0, import_react.useState)(true);
	const loadPeople = async (q) => {
		setSearching(true);
		let request = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(30);
		if (q.trim()) request = request.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`);
		if (profile) request = request.neq("id", profile.id);
		const { data } = await request;
		setPeople(data ?? []);
		if (profile && data && data.length > 0) {
			const { data: follows } = await supabase.from("follows").select("following_id, status").eq("follower_id", profile.id).in("following_id", data.map((p) => p.id));
			const map = {};
			follows?.forEach((f) => {
				map[f.following_id] = f.status;
			});
			setFollowMap(map);
		}
		setSearching(false);
	};
	(0, import_react.useEffect)(() => {
		if (!loading) loadPeople(query);
	}, [loading]);
	const handleFollow = async (target) => {
		if (!profile) return;
		setFollowMap((m) => ({
			...m,
			[target.id]: target.is_private ? "pending" : "accepted"
		}));
		const { error } = await supabase.from("follows").insert({
			follower_id: profile.id,
			following_id: target.id
		});
		if (error) setFollowMap((m) => {
			const next = { ...m };
			delete next[target.id];
			return next;
		});
	};
	const handleUnfollow = async (target) => {
		if (!profile) return;
		setFollowMap((m) => {
			const next = { ...m };
			delete next[target.id];
			return next;
		});
		await supabase.from("follows").delete().eq("follower_id", profile.id).eq("following_id", target.id);
	};
	if (loading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-6 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl leading-tight",
					children: "People"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Find people to follow."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						loadPeople(query);
					},
					className: "relative mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search by username or name",
						className: "rounded-full py-5 pl-11"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 divide-y divide-border border-y border-border",
					children: [
						searching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "Searching…"
						}),
						!searching && people.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "No one found."
						}),
						people.map((person) => {
							const status = followMap[person.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 py-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "size-11",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: person.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (person.display_name || person.username).slice(0, 1).toUpperCase() })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/profile/$username",
											params: { username: person.username },
											className: "flex items-center gap-1.5 font-medium hover:underline",
											children: [person.display_name || person.username, person.is_private && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
												className: "size-3.5 text-muted-foreground",
												strokeWidth: 1.5
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-sm text-muted-foreground",
											children: ["@", person.username]
										})]
									}),
									status === "accepted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "rounded-full",
										onClick: () => handleUnfollow(person),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "size-4",
											strokeWidth: 1.75
										}), " Following"]
									}) : status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "rounded-full text-muted-foreground",
										onClick: () => handleUnfollow(person),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
											className: "size-4",
											strokeWidth: 1.75
										}), " Requested"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "rounded-full",
										onClick: () => handleFollow(person),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
											className: "size-4",
											strokeWidth: 1.75
										}), " Follow"]
									})
								]
							}, person.id);
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { PeoplePage as component };
