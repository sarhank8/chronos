import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as supabase, i as useAuth, r as Route$1 } from "./router-T3nTODM3.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { s as Send, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./site-header-BwfxK3TA.mjs";
import { t as useRequireAuth } from "./use-require-auth-C335W4BK.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages._username-DXZTzN8u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConversationPage() {
	const { username } = Route$1.useParams();
	const { loading } = useRequireAuth();
	const { profile: me } = useAuth();
	const [partner, setPartner] = (0, import_react.useState)(void 0);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (loading || !me) return;
		let channel = null;
		const load = async () => {
			const { data: partnerData } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
			setPartner(partnerData ?? null);
			if (!partnerData) return;
			const { data: msgs } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${me.id},recipient_id.eq.${partnerData.id}),and(sender_id.eq.${partnerData.id},recipient_id.eq.${me.id})`).order("created_at", { ascending: true });
			setMessages(msgs ?? []);
			await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("sender_id", partnerData.id).eq("recipient_id", me.id).is("read_at", null);
			channel = supabase.channel(`dm:${[me.id, partnerData.id].sort().join(":")}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "messages"
			}, (payload) => {
				const row = payload.new;
				if (row.sender_id === me.id && row.recipient_id === partnerData.id || row.sender_id === partnerData.id && row.recipient_id === me.id) setMessages((prev) => [...prev, row]);
			}).subscribe();
		};
		load();
		return () => {
			if (channel) supabase.removeChannel(channel);
		};
	}, [
		loading,
		me,
		username
	]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);
	const handleSend = async (e) => {
		e.preventDefault();
		if (!me || !partner || !draft.trim()) return;
		setSending(true);
		const content = draft.trim();
		setDraft("");
		const { data, error } = await supabase.from("messages").insert({
			sender_id: me.id,
			recipient_id: partner.id,
			content
		}).select().single();
		setSending(false);
		if (!error && data) setMessages((prev) => prev.some((m) => m.id === data.id) ? prev : [...prev, data]);
	};
	if (loading || partner === void 0) return null;
	if (partner === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-2xl px-6 py-24 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "No one here by that name."
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b border-border py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/messages",
							className: "text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
								className: "size-5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: partner.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-xs",
								children: (partner.display_name || partner.username).slice(0, 1).toUpperCase()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile/$username",
							params: { username: partner.username },
							className: "font-medium hover:underline",
							children: partner.display_name || partner.username
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-3 overflow-y-auto py-6",
					children: [messages.map((m) => {
						const mine = m.sender_id === me?.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${mine ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${mine ? "bg-foreground text-background" : "border border-border bg-card"}`,
								children: m.content
							})
						}, m.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSend,
					className: "flex items-center gap-2 border-t border-border py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Write a message…",
						className: "rounded-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: sending || !draft.trim(),
						className: "shrink-0 rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							className: "size-4",
							strokeWidth: 1.75
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { ConversationPage as component };
