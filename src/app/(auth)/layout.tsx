import Link from "next/link";

const highlights = [
  {
    title: "PHASE1 con ranking",
    body: "Ordena los 40 jugadores y suma el top30 automaticamente.",
  },
  {
    title: "Exploracion diaria",
    body: "Rachas sin espadas detectadas y guardadas como advertencias.",
  },
  {
    title: "Comparativas claras",
    body: "Rango A vs B para ver mejoras reales en minutos.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 px-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            ClanOps
          </Link>
        </div>
        <div className="flex-none">
          <Link href="/" className="btn btn-ghost btn-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
      <main className="relative px-6 py-12">
        <div className="pointer-events-none absolute -top-10 right-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>

        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-6">
            <span className="badge badge-outline badge-secondary">
              Acceso para lideres
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Tu centro de mando en cada batalla.
              </h1>
              <p className="text-base-content/70">
                Organiza PHASE1, exploracion diaria y advertencias sin perder el
                historial. Todo listo para tu siguiente decision.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4">
                <div className="text-xs uppercase text-base-content/60">Plantilla</div>
                <div className="text-2xl font-semibold">40 jugadores</div>
                <div className="text-sm text-base-content/60">Multiples clanes</div>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4">
                <div className="text-xs uppercase text-base-content/60">Historial</div>
                <div className="text-2xl font-semibold">100% guardado</div>
                <div className="text-sm text-base-content/60">Sin sobreescritura</div>
              </div>
            </div>
            <div className="space-y-3">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-base-300 bg-base-100/70 p-4"
                >
                  <span className="badge badge-primary badge-outline">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-base-content/70">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="card border border-base-300 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
