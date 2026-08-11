import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { t as require_react } from "./react.js";
//#region node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
function useCallbackRef(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
__name(useCallbackRef, "useCallbackRef");
//#endregion
export { useCallbackRef as t };
