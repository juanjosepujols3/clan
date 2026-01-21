"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toDateOnlyString } from "@/lib/dates";

type Period = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  phase1Top30Total: number;
};

export default function PeriodDetailPage() {
  const params = useParams();
  const periodId = params?.periodId as string;
  const [period, setPeriod] = useState<Period | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch(`/api/periods/${periodId}`);
    if (!response.ok) {
      setMessage("No se pudo cargar el periodo.");
      return;
    }
    const data = await response.json();
    setPeriod(data.period);
  };

  useEffect(() => {
    if (periodId) {
      load();
    }
  }, [periodId]);

  const closePeriod = async () => {
    if (!period) {
      return;
    }
    const response = await fetch(`/api/periods/${period.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isClosed: true }),
    });

    if (!response.ok) {
      setMessage("No se pudo cerrar el periodo.");
      return;
    }

    await load();
  };

  if (!period) {
    return <div className="text-base-content/70">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{period.name}</h1>
        <p className="text-base-content/70">
          {toDateOnlyString(new Date(period.startDate))} ->{" "}
          {toDateOnlyString(new Date(period.endDate))}
        </p>
      </div>

      {message ? <div className="alert alert-error">{message}</div> : null}

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          <div className="flex flex-wrap gap-4">
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
          {!period.isClosed ? (
            <button className="btn btn-warning" onClick={closePeriod}>
              Cerrar periodo
            </button>
          ) : (
            <div className="alert alert-info">Este periodo esta cerrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
