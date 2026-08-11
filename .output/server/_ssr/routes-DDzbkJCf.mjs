import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { i as useAuth } from "./router-T3nTODM3.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { a as Sparkles, b as ArrowUpRight, g as Clock3, l as PenLine, m as Lock } from "../_libs/lucide-react.mjs";
import { i as SiteHeader } from "./site-header-BwfxK3TA.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DDzbkJCf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_envelope_default = "/assets/hero-envelope-DROD-sfY.jpg";
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var deliveries = [
	{
		when: "In 3 months",
		date: "November 10, 2026",
		title: "About the move",
		words: 412
	},
	{
		when: "In 1 year",
		date: "August 10, 2027",
		title: "Read this when you doubt it",
		words: 806
	},
	{
		when: "In 5 years",
		date: "August 10, 2031",
		title: "Thirty-something you",
		words: 1240
	}
];
var horizons = [
	"6 months",
	"1 year",
	"3 years",
	"5 years",
	"10 years",
	"Custom"
];
function Index() {
	const [horizon, setHorizon] = (0, import_react.useState)("1 year");
	const [letter, setLetter] = (0, import_react.useState)("");
	const [customDate, setCustomDate] = (0, import_react.useState)("");
	const [customTime, setCustomTime] = (0, import_react.useState)("09:00");
	const [dateError, setDateError] = (0, import_react.useState)(null);
	const { user } = useAuth();
	const router = useRouter();
	const now = /* @__PURE__ */ new Date();
	const currentDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const getSelectedDateTime = () => {
		if (!customDate) {
			const future = /* @__PURE__ */ new Date();
			const months = {
				"6 months": 6,
				"1 year": 12,
				"3 years": 36,
				"5 years": 60,
				"10 years": 120
			}[horizon] ?? 12;
			future.setMonth(future.getMonth() + months);
			return future;
		}
		return /* @__PURE__ */ new Date(`${customDate}T${customTime || "09:00"}:00`);
	};
	const isFutureDateTimeValid = () => {
		if (!(getSelectedDateTime().getTime() > Date.now())) {
			setDateError("Choose a delivery date and time in the future.");
			return false;
		}
		setDateError(null);
		return true;
	};
	const goToApp = () => {
		if (!letter.trim()) {
			setDateError("Write a letter before sealing it.");
			return;
		}
		if (!isFutureDateTimeValid()) return;
		router.navigate({ to: user ? "/letters" : "/signup" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto grid max-w-6xl items-center gap-14 px-6 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs tracking-[0.22em] text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-3.5 text-brass",
									strokeWidth: 1.5
								}), " Sealed until the day it matters"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-7 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl",
								children: [
									"Write a letter to",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"the person you",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"are becoming."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-7 max-w-md text-[1.0625rem] leading-relaxed text-muted-foreground",
								children: "Put today into words — the doubts, the plans, the small wins. We keep it sealed and deliver it to your inbox on the exact morning you choose."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-9 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "rounded-full px-7",
									onClick: goToApp,
									children: ["Write your first letter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
										className: "size-4",
										strokeWidth: 1.75
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "ghost",
									className: "rounded-full px-6 text-muted-foreground",
									onClick: () => document.getElementById("write")?.scrollIntoView({ behavior: "smooth" }),
									children: "See a sample"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-12 flex items-center gap-6 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
											className: "size-4",
											strokeWidth: 1.5
										}), " Private by default"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
										orientation: "vertical",
										className: "h-4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
											className: "size-4",
											strokeWidth: 1.5
										}), " Delivered to the day"]
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lift",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: hero_envelope_default,
									alt: "A cream envelope resting on a white surface in soft morning light",
									width: 1408,
									height: 1008,
									className: "h-[26rem] w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -bottom-7 -left-4 w-56 rounded-2xl border border-border bg-card p-5 shadow-paper sm:-left-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
										children: "Next delivery"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-display text-2xl",
										children: "Nov 10, 2026"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "“About the move”"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "write",
						className: "border-y border-border bg-linen/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-4xl leading-tight",
									children: "Today’s letter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-sm text-muted-foreground",
									children: "No formatting to fuss over. Just a page, a date, and your own handwriting in words."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
											children: "Deliver in"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: horizons.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													if (h === "Custom") {
														setHorizon("Custom");
														setDateError(null);
														return;
													}
													setHorizon(h);
													setCustomDate("");
													setDateError(null);
												},
												className: `rounded-full border px-4 py-2 text-sm transition-colors ${horizon === h ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"}`,
												children: h
											}, h))
										}),
										horizon === "Custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-6 rounded-2xl border border-border bg-card/80 p-4 shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground",
													children: "Custom delivery"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 grid gap-3 sm:grid-cols-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "date",
														min: currentDateTime,
														value: customDate,
														onChange: (e) => {
															setCustomDate(e.target.value);
															setDateError(null);
														},
														className: "rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "time",
														value: customTime,
														onChange: (e) => {
															setCustomTime(e.target.value);
															setDateError(null);
														},
														className: "rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-3 text-xs text-muted-foreground",
													children: "Pick any date and time in the future. If left blank, the preset horizon is used."
												}),
												dateError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-3 text-sm text-destructive",
													children: dateError
												})
											]
										})
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[1.75rem] border border-border bg-card p-7 shadow-paper sm:p-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "overflow-hidden rounded-[1.5rem] border border-border/70 bg-[#f7f3ea] p-4 shadow-[inset_0_1px_0_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] sm:p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b border-dashed border-border/80 pb-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notebook page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: customDate ? (/* @__PURE__ */ new Date(`${customDate}T${customTime || "09:00"}:00`)).toLocaleDateString() : (/* @__PURE__ */ new Date()).toLocaleDateString() })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 rounded-2xl border border-dashed border-border/70 bg-[#fbf8f2] p-4 sm:p-5",
										style: {
											backgroundImage: "repeating-linear-gradient(to bottom, rgba(51,51,51,0.08) 0, rgba(51,51,51,0.08) 1px, transparent 1px, transparent 26px)",
											backgroundColor: "#fbf8f2"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-4 flex items-baseline justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-display text-2xl",
													style: { fontFamily: "\"Segoe Print\", \"Bradley Hand\", \"Comic Sans MS\", cursive" },
													children: "Dear future me,"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: customDate ? (/* @__PURE__ */ new Date(`${customDate}T${customTime || "09:00"}:00`)).toLocaleDateString() : "Aug 10, 2026"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: letter,
													onChange: (e) => setLetter(e.target.value),
													placeholder: "Right now I’m working on…",
													className: "min-h-40 resize-none border-0 bg-transparent p-0 text-base leading-8 shadow-none focus-visible:ring-0",
													style: {
														fontFamily: "\"Segoe Print\", \"Bradley Hand\", \"Comic Sans MS\", cursive",
														lineHeight: "2.1rem",
														background: "transparent"
													}
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-5 flex items-center justify-between border-t border-dashed border-border/80 pt-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Signed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: customDate ? (/* @__PURE__ */ new Date(`${customDate}T${customTime || "09:00"}:00`)).toLocaleString([], {
													dateStyle: "medium",
													timeStyle: "short"
												}) : "August 10, 2026" })]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [
											letter.trim() ? letter.trim().split(/\s+/).length : 0,
											" words · sealed for ",
											customDate ? (/* @__PURE__ */ new Date(`${customDate}T${customTime || "09:00"}:00`)).toLocaleString([], {
												dateStyle: "medium",
												timeStyle: "short"
											}) : horizon
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "rounded-full px-6",
										onClick: goToApp,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {
											className: "size-4",
											strokeWidth: 1.75
										}), "Seal letter"]
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "outbox",
						className: "mx-auto max-w-6xl px-6 py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-4xl leading-tight",
								children: "Your outbox"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "3 letters in transit"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 divide-y divide-border border-y border-border",
							children: deliveries.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "group grid gap-3 py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-[0.18em] text-brass uppercase",
										children: d.when
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl",
										children: d.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: [
											d.date,
											" · ",
											d.words,
											" words · sealed"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-foreground group-hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
											className: "size-4",
											strokeWidth: 1.5
										})
									})
								]
							}, d.title))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "how",
						className: "border-t border-border bg-linen/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl px-6 py-24",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "max-w-lg text-4xl leading-tight",
								children: "Three steps, then you forget about it"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-14 grid gap-10 sm:grid-cols-3",
								children: [
									{
										n: "01",
										t: "Write it plainly",
										d: "One page, no audience. The version of you reading it already knows the context."
									},
									{
										n: "02",
										t: "Choose the date",
										d: "Six months out or a decade — the letter stays encrypted until that morning."
									},
									{
										n: "03",
										t: "Let it arrive",
										d: "It lands in your inbox exactly when you asked, and never a day before."
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-3xl text-brass",
										children: s.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-2xl",
										children: s.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-muted-foreground",
										children: s.d
									})
								] }, s.n))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "Chronos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Written today. Delivered when it counts."
					})]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
