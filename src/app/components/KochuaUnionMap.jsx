"use client";

import { useMemo, useState } from "react";
import { unions, voterStats } from "@/app/data/kochua";


const UNION_COLORS = [
  "#ff6b6b","#ffd93d","#6bcb77","#4d96ff",
  "#845ec2","#f9a826","#00c9a7","#c34a36",
  "#2c73d2","#ff9671","#008f7a","#b39cd0",
];

const GROUP_COLORS = { A: "#4d96ff", B: "#6bcb77", C: "#ff6b6b" };

export default function KochuaUnionMap() {
  const [hover, setHover] = useState(null); // {id, x, y}
  const [selected, setSelected] = useState(null); // union id

  const colorById = useMemo(() => {
    const m = {};
    unions.forEach((u, i) => (m[u.id] = UNION_COLORS[i % UNION_COLORS.length]));
    return m;
  }, []);

  const s = selected ? voterStats[selected] : null;
  const selectedUnion = selected ? unions.find(u => u.id === selected) : null;

  return (
    <div className="relative">
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kochua Upazila — Union Map</h2>
          <div className="text-sm text-gray-500">Hover = total voter, Click = details</div>
        </div>

        {/* SVG MAP (placeholder paths) */}
        <svg viewBox="0 0 400 500" className="h-[70vh] w-full">
          {/* Upazila outline (simple) */}
          <path d="M50,40 C120,10 280,20 330,80 C380,140 360,260 340,360 C320,460 220,505 140,480 C60,450 35,350 40,250 C45,150 20,70 50,40 Z"
                fill="#f8fafc" stroke="#0f172a" strokeOpacity="0.25" strokeWidth="2" />

          {/* 12 unions as demo shapes (replace later with real SVG paths) */}
          {demoUnionPaths.map((p, idx) => {
            const data = voterStats[p.id] || { total: 0, A: 0, B: 0, C: 0 };
            return (
              <path
                key={p.id}
                d={p.d}
                fill={colorById[p.id]}
                fillOpacity="0.75"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition"
                onMouseEnter={(e) => {
                  setHover({ id: p.id, x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setHover((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
                }}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(p.id)}
              />
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl bg-black/80 px-3 py-2 text-sm text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="font-semibold">
            {unions.find(u => u.id === hover.id)?.name || hover.id}
          </div>
          <div>Total voter: {voterStats[hover.id]?.total ?? 0}</div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{selectedUnion?.name}</div>
                <div className="text-sm text-gray-500">{selectedUnion?.bn}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-600">Total voter</div>
              <div className="text-3xl font-bold">{s?.total ?? 0}</div>
            </div>

            <div className="mt-4 space-y-2">
              {["A", "B", "C"].map((k) => (
                <div key={k} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: GROUP_COLORS[k] }} />
                    <span className="font-medium">{k} voter</span>
                  </div>
                  <span className="font-semibold">{s?.[k] ?? 0}</span>
                </div>
              ))}
            </div>

            {/* Stacked bar */}
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

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Demo paths: এগুলো placeholder।
 * পরে তুমি Inkscape/Figma থেকে “real union boundaries” SVG path বসিয়ে দিলেই হবে।
 */
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
