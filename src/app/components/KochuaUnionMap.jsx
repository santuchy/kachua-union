"use client";

import { useMemo, useState } from "react";
import { unions, voterStats } from "@/app/data/kochua";

const UNION_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#845ec2", "#f9a826", "#00c9a7", "#c34a36",
  "#2c73d2", "#ff9671", "#008f7a", "#b39cd0",
];

const GROUP_COLORS = { A: "#4d96ff", B: "#6bcb77", C: "#ff6b6b" };

export default function KochuaUnionMap() {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  const colorById = useMemo(() => {
    const m = {};
    unions.forEach((u, i) => (m[u.id] = UNION_COLORS[i % UNION_COLORS.length]));
    return m;
  }, []);

  const selectedUnion = selected ? unions.find((u) => u.id === selected) : null;
  const s = selected ? voterStats[selected] : null;

  // Summary stats
  const totals = useMemo(() => {
    let totalVoter = 0;
    let a = 0, b = 0, c = 0;

    for (const u of unions) {
      const st = voterStats[u.id];
      if (!st) continue;
      totalVoter += st.total || 0;
      a += st.A || 0;
      b += st.B || 0;
      c += st.C || 0;
    }
    return { totalVoter, a, b, c };
  }, []);

  const hoveredUnion = hover ? unions.find((u) => u.id === hover.id) : null;

  return (
    <div className="relative">
      {/* ===== Hero ===== */}
      <div className="mb-4 overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Election Dashboard • Union Map
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Kochua Upazila — Union Wise Voter View
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Hover করলে ইউনিয়নের <span className="font-semibold">Total voter</span> দেখবেন।
                ইউনিয়নের উপর Click করলে <span className="font-semibold">A/B/C voter</span> সহ বিস্তারিত দেখতে পাবেন.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                Live Preview
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                Hover: Total
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                Click: Details
              </span>
            </div>
          </div>

          {/* ===== Stats Cards ===== */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <StatCard title="Total Voter (All Unions)" value={totals.totalVoter} hint="Sum of 12 unions" />
            <StatCard title="A Voter" value={totals.a} dotColor={GROUP_COLORS.A} />
            <StatCard title="B Voter" value={totals.b} dotColor={GROUP_COLORS.B} />
            <StatCard title="C Voter" value={totals.c} dotColor={GROUP_COLORS.C} />
          </div>
        </div>
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* ===== Map Card ===== */}
        <div className="rounded-2xl border bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Union Map</h2>
              
            </div>

            {/* Small legend */}
            <div className="flex flex-wrap items-center gap-2">
              <LegendPill label="A" color={GROUP_COLORS.A} />
              <LegendPill label="B" color={GROUP_COLORS.B} />
              <LegendPill label="C" color={GROUP_COLORS.C} />
            </div>
          </div>

          <div className="p-4">
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-50 to-white">
              {/* SVG MAP */}
              <svg viewBox="0 0 400 500" className="h-[68vh] w-full">
                {/* Soft shadow */}
                <defs>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
                  </filter>
                  <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.30" />
                  </filter>
                </defs>

                {/* Upazila outline */}
                <path
                  d="M50,40 C120,10 280,20 330,80 C380,140 360,260 340,360 C320,460 220,505 140,480 C60,450 35,350 40,250 C45,150 20,70 50,40 Z"
                  fill="#f8fafc"
                  stroke="#0f172a"
                  strokeOpacity="0.18"
                  strokeWidth="2"
                  filter="url(#softShadow)"
                />

                {/* 12 unions */}
                {demoUnionPaths.map((p) => {
                  const isHovered = hover?.id === p.id;
                  const fill = colorById[p.id];

                  return (
                    <path
                      key={p.id}
                      d={p.d}
                      fill={fill}
                      fillOpacity={isHovered ? "0.90" : "0.78"}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? "3" : "2"}
                      filter={isHovered ? "url(#hoverGlow)" : "none"}
                      className="cursor-pointer transition-all duration-150"
                      style={{
                        transformOrigin: "center",
                        transform: isHovered ? "scale(1.01)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => setHover({ id: p.id, x: e.clientX, y: e.clientY })}
                      onMouseMove={(e) =>
                        setHover((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))
                      }
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setSelected(p.id)}
                    />
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hover && (
                <div
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-2xl border border-white/20 bg-slate-950/90 px-3 py-2 text-sm text-white shadow-xl backdrop-blur"
                  style={{ left: hover.x, top: hover.y }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: colorById[hover.id] || "#999" }}
                    />
                    <div className="font-semibold">
                      {hoveredUnion?.name || hover.id}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-white/80">
                    Total voter:{" "}
                    <span className="font-semibold text-white">
                      {voterStats[hover.id]?.total ?? 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Right Sidebar ===== */}
        <div className="rounded-2xl border bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
          <h3 className="text-base font-semibold text-slate-900">Union List</h3>
        

          <div className="mt-4 space-y-2">
            {unions.map((u) => {
              const st = voterStats[u.id];
              const isActive = selected === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelected(u.id)}
                  className={[
                    "w-full rounded-xl border px-3 py-2 text-left transition",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: colorById[u.id] }}
                      />
                      <div className="font-semibold">{u.name}</div>
                    </div>
                    <div className={isActive ? "text-white/90" : "text-slate-600"}>
                      {st?.total ?? 0}
                    </div>
                  </div>
                  <div className={isActive ? "text-xs text-white/75" : "text-xs text-slate-500"}>
                    {u.bn}
                  </div>
                </button>
              );
            })}
          </div>

          
        </div>
      </div>

      {/* ===== Modal ===== */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="border-b bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: colorById[selected] }}
                    />
                    <div className="text-lg font-semibold text-slate-900">{selectedUnion?.name}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{selectedUnion?.bn}</div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl border bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-white p-4">
                  <div className="text-sm text-slate-600">Total voter</div>
                  <div className="mt-1 text-3xl font-bold text-slate-900">{s?.total ?? 0}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Union wise total voter count
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Breakdown</div>
                  <div className="mt-3 space-y-2">
                    {["A", "B", "C"].map((k) => (
                      <div key={k} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ background: GROUP_COLORS[k] }} />
                          <span className="text-sm font-medium text-slate-800">{k} voter</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{s?.[k] ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Distribution</div>
                  <div className="text-xs text-slate-600">A / B / C</div>
                </div>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  {["A", "B", "C"].map((k) => {
                    const val = s?.[k] ?? 0;
                    const pct = s?.total ? (val / s.total) * 100 : 0;
                    return (
                      <span
                        key={k}
                        className="inline-block h-full"
                        style={{ width: `${pct}%`, background: GROUP_COLORS[k] }}
                      />
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                  {["A", "B", "C"].map((k) => {
                    const val = s?.[k] ?? 0;
                    const pct = s?.total ? Math.round((val / s.total) * 100) : 0;
                    return (
                      <div key={k} className="rounded-xl bg-white px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: GROUP_COLORS[k] }} />
                          <span className="font-semibold">{k}</span>
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, hint, dotColor }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        {dotColor ? <span className="h-2.5 w-2.5 rounded-full" style={{ background: dotColor }} /> : null}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{Number(value || 0).toLocaleString()}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function LegendPill({ label, color }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}


const demoUnionPaths = [
  { id: "pathair", d: "M85,90 L190,80 L205,140 L105,155 Z" },
  { id: "bitara", d: "M190,80 L285,95 L270,160 L205,140 Z" },
  { id: "sachar", d: "M105,155 L205,140 L210,210 L120,225 Z" },
  { id: "palakhal", d: "M120,225 L210,210 L205,270 L120,290 Z" },
  { id: "sahadebpur", d: "M55,190 L120,225 L120,290 L65,270 Z" },
  { id: "uttar_kachua", d: "M205,140 L270,160 L275,230 L210,210 Z" },
  { id: "dakkhin_kachua", d: "M205,270 L275,230 L295,310 L215,330 Z" },
  { id: "kadla", d: "M120,290 L205,270 L215,330 L130,350 Z" },
  { id: "karaia", d: "M215,330 L295,310 L305,390 L235,410 Z" },
  { id: "uttar_gohat", d: "M295,310 L330,280 L350,350 L305,390 Z" },
  { id: "dakkhin_gohat", d: "M235,410 L305,390 L325,455 L255,470 Z" },
  { id: "ashrafpur", d: "M305,390 L350,350 L365,430 L325,455 Z" },
];
