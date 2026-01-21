"use client";

import { useEffect, useRef, useState } from "react";

type Player = {
  id: string;
  ign: string;
  isActive: boolean;
};

export default function MembersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newIgn, setNewIgn] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const load = async () => {
    const response = await fetch("/api/members");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setPlayers(data.players || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign: newIgn }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "No se pudo agregar el jugador.");
      return;
    }

    setNewIgn("");
    await load();
  };

  const updatePlayer = async (player: Player) => {
    const response = await fetch(`/api/members/${player.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign: player.ign, isActive: player.isActive }),
    });

    if (!response.ok) {
      setMessage("No se pudo actualizar el jugador.");
      return;
    }

    await load();
  };

  const deactivatePlayer = async (playerId: string) => {
    await fetch(`/api/members/${playerId}`, { method: "DELETE" });
    await load();
  };

  const requestDeactivate = (player: Player) => {
    setPendingPlayer(player);
    modalRef.current?.showModal();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Plantilla del clan</h1>
        <p className="text-base-content/70">Maximo 40 jugadores por clan.</p>
      </div>

      <form className="card bg-base-100 border border-base-300" onSubmit={handleAdd}>
        <div className="card-body space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="input input-bordered flex-1"
              placeholder="Nuevo IGN"
              value={newIgn}
              onChange={(event) => setNewIgn(event.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Agregar jugador
            </button>
          </div>
          {message ? <div className="alert alert-error">{message}</div> : null}
        </div>
      </form>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Jugadores</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>IGN</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id}>
                    <td>
                      <input
                        className="input input-bordered input-sm w-full"
                        value={player.ign}
                        onChange={(event) =>
                          setPlayers((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, ign: event.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={player.isActive}
                        onChange={(event) =>
                          setPlayers((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, isActive: event.target.checked }
                                : item
                            )
                          )
                        }
                      />
                    </td>
                    <td className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => updatePlayer(player)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => requestDeactivate(player)}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg">Desactivar jugador?</h3>
          <p className="py-4 text-base-content/70">
            {pendingPlayer?.ign} quedara inactivo pero seguira en el historial.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancelar</button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  if (pendingPlayer) {
                    await deactivatePlayer(pendingPlayer.id);
                  }
                }}
              >
                Desactivar
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
