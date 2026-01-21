"use client";

import { useEffect, useState } from "react";
import { toDateOnlyString } from "@/lib/dates";

export default function WarningsPage() {
  const [current, setCurrent] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/warnings");
    if (!response.ok) {
      setMessage("No se pudo cargar advertencias.");
      return;
    }
    const data = await response.json();
    setCurrent(data.current || []);
    setHistory(data.history || []);
  };

  useEffect(() => {
    load();
  }, []);

  const recompute = async () => {
    setMessage(null);
    const response = await fetch("/api/warnings", { method: "POST" });
    if (!response.ok) {
      setMessage("No se pudo calcular advertencias.");
      return;
    }
    await load();
  };

  const acknowledge = async (id: string) => {
    await fetch("/api/warnings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ warningId: id }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Advertencias</h1>
          <p className="text-base-content/70">
            Registra eventos y marca como vistos cuando se atienden.
          </p>
        </div>
        <button className="btn btn-outline" onClick={recompute}>
          Calcular advertencias
        </button>
      </div>
      {message ? <div className="alert alert-error">{message}</div> : null}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Infractores actuales</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>IGN</th>
                  <th>Tipo</th>
                  <th>Periodo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {current.map((warning) => (
                  <tr key={warning.id}>
                    <td>{toDateOnlyString(new Date(warning.triggerDate))}</td>
                    <td className="font-medium">{warning.player?.ign}</td>
                    <td>{warning.type}</td>
                    <td>{warning.period?.name ?? ""}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => acknowledge(warning.id)}
                      >
                        Marcar visto
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Historial</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>IGN</th>
                  <th>Tipo</th>
                  <th>Periodo</th>
                  <th>Visto</th>
                </tr>
              </thead>
              <tbody>
                {history.map((warning) => (
                  <tr key={warning.id}>
                    <td>{toDateOnlyString(new Date(warning.triggerDate))}</td>
                    <td className="font-medium">{warning.player?.ign}</td>
                    <td>{warning.type}</td>
                    <td>{warning.period?.name ?? ""}</td>
                    <td>{warning.acknowledgedAt ? "Si" : ""}</td>
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
