"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const todayString = () => new Date().toISOString().slice(0, 10);

type Player = {
  id: string;
  ign: string;
};

type Entry = {
  playerId: string;
  swords: number;
};

type Streak = {
  playerId: string;
  ign: string;
  streak: number;
};

export default function ExplorationPage() {
  const [date, setDate] = useState(todayString());
  const [players, setPlayers] = useState<Player[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const [membersResponse, entriesResponse] = await Promise.all([
      fetch("/api/members"),
      fetch(`/api/exploration?start=${date}&end=${date}`),
    ]);

    if (!membersResponse.ok || !entriesResponse.ok) {
      setMessage("No se pudo cargar la exploracion.");
      return;
    }

    const membersData = await membersResponse.json();
    const entriesData = await entriesResponse.json();

    const roster: Player[] = membersData.players || [];
    const dayEntries: Entry[] = roster.map((player: Player) => {
      const existing = (entriesData.entries || []).find(
        (entry: any) => entry.playerId === player.id
      );
      return {
        playerId: player.id,
        swords: existing?.swords ?? 0,
      };
    });

    setPlayers(roster);
    setEntries(dayEntries);
    setStreaks(entriesData.streaks || []);
  };

  useEffect(() => {
    load();
  }, [date]);

  const handleSave = async () => {
    setMessage(null);
    const response = await fetch("/api/exploration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, entries }),
    });

    if (!response.ok) {
      setMessage("No se pudo guardar la exploracion.");
      return;
    }

    setMessage("Exploracion actualizada.");
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Exploracion diaria</h1>
          <p className="text-base-content/70">
            Registra espadas y monitorea rachas sin espadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/exploration/history" className="btn btn-outline">
            Ver historial
          </Link>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar dia
          </button>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Fecha</span>
            <input
              type="date"
              className="input input-bordered"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          {message ? <div className="alert alert-info">{message}</div> : null}
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>IGN</th>
                  <th>Espadas</th>
                  <th>Racha sin espadas</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const streak = streaks.find((item) => item.playerId === player.id);
                  return (
                    <tr key={player.id}>
                      <td className="font-medium">{player.ign}</td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-24"
                          value={entries[index]?.swords ?? 0}
                          onChange={(event) =>
                            setEntries((prev) =>
                              prev.map((entry, idx) =>
                                idx === index
                                  ? {
                                      ...entry,
                                      swords: Number(event.target.value),
                                    }
                                  : entry
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <span
                          className={
                            (streak?.streak ?? 0) > 5
                              ? "text-error font-semibold"
                              : ""
                          }
                        >
                          {streak?.streak ?? 0} dias
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
