"use client";

import { useState } from "react";

const todayString = () => new Date().toISOString().slice(0, 10);

export default function ComparePage() {
  const [rangeAStart, setRangeAStart] = useState(todayString());
  const [rangeAEnd, setRangeAEnd] = useState(todayString());
  const [rangeBStart, setRangeBStart] = useState(todayString());
  const [rangeBEnd, setRangeBEnd] = useState(todayString());
  const [phase1, setPhase1] = useState<any[]>([]);
  const [exploration, setExploration] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const runCompare = async () => {
    setMessage(null);
    const response = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rangeA: { start: rangeAStart, end: rangeAEnd },
        rangeB: { start: rangeBStart, end: rangeBEnd },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "No se pudo comparar rangos.");
      return;
    }

    const topPhase = (payload.phase1 || [])
      .filter((entry: any) => entry.delta > 0)
      .sort((a: any, b: any) => b.delta - a.delta)
      .slice(0, 10);

    const topExploration = (payload.exploration || [])
      .filter((entry: any) => entry.delta > 0)
      .sort((a: any, b: any) => b.delta - a.delta)
      .slice(0, 10);

    setPhase1(topPhase);
    setExploration(topExploration);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Comparar rangos</h1>
        <p className="text-base-content/70">
          Compara PHASE1 y exploracion entre dos rangos de fechas.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm uppercase text-base-content/60">Rango A</div>
              <div className="flex gap-3">
                <input
                  type="date"
                  className="input input-bordered"
                  value={rangeAStart}
                  onChange={(event) => setRangeAStart(event.target.value)}
                />
                <input
                  type="date"
                  className="input input-bordered"
                  value={rangeAEnd}
                  onChange={(event) => setRangeAEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm uppercase text-base-content/60">Rango B</div>
              <div className="flex gap-3">
                <input
                  type="date"
                  className="input input-bordered"
                  value={rangeBStart}
                  onChange={(event) => setRangeBStart(event.target.value)}
                />
                <input
                  type="date"
                  className="input input-bordered"
                  value={rangeBEnd}
                  onChange={(event) => setRangeBEnd(event.target.value)}
                />
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={runCompare}>
            Comparar
          </button>
          {message ? <div className="alert alert-error">{message}</div> : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Mejores subidas PHASE1</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>IGN</th>
                  <th>Total A</th>
                  <th>Total B</th>
                  <th>Delta</th>
                </tr>
              </thead>
              <tbody>
                {phase1.map((entry) => (
                  <tr key={entry.playerId}>
                    <td className="font-medium">{entry.ign}</td>
                    <td>{entry.aTotal}</td>
                    <td>{entry.bTotal}</td>
                    <td className="text-success font-semibold">+{entry.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Mejores subidas exploracion</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>IGN</th>
                  <th>Total A</th>
                  <th>Total B</th>
                  <th>Delta</th>
                </tr>
              </thead>
              <tbody>
                {exploration.map((entry) => (
                  <tr key={entry.playerId}>
                    <td className="font-medium">{entry.ign}</td>
                    <td>{entry.aTotal}</td>
                    <td>{entry.bTotal}</td>
                    <td className="text-success font-semibold">+{entry.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
