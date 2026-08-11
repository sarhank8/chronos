import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useAuth } from "./router-T3nTODM3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-require-auth-C335W4BK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Redirects to /login once we know for sure there's no session. */
function useRequireAuth() {
	const { user, loading } = useAuth();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) router.navigate({ to: "/login" });
	}, [
		loading,
		user,
		router
	]);
	return {
		user,
		loading
	};
}
//#endregion
export { useRequireAuth as t };
