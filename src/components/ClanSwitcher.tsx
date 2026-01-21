"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Clan = {
  id: string;
  name: string;
};

export default function ClanSwitcher() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/clans");
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      setClans(data.clans || []);
      setSelectedClanId(data.selectedClanId || null);
      setLoading(false);
    };
    load();
  }, []);

  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClanId(value);
    await fetch(`/api/clans/${value}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ select: true }),
    });
  };

  if (loading) {
    return <span className="text-sm text-base-content/70">Cargando clanes...</span>;
  }

  if (!clans.length) {
    return (
      <Link href="/clan" className="btn btn-sm btn-outline">
        Crea tu primer clan
      </Link>
    );
  }

  return (
    <label className="form-control">
      <select
        className="select select-bordered select-sm"
        value={selectedClanId ?? ""}
        onChange={handleSelect}
      >
        <option value="" disabled>
          Selecciona clan
        </option>
        {clans.map((clan) => (
          <option key={clan.id} value={clan.id}>
            {clan.name}
          </option>
        ))}
      </select>
    </label>
  );
}
