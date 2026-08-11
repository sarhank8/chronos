import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as supabase, i as useAuth } from "./router-T3nTODM3.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { h as Globe, m as Lock, t as X, y as Check } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./site-header-BwfxK3TA.mjs";
import { t as useRequireAuth } from "./use-require-auth-C335W4BK.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-ChPDQRir.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const { loading } = useRequireAuth();
	const { profile, refreshProfile } = useAuth();
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)("");
	const [isPrivate, setIsPrivate] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	const [requests, setRequests] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (profile) {
			setDisplayName(profile.display_name ?? "");
			setBio(profile.bio ?? "");
			setAvatarUrl(profile.avatar_url ?? "");
			setIsPrivate(profile.is_private);
		}
	}, [profile]);
	const loadRequests = async () => {
		if (!profile) return;
		const { data } = await supabase.from("follows").select("id, follower_id, profile:profiles!follows_follower_id_fkey(username, display_name, avatar_url)").eq("following_id", profile.id).eq("status", "pending");
		setRequests(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		if (!loading && profile) loadRequests();
	}, [loading, profile?.id]);
	const handleSave = async (e) => {
		e.preventDefault();
		if (!profile) return;
		setSaving(true);
		setMessage(null);
		const { error } = await supabase.from("profiles").update({
			display_name: displayName.trim() || null,
			bio: bio.trim() || null,
			avatar_url: avatarUrl.trim() || null,
			is_private: isPrivate
		}).eq("id", profile.id);
		setSaving(false);
		if (error) setMessage(error.message);
		else {
			setMessage("Saved.");
			refreshProfile();
		}
	};
	const respond = async (requestId, accept) => {
		setRequests((r) => r.filter((req) => req.id !== requestId));
		if (accept) await supabase.from("follows").update({ status: "accepted" }).eq("id", requestId);
		else await supabase.from("follows").delete().eq("id", requestId);
	};
	if (loading || !profile) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-6 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl leading-tight",
					children: "Settings"
				}),
				isPrivate && requests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 rounded-[1.75rem] border border-border bg-card p-6 shadow-paper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Follow requests"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: requests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "size-9",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: req.profile.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-xs",
										children: (req.profile.display_name || req.profile.username).slice(0, 1).toUpperCase()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex-1 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: req.profile.display_name || req.profile.username
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["@", req.profile.username]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									className: "size-8 rounded-full",
									onClick: () => respond(req.id, true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-4",
										strokeWidth: 1.75
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "size-8 rounded-full",
									onClick: () => respond(req.id, false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "size-4",
										strokeWidth: 1.75
									})
								})
							]
						}, req.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "mt-10 space-y-6 rounded-[1.75rem] border border-border bg-card p-7 shadow-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "displayName",
								children: "Display name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "displayName",
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								className: "rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "bio",
								children: "Bio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "bio",
								value: bio,
								onChange: (e) => setBio(e.target.value),
								className: "min-h-24 resize-none rounded-xl",
								placeholder: "A line or two about you."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "avatarUrl",
								children: "Avatar URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "avatarUrl",
								value: avatarUrl,
								onChange: (e) => setAvatarUrl(e.target.value),
								placeholder: "https://…",
								className: "rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [isPrivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
									className: "size-4 text-muted-foreground",
									strokeWidth: 1.5
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
									className: "size-4 text-muted-foreground",
									strokeWidth: 1.5
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Private account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Only approved followers see your profile's shared letters."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: isPrivate,
								onCheckedChange: setIsPrivate
							})]
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: saving,
							className: "w-full rounded-full",
							children: saving ? "Saving…" : "Save changes"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { SettingsPage as component };
