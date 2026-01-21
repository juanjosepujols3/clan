"use client";

import { useEffect, useState } from "react";

type Clan = {
  id: string;
  name: string;
  allowClosedEdits: boolean;
};

export default function ClanPage() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [action, setAction] = useState<"create" | "join">("create");
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/clans");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setClans(data.clans || []);
    setSelectedClanId(data.selectedClanId || null);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const response = await fetch("/api/clans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, action }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "No se pudo actualizar clanes.");
      return;
    }

    setName("");
    setMessage(action === "create" ? "Clan creado." : "Unido al clan.");
    await load();
  };

  const selectedClan = clans.find((clan) => clan.id === selectedClanId);

  const toggleClosedEdits = async (value: boolean) => {
    if (!selectedClanId) {
      return;
    }
    await fetch(`/api/clans/${selectedClanId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allowClosedEdits: value }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clanes</h1>
        <p className="text-base-content/70">
          Crea un clan o unete a uno existente por nombre.
        </p>
      </div>

      <form className="card bg-base-100 border border-base-300" onSubmit={handleSubmit}>
        <div className="card-body space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              className="select select-bordered"
              value={action}
              onChange={(event) => setAction(event.target.value as "create" | "join")}
            >
              <option value="create">Crear</option>
              <option value="join">Unirse</option>
            </select>
            <input
              className="input input-bordered flex-1"
              placeholder="Nombre del clan"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              {action === "create" ? "Crear clan" : "Unirse"}
            </button>
          </div>
          {message ? <div className="alert alert-info">{message}</div> : null}
        </div>
      </form>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Tus clanes</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Seleccionado</th>
                  <th>Permitir edicion en periodos cerrados</th>
                </tr>
              </thead>
              <tbody>
                {clans.map((clan) => (
                  <tr key={clan.id}>
                    <td className="font-medium">{clan.name}</td>
                    <td>{clan.id === selectedClanId ? "Si" : ""}</td>
                    <td>
                      {clan.id === selectedClanId ? (
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={selectedClan?.allowClosedEdits ?? false}
                          onChange={(event) => toggleClosedEdits(event.target.checked)}
                        />
                      ) : (
                        "-"
                      )}
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
