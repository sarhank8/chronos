globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-11T08:43:24.589Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/clock-3-B05STi2b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-HnzX3KDNJPS6EH+LUCo1merVbyo\"",
		"mtime": "2026-08-11T09:05:28.505Z",
		"size": 157,
		"path": "../public/assets/clock-3-B05STi2b.js"
	},
	"/assets/formatDistanceToNow-C9y6yhHy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"256a-dAhqo4U3yJvzO93WGLhO4nBecdE\"",
		"mtime": "2026-08-11T09:05:28.507Z",
		"size": 9578,
		"path": "../public/assets/formatDistanceToNow-C9y6yhHy.js"
	},
	"/assets/dist-DoC6_4bs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"841c-LU9q8XcKiOMwvw8cVSk+3AzZ59k\"",
		"mtime": "2026-08-11T09:05:28.506Z",
		"size": 33820,
		"path": "../public/assets/dist-DoC6_4bs.js"
	},
	"/assets/globe-cYO1_XXt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-SkKEsEkOfOZOKbAKsTfuDPEjpIY\"",
		"mtime": "2026-08-11T09:05:28.508Z",
		"size": 230,
		"path": "../public/assets/globe-cYO1_XXt.js"
	},
	"/assets/letters-R5WmmVLt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a3b-IghwRGmJdcyUWctJ+YcHEJ032aI\"",
		"mtime": "2026-08-11T09:05:28.510Z",
		"size": 6715,
		"path": "../public/assets/letters-R5WmmVLt.js"
	},
	"/assets/input-Zf-VBAUV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"269-a1vbXnPMr/zR9bWxBjm896NKf5E\"",
		"mtime": "2026-08-11T09:05:28.509Z",
		"size": 617,
		"path": "../public/assets/input-Zf-VBAUV.js"
	},
	"/assets/label-DJLI6vc9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"284-jKKbQWm/m8c9owLm6YuTDtk+Ty4\"",
		"mtime": "2026-08-11T09:05:28.509Z",
		"size": 644,
		"path": "../public/assets/label-DJLI6vc9.js"
	},
	"/assets/lock-cnhIEcDl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-XUfAaa2L6s/BLrK4Qt+3Q//m0ec\"",
		"mtime": "2026-08-11T09:05:28.511Z",
		"size": 194,
		"path": "../public/assets/lock-cnhIEcDl.js"
	},
	"/assets/messages-B0rEgir5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa6-kebuDrhH9qMFKE4CBnVLFRVQE6I\"",
		"mtime": "2026-08-11T09:05:28.512Z",
		"size": 2726,
		"path": "../public/assets/messages-B0rEgir5.js"
	},
	"/assets/messages._username-D3wS-p_y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f61-WRp2CQ2IktN1fqA5Gsu269W7PxQ\"",
		"mtime": "2026-08-11T09:05:28.515Z",
		"size": 3937,
		"path": "../public/assets/messages._username-D3wS-p_y.js"
	},
	"/assets/login-E6IhHIpN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c5-kynnCGCGTUUd7u5Miix7v8orlaU\"",
		"mtime": "2026-08-11T09:05:28.511Z",
		"size": 2501,
		"path": "../public/assets/login-E6IhHIpN.js"
	},
	"/assets/messages._username-DjnMCsA1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"251-3kCDwpvP3QqbW3yQ6GO4Wc6y430\"",
		"mtime": "2026-08-11T09:05:28.516Z",
		"size": 593,
		"path": "../public/assets/messages._username-DjnMCsA1.js"
	},
	"/assets/pen-line-Do-lhGpE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-XGCZSIEeRGERawzvG8rRGdlifjE\"",
		"mtime": "2026-08-11T09:05:28.517Z",
		"size": 265,
		"path": "../public/assets/pen-line-Do-lhGpE.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-11T08:43:24.597Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/index-K6lVuLP7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b6db-myKt93VhVr4H1VzlJboutdM4JdQ\"",
		"mtime": "2026-08-11T09:05:28.504Z",
		"size": 308955,
		"path": "../public/assets/index-K6lVuLP7.js"
	},
	"/assets/hero-envelope-DROD-sfY.jpg": {
		"type": "image/jpeg",
		"etag": "\"14617-CFuN8Wbw9I5NgyHiYly+27fV1vY\"",
		"mtime": "2026-08-11T09:05:28.532Z",
		"size": 83479,
		"path": "../public/assets/hero-envelope-DROD-sfY.jpg"
	},
	"/assets/preload-helper-CTReg6hH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1837-4Am6jHR4RPtn21pFHHfUklXjRfI\"",
		"mtime": "2026-08-11T09:05:28.520Z",
		"size": 6199,
		"path": "../public/assets/preload-helper-CTReg6hH.js"
	},
	"/assets/people-BknwkWy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9a-sjNRt2f6S0mDelWfgvM0xqe3rrU\"",
		"mtime": "2026-08-11T09:05:28.518Z",
		"size": 3738,
		"path": "../public/assets/people-BknwkWy5.js"
	},
	"/assets/profile._username-DgeEZ3Mo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175e-+wfEUUNEnxxS3DXj3Nn2nw9HVOY\"",
		"mtime": "2026-08-11T09:05:28.522Z",
		"size": 5982,
		"path": "../public/assets/profile._username-DgeEZ3Mo.js"
	},
	"/assets/profile._username-BHpwvnQ4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ac-slTflXHp3jmLifZBU/uyLrD/eZg\"",
		"mtime": "2026-08-11T09:05:28.521Z",
		"size": 684,
		"path": "../public/assets/profile._username-BHpwvnQ4.js"
	},
	"/assets/settings-Cfv_Rz2b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2216-17/9iu+326OLULlfjxHMgB/GCJY\"",
		"mtime": "2026-08-11T09:05:28.524Z",
		"size": 8726,
		"path": "../public/assets/settings-Cfv_Rz2b.js"
	},
	"/assets/site-header-Bm92Qb9j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1686f-gcNwYh1hvpsrLGBzE/i3mK7aHIg\"",
		"mtime": "2026-08-11T09:05:28.525Z",
		"size": 92271,
		"path": "../public/assets/site-header-Bm92Qb9j.js"
	},
	"/assets/signup-Dj0W1N2R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b32-3bTHNhZ0+tIpUvUXA8lyXqIqeqQ\"",
		"mtime": "2026-08-11T09:05:28.524Z",
		"size": 2866,
		"path": "../public/assets/signup-Dj0W1N2R.js"
	},
	"/assets/routes-COsfnqdX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fab-C/645FgGyMMXUWpwmyckx+PsjQY\"",
		"mtime": "2026-08-11T09:05:28.523Z",
		"size": 12203,
		"path": "../public/assets/routes-COsfnqdX.js"
	},
	"/assets/use-require-auth-DzsuDpDi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-iV8XIsYEHAcNz5cy1XaPJ9tylTc\"",
		"mtime": "2026-08-11T09:05:28.530Z",
		"size": 265,
		"path": "../public/assets/use-require-auth-DzsuDpDi.js"
	},
	"/assets/textarea-C1PZOCpn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"203-rspq33ZAZrrNAtyYqccupmukhSY\"",
		"mtime": "2026-08-11T09:05:28.528Z",
		"size": 515,
		"path": "../public/assets/textarea-C1PZOCpn.js"
	},
	"/assets/use-auth-Dn6hvkt1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39d-29A2btJ0lA1+BpxAtLY3Dq/ayic\"",
		"mtime": "2026-08-11T09:05:28.529Z",
		"size": 925,
		"path": "../public/assets/use-auth-Dn6hvkt1.js"
	},
	"/assets/user-plus-BeZ-3rPE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a-8WPGPZd/cLs+OKXIiUR63AL3R1Q\"",
		"mtime": "2026-08-11T09:05:28.531Z",
		"size": 298,
		"path": "../public/assets/user-plus-BeZ-3rPE.js"
	},
	"/assets/styles-B2PVX_g4.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"145cb-SVFxLBi78gTqFnSdI5piYKE+eX0\"",
		"mtime": "2026-08-11T09:05:28.534Z",
		"size": 83403,
		"path": "../public/assets/styles-B2PVX_g4.css"
	},
	"/assets/supabase-C70Y-1qI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c0e9-1C63FK0QPLBO9Ifr8aJ29tFG10A\"",
		"mtime": "2026-08-11T09:05:28.527Z",
		"size": 245993,
		"path": "../public/assets/supabase-C70Y-1qI.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy__aCdIB = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy__aCdIB
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
