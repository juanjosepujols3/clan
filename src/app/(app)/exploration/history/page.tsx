"use client";

import { useEffect, useState } from "react";
import { toDateOnlyString } from "@/lib/dates";

const todayString = () => new Date().toISOString().slice(0, 10);

export default function ExplorationHistoryPage() {
  const [start, setStart] = useState(todayString());
  const [end, setEnd] = useState(todayString());
  const [entries, setEntries] = useState<any[]>([]);

  const load = async () => {
    const response = await fetch(`/api/exploration?start=${start}&end=${end}`);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setEntries(data.entries || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Historial de exploracion</h1>
        <p className="text-base-content/70">
          Revisa el registro diario para cualquier rango.
        </p>
      </div>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="form-control">
              <span className="label-text">Inicio</span>
              <input
                type="date"
                className="input input-bordered"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>
            <label className="form-control">
              <span className="label-text">Fin</span>
              <input
                type="date"
                className="input input-bordered"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
            <button className="btn btn-primary self-end" onClick={load}>
              Actualizar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>IGN</th>
                  <th>Espadas</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{toDateOnlyString(new Date(entry.date))}</td>
                    <td className="font-medium">{entry.player?.ign}</td>
                    <td>{entry.swords}</td>
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
