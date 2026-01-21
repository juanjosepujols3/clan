import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSelectedClanId } from "@/lib/clan";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const selectedClanId = await getSelectedClanId(userId);

  if (!selectedClanId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Bienvenido a ClanOps</h1>
        <p className="text-base-content/70">
          Crea o unete a un clan para iniciar el seguimiento semanal.
        </p>
        <Link href="/clan" className="btn btn-primary">
          Crea tu primer clan
        </Link>
      </div>
    );
  }

  const [clan, playersCount, openPeriods, warnings] = await Promise.all([
    db.clan.findUnique({ where: { id: selectedClanId } }),
    db.player.count({ where: { clanId: selectedClanId } }),
    db.period.count({ where: { clanId: selectedClanId, isClosed: false } }),
    db.warningEvent.count({ where: { clanId: selectedClanId } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{clan?.name ?? "Clan"}</h1>
        <p className="text-base-content/70">
          Mantiene PHASE1, rachas de exploracion y advertencias sincronizadas.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="text-sm uppercase text-base-content/60">Plantilla</div>
            <div className="text-3xl font-semibold">{playersCount}</div>
            <Link className="link" href="/clan/members">
              Gestionar miembros
            </Link>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="text-sm uppercase text-base-content/60">Periodos abiertos</div>
            <div className="text-3xl font-semibold">{openPeriods}</div>
            <Link className="link" href="/periods">
              Ver periodos
            </Link>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="text-sm uppercase text-base-content/60">Advertencias</div>
            <div className="text-3xl font-semibold">{warnings}</div>
            <Link className="link" href="/warnings">
              Revisar advertencias
            </Link>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Acciones rapidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/periods" className="btn btn-outline">
              Cargar PHASE1
            </Link>
            <Link href="/exploration" className="btn btn-outline">
              Registrar exploracion
            </Link>
            <Link href="/compare" className="btn btn-outline">
              Comparar rangos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
