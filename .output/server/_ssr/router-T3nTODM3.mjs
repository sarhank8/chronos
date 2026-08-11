import { r as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-CFPQp7Vx.js
var supabaseUrl = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_SBVnGz8HRfUkJADDk-B5zg_EQMG7Ks2",
	"VITE_SUPABASE_URL": "https://cspedevpiasefdnckbym.supabase.co"
}["VITE_SUPABASE_URL"] ?? "").trim();
var supabaseAnonKey = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_SBVnGz8HRfUkJADDk-B5zg_EQMG7Ks2",
	"VITE_SUPABASE_URL": "https://cspedevpiasefdnckbym.supabase.co"
}["VITE_SUPABASE_ANON_KEY"] ?? "").trim();
var supabaseConfigError = !supabaseUrl || !supabaseAnonKey || supabaseUrl === "https://example.supabase.co" || supabaseAnonKey === "your-anon-key" ? "Supabase is not configured yet. Add your real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to the .env file before sign up or log in." : null;
var createErrorResult = (fallback) => ({
	data: fallback,
	error: { message: supabaseConfigError }
});
var makeSupabaseFallback = () => {
	const emptyData = {
		data: null,
		error: { message: supabaseConfigError }
	};
	const auth = {
		getSession: async () => ({
			data: { session: null },
			error: null
		}),
		signInWithPassword: async () => ({
			data: {
				user: null,
				session: null
			},
			error: { message: supabaseConfigError }
		}),
		signUp: async () => ({
			data: {
				user: null,
				session: null
			},
			error: { message: supabaseConfigError }
		}),
		signOut: async () => ({ error: { message: supabaseConfigError } }),
		onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => void 0 } } })
	};
	const from = () => ({
		select: () => ({
			eq: () => ({ maybeSingle: async () => createErrorResult(null) }),
			order: async () => createErrorResult([])
		}),
		insert: async () => createErrorResult(null),
		update: async () => createErrorResult(null),
		delete: async () => createErrorResult(null),
		or: async () => createErrorResult([]),
		is: async () => createErrorResult(null),
		single: async () => createErrorResult(null)
	});
	return {
		auth,
		from,
		channel: () => ({
			on: () => ({ subscribe: () => ({}) }),
			subscribe: () => ({})
		}),
		removeChannel: () => void 0,
		...emptyData
	};
};
if (supabaseConfigError) console.warn(supabaseConfigError);
var supabase = supabaseConfigError ? makeSupabaseFallback() : createClient(supabaseUrl, supabaseAnonKey, { auth: {
	persistSession: true,
	autoRefreshToken: true
} });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-T3nTODM3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-B2PVX_g4.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadProfile = async (userId) => {
		const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
		setProfile(data);
	};
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return;
			setSession(data.session);
			if (data.session?.user) loadProfile(data.session.user.id).finally(() => setLoading(false));
			else setLoading(false);
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
			if (newSession?.user) loadProfile(newSession.user.id);
			else setProfile(null);
		});
		return () => {
			mounted = false;
			listener.subscription.unsubscribe();
		};
	}, []);
	const refreshProfile = async () => {
		if (session?.user) await loadProfile(session.user.id);
	};
	const signOut = async () => {
		await supabase.auth.signOut();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user: session?.user ?? null,
			session,
			profile,
			loading,
			refreshProfile,
			signOut
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$8 = () => import("./routes-DDzbkJCf.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Chronos — Write letters to your future self" },
		{
			name: "description",
			content: "Chronos is a quiet place to write a letter today and have it delivered to yourself months or years from now. Private, sealed, and beautifully simple."
		},
		{
			property: "og:title",
			content: "Chronos — Write letters to your future self"
		},
		{
			property: "og:description",
			content: "Write a letter today, seal it, and receive it years from now. A calm, private time capsule for your own words."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./letters-ig1yXxUT.mjs");
var Route$7 = createFileRoute("/letters")({
	head: () => ({ meta: [{ title: "Letters — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./login-D-Hu8DhA.mjs");
var Route$6 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Log in — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./messages-D5BcviTv.mjs");
var Route$5 = createFileRoute("/messages")({
	head: () => ({ meta: [{ title: "Messages — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./people-B0j1JmXp.mjs");
var Route$4 = createFileRoute("/people")({
	head: () => ({ meta: [{ title: "People — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./settings-ChPDQRir.mjs");
var Route$3 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./signup-BYm60iDs.mjs");
var Route$2 = createFileRoute("/signup")({
	head: () => ({ meta: [{ title: "Sign up — Future Me" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./messages._username-DXZTzN8u.mjs");
var Route$1 = createFileRoute("/messages/$username")({
	head: ({ params }) => ({ meta: [{ title: `${params.username} — Messages` }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./profile._username-CXbPJKdW.mjs");
var Route = createFileRoute("/profile/$username")({
	head: ({ params }) => ({ meta: [{ title: `@${params.username} — Future Me` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var LettersRoute = Route$7.update({
	id: "/letters",
	path: "/letters",
	getParentRoute: () => Route$9
});
var LoginRoute = Route$6.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$9
});
var MessagesRoute = Route$5.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => Route$9
});
var PeopleRoute = Route$4.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => Route$9
});
var SettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$9
});
var SignupRoute = Route$2.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$9
});
var MessagesUsernameRoute = Route$1.update({
	id: "/$username",
	path: "/$username",
	getParentRoute: () => MessagesRoute
});
var ProfileUsernameRoute = Route.update({
	id: "/profile/$username",
	path: "/profile/$username",
	getParentRoute: () => Route$9
});
var MessagesRouteChildren = { MessagesUsernameRoute };
var rootRouteChildren = {
	IndexRoute,
	LettersRoute,
	LoginRoute,
	MessagesRoute: MessagesRoute._addFileChildren(MessagesRouteChildren),
	PeopleRoute,
	SettingsRoute,
	SignupRoute,
	ProfileUsernameRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { supabase as a, useAuth as i, Route as n, Route$1 as r, router_exports as t };
