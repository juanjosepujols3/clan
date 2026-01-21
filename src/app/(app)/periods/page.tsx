"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toDateOnlyString } from "@/lib/dates";

type Period = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  phase1Top30Total: number;
};

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/periods");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setPeriods(data.periods || []);
  };

  useEffect(() => {
    load();
  }, []);

  const createPeriod = async () => {
    setMessage(null);
    const response = await fetch("/api/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "No se pudo crear el periodo.");
      return;
    }

    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Periodos</h1>
          <p className="text-base-content/70">
            Ciclos semanales de batalla. Cierra cuando finalice.
          </p>
        </div>
        <button className="btn btn-primary" onClick={createPeriod}>
          Crear nuevo periodo
        </button>
      </div>
      {message ? <div className="alert alert-error">{message}</div> : null}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                  <th>Total Top30</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period.id}>
                    <td className="font-medium">{period.name}</td>
                    <td>
                      {toDateOnlyString(new Date(period.startDate))} ->{" "}
                      {toDateOnlyString(new Date(period.endDate))}
                    </td>
                    <td>{period.isClosed ? "Cerrado" : "Abierto"}</td>
                    <td>{period.phase1Top30Total}</td>
                    <td className="flex flex-wrap gap-2">
                      <Link
                        href={`/phase1/${period.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        PHASE1
                      </Link>
                      <Link
                        href={`/periods/${period.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Detalles
                      </Link>
                    </td>
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
