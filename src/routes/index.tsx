import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Clock3, Lock, PenLine, Sparkles } from "lucide-react";

import heroEnvelope from "@/assets/hero-envelope.jpg";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chronos — Write letters to your future self" },
      {
        name: "description",
        content:
          "Chronos is a quiet place to write a letter today and have it delivered to yourself months or years from now. Private, sealed, and beautifully simple.",
      },
      { property: "og:title", content: "Chronos — Write letters to your future self" },
      {
        property: "og:description",
        content:
          "Write a letter today, seal it, and receive it years from now. A calm, private time capsule for your own words.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const deliveries = [
  { when: "In 3 months", date: "November 10, 2026", title: "About the move", words: 412 },
  { when: "In 1 year", date: "August 10, 2027", title: "Read this when you doubt it", words: 806 },
  { when: "In 5 years", date: "August 10, 2031", title: "Thirty-something you", words: 1240 },
];

const horizons = ["6 months", "1 year", "3 years", "5 years", "10 years", "Custom"];

function Index() {
  const [horizon, setHorizon] = useState("1 year");
  const [letter, setLetter] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("09:00");
  const [dateError, setDateError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const now = new Date();
  const currentDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  const getSelectedDateTime = () => {
    if (!customDate) {
      const future = new Date();
      const units = { "6 months": 6, "1 year": 12, "3 years": 36, "5 years": 60, "10 years": 120 };
      const months = units[horizon as keyof typeof units] ?? 12;
      future.setMonth(future.getMonth() + months);
      return future;
    }

    const dateValue = new Date(`${customDate}T${customTime || "09:00"}:00`);
    return dateValue;
  };

  const isFutureDateTimeValid = () => {
    const selected = getSelectedDateTime();
    const valid = selected.getTime() > Date.now();
    if (!valid) {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <p className="flex items-center gap-2 text-xs tracking-[0.22em] text-muted-foreground uppercase">
              <Sparkles className="size-3.5 text-brass" strokeWidth={1.5} /> Sealed until the day it
              matters
            </p>
            <h1 className="mt-7 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Write a letter to
              <br />
              the person you
              <br />
              are becoming.
            </h1>
            <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-muted-foreground">
              Put today into words — the doubts, the plans, the small wins. We keep it sealed and
              deliver it to your inbox on the exact morning you choose.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full px-7" onClick={goToApp}>
                Write your first letter
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full px-6 text-muted-foreground"
                onClick={() =>
                  document.getElementById("write")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See a sample
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Lock className="size-4" strokeWidth={1.5} /> Private by default
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" strokeWidth={1.5} /> Delivered to the day
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lift">
              <img
                src={heroEnvelope}
                alt="A cream envelope resting on a white surface in soft morning light"
                width={1408}
                height={1008}
                className="h-[26rem] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-7 -left-4 w-56 rounded-2xl border border-border bg-card p-5 shadow-paper sm:-left-8">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Next delivery
              </p>
              <p className="mt-2 font-display text-2xl">Nov 10, 2026</p>
              <p className="mt-1 text-sm text-muted-foreground">“About the move”</p>
            </div>
          </div>
        </section>

        <section id="write" className="border-y border-border bg-linen/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-4xl leading-tight">Today’s letter</h2>
              <p className="mt-4 max-w-sm text-muted-foreground">
                No formatting to fuss over. Just a page, a date, and your own handwriting in words.
              </p>
              <div className="mt-8 space-y-4">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Deliver in
                </p>
                <div className="flex flex-wrap gap-2">
                  {horizons.map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        if (h === "Custom") {
                          setHorizon("Custom");
                          setDateError(null);
                          return;
                        }

                        setHorizon(h);
                        setCustomDate("");
                        setDateError(null);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        horizon === h
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                {horizon === "Custom" && (
                  <div className="mt-6 rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                    <label className="block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Custom delivery
                    </label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        min={currentDateTime}
                        value={customDate}
                        onChange={(e) => {
                          setCustomDate(e.target.value);
                          setDateError(null);
                        }}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0"
                      />
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => {
                          setCustomTime(e.target.value);
                          setDateError(null);
                        }}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0"
                      />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Pick any date and time in the future. If left blank, the preset horizon is used.
                    </p>
                    {dateError && <p className="mt-3 text-sm text-destructive">{dateError}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-7 shadow-paper sm:p-9">
              <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-[#f7f3ea] p-4 shadow-[inset_0_1px_0_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] sm:p-6">
                <div className="flex items-center justify-between border-b border-dashed border-border/80 pb-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span>Notebook page</span>
                  <span>{customDate ? new Date(`${customDate}T${customTime || "09:00"}:00`).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>

                <div
                  className="mt-5 rounded-2xl border border-dashed border-border/70 bg-[#fbf8f2] p-4 sm:p-5"
                  style={{
                    backgroundImage: "repeating-linear-gradient(to bottom, rgba(51,51,51,0.08) 0, rgba(51,51,51,0.08) 1px, transparent 1px, transparent 26px)",
                    backgroundColor: "#fbf8f2",
                  }}
                >
                  <div className="mb-4 flex items-baseline justify-between">
                    <p className="font-display text-2xl" style={{ fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive' }}>
                      Dear future me,
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customDate ? new Date(`${customDate}T${customTime || "09:00"}:00`).toLocaleDateString() : "Aug 10, 2026"}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Textarea
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
                      placeholder="Right now I’m working on…"
                      className="min-h-40 resize-none border-0 bg-transparent p-0 text-base leading-8 shadow-none focus-visible:ring-0"
                      style={{ fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive', lineHeight: "2.1rem", background: "transparent" }}
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-dashed border-border/80 pt-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80">
                    <span>Signed</span>
                    <span>
                      {customDate
                        ? new Date(`${customDate}T${customTime || "09:00"}:00`).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "August 10, 2026"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {letter.trim() ? letter.trim().split(/\s+/).length : 0} words · sealed for {customDate ? new Date(`${customDate}T${customTime || "09:00"}:00`).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : horizon}
                </p>
                <Button className="rounded-full px-6" onClick={goToApp}>
                  <PenLine className="size-4" strokeWidth={1.75} />
                  Seal letter
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="outbox" className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-4xl leading-tight">Your outbox</h2>
            <p className="text-sm text-muted-foreground">3 letters in transit</p>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {deliveries.map((d) => (
              <article
                key={d.title}
                className="group grid gap-3 py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-center"
              >
                <p className="text-xs tracking-[0.18em] text-brass uppercase">{d.when}</p>
                <div>
                  <h3 className="text-2xl">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {d.date} · {d.words} words · sealed
                  </p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-foreground group-hover:text-foreground">
                  <Lock className="size-4" strokeWidth={1.5} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="border-t border-border bg-linen/60">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg text-4xl leading-tight">
              Three steps, then you forget about it
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Write it plainly",
                  d: "One page, no audience. The version of you reading it already knows the context.",
                },
                {
                  n: "02",
                  t: "Choose the date",
                  d: "Six months out or a decade — the letter stays encrypted until that morning.",
                },
                {
                  n: "03",
                  t: "Let it arrive",
                  d: "It lands in your inbox exactly when you asked, and never a day before.",
                },
              ].map((s) => (
                <div key={s.n}>
                  <p className="font-display text-3xl text-brass">{s.n}</p>
                  <h3 className="mt-4 text-2xl">{s.t}</h3>
                  <p className="mt-3 text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg">Chronos</p>
          <p className="text-sm text-muted-foreground">Written today. Delivered when it counts.</p>
        </div>
      </footer>
    </div>
  );
}
