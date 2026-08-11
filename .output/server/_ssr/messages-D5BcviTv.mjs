import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as supabase, i as useAuth } from "./router-T3nTODM3.mjs";
import { i as SiteHeader, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./site-header-BwfxK3TA.mjs";
import { t as useRequireAuth } from "./use-require-auth-C335W4BK.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-D5BcviTv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessagesInbox() {
	const { loading } = useRequireAuth();
	const { profile } = useAuth();
	const [conversations, setConversations] = (0, import_react.useState)([]);
	const [loadingList, setLoadingList] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (loading || !profile) return;
		const load = async () => {
			setLoadingList(true);
			const { data } = await supabase.from("messages").select("*").or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`).order("created_at", { ascending: false });
			if (!data) {
				setLoadingList(false);
				return;
			}
			const byPartner = /* @__PURE__ */ new Map();
			for (const m of data) {
				const partnerId = m.sender_id === profile.id ? m.recipient_id : m.sender_id;
				if (!byPartner.has(partnerId)) byPartner.set(partnerId, {
					content: m.content,
					at: m.created_at,
					unread: m.recipient_id === profile.id && !m.read_at
				});
			}
			const partnerIds = Array.from(byPartner.keys());
			if (partnerIds.length === 0) {
				setConversations([]);
				setLoadingList(false);
				return;
			}
			const { data: profiles } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", partnerIds);
			const list = (profiles ?? []).map((p) => {
				const info = byPartner.get(p.id);
				return {
					partner: p,
					lastContent: info.content,
					lastAt: info.at,
					unread: info.unread
				};
			});
			list.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
			setConversations(list);
			setLoadingList(false);
		};
		load();
	}, [loading, profile]);
	if (loading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-6 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl leading-tight",
					children: "Messages"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Private conversations. Find someone on the People page to start."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 divide-y divide-border border-y border-border",
					children: [
						loadingList && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "Loading…"
						}),
						!loadingList && conversations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "No messages yet."
						}),
						conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/messages/$username",
							params: { username: c.partner.username },
							className: "flex items-center gap-4 py-5 transition-colors hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "size-11",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: c.partner.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (c.partner.display_name || c.partner.username).slice(0, 1).toUpperCase() })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: c.partner.display_name || c.partner.username
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-muted-foreground",
										children: c.lastContent
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: formatDistanceToNow(new Date(c.lastAt), { addSuffix: true })
									}), c.unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-brass" })]
								})
							]
						}, c.partner.id))
					]
				})
			]
		})]
	});
}
//#endregion
export { MessagesInbox as component };
