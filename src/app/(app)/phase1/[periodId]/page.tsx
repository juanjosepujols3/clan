"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type RankedEntry = {
  playerId: string;
  ign: string;
  value: number;
  rank: number;
  isTop30: boolean;
};

type Period = {
  id: string;
  name: string;
  isClosed: boolean;
  phase1Top30Total: number;
};

export default function Phase1Page() {
  const params = useParams();
  const periodId = params?.periodId as string;
  const [period, setPeriod] = useState<Period | null>(null);
  const [rows, setRows] = useState<RankedEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch(`/api/phase1?periodId=${periodId}`);
    if (!response.ok) {
      setMessage("No se pudo cargar PHASE1.");
      return;
    }
    const data = await response.json();
    setPeriod(data.period);
    setRows(data.ranked || []);
  };

  useEffect(() => {
    if (periodId) {
      load();
    }
  }, [periodId]);

  const handleSave = async () => {
    setMessage(null);
    const response = await fetch("/api/phase1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        periodId,
        entries: rows.map((row) => ({
          playerId: row.playerId,
          value: Number(row.value) || 0,
        })),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "No se pudo guardar PHASE1.");
      return;
    }

    setPeriod(payload.period);
    setRows(payload.ranked || []);
    setMessage("PHASE1 guardado.");
  };

  if (!period) {
    return <div className="text-base-content/70">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{period.name} - PHASE1</h1>
          <p className="text-base-content/70">
            El top 30 cuenta para el total del clan.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          Guardar puntajes
        </button>
      </div>
      {message ? <div className="alert alert-info">{message}</div> : null}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-sm uppercase text-base-content/60">Estado</div>
              <div className="text-xl font-semibold">
                {period.isClosed ? "Cerrado" : "Abierto"}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase text-base-content/60">Total Top30</div>
              <div className="text-xl font-semibold">{period.phase1Top30Total}</div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Rango</th>
                  <th>IGN</th>
                  <th>PHASE1</th>
                  <th>Top30</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.playerId}
                    className={row.isTop30 ? "bg-base-200" : ""}
                  >
                    <td>{row.rank}</td>
                    <td className="font-medium">{row.ign}</td>
                    <td>
                      <input
                        type="number"
                        className="input input-bordered input-sm w-28"
                        value={row.value}
                        onChange={(event) =>
                          setRows((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, value: Number(event.target.value) }
                                : item
                            )
                          )
                        }
                      />
                    </td>
                    <td>{row.isTop30 ? "Si" : ""}</td>
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
