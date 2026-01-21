import Link from "next/link";

const features = [
  {
    title: "Top30 automatico",
    body: "Guarda los 40 jugadores y calcula el total con los 30 mejores sin esfuerzo.",
  },
  {
    title: "Exploracion diaria",
    body: "Registra espadas, calcula rachas y dispara advertencias si alguien baja el ritmo.",
  },
  {
    title: "Comparaciones por rango",
    body: "Compara cualquier rango A vs B para detectar mejoras reales en PHASE1 y exploracion.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Configura el clan",
    body: "Crea o une clanes, carga tu roster y cambia de clan en segundos.",
  },
  {
    step: "02",
    title: "Registra cada dia",
    body: "Captura PHASE1, exploracion y deja todo el historial disponible para auditorias.",
  },
  {
    step: "03",
    title: "Toma decisiones",
    body: "Activa advertencias, revisa comparativas y ajusta tu estrategia semanal.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 px-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            ClanOps
          </Link>
          <span className="ml-3 hidden text-sm text-base-content/70 md:inline">
            Centro de mando para Survivor.io
          </span>
        </div>
        <div className="flex-none gap-3">
          <Link href="/login" className="btn btn-ghost">
            Entrar
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-secondary/30 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="badge badge-secondary badge-outline animate-fade-in">
              Centro de operaciones
            </span>
            <h1
              className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              Controla la semana de batalla sin caos de hojas sueltas.
            </h1>
            <p
              className="text-lg text-base-content/70 animate-fade-up"
              style={{ animationDelay: "140ms" }}
            >
              ClanOps centraliza PHASE1, exploracion diaria, advertencias y
              comparativas para que tomes decisiones en tiempo real.
            </p>
            <div
              className="flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link href="/signup" className="btn btn-primary">
                Empezar ahora
              </Link>
              <Link href="/login" className="btn btn-outline">
                Ya tengo cuenta
              </Link>
            </div>
            <div
              className="grid gap-4 sm:grid-cols-3 animate-fade-up"
              style={{ animationDelay: "260ms" }}
            >
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4">
                <div className="text-xs uppercase text-base-content/60">Plantilla</div>
                <div className="text-2xl font-semibold">40 jugadores</div>
                <div className="text-sm text-base-content/60">Sin limite de historial</div>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4">
                <div className="text-xs uppercase text-base-content/60">Top30</div>
                <div className="text-2xl font-semibold">Total real</div>
                <div className="text-sm text-base-content/60">Ranking siempre visible</div>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4">
                <div className="text-xs uppercase text-base-content/60">Alertas</div>
                <div className="text-2xl font-semibold">Advertencias</div>
                <div className="text-sm text-base-content/60">Rachas sin espadas</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "220ms" }}>
            <div className="card border border-base-300 bg-base-100/90 shadow-xl">
              <div className="card-body space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase text-base-content/60">
                      Panel semanal
                    </div>
                    <h2 className="text-xl font-semibold">Semana actual</h2>
                  </div>
                  <span className="badge badge-primary badge-outline">En vivo</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl bg-base-200 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>PHASE1 Top30</span>
                      <span className="font-semibold text-primary">2,148,900</span>
                    </div>
                    <progress className="progress progress-primary mt-2" value={70} max={100}></progress>
                  </div>
                  <div className="rounded-xl bg-base-200 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Exploracion diaria</span>
                      <span className="font-semibold text-secondary">32 registros</span>
                    </div>
                    <progress className="progress progress-secondary mt-2" value={82} max={100}></progress>
                  </div>
                </div>
                <div className="divider my-1"></div>
                <div className="space-y-2">
                  {[
                    { name: "Echo", value: "+12,400" },
                    { name: "Nova", value: "+8,950" },
                    { name: "Riven", value: "+7,120" },
                  ].map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between rounded-lg border border-base-300 bg-base-100 px-3 py-2"
                    >
                      <span className="font-medium">{entry.name}</span>
                      <span className="text-sm text-base-content/70">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-6 hidden h-20 w-20 rounded-full bg-accent/20 blur-2xl lg:block animate-float-slow"></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card border border-base-300 bg-base-100/80"
            >
              <div className="card-body space-y-2">
                <div className="text-xs uppercase text-base-content/60">
                  Modulo 0{index + 1}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-base-content/70">{feature.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <span className="badge badge-outline badge-primary">Flujo claro</span>
            <h2 className="text-3xl font-semibold">Una rutina semanal sin friccion</h2>
            <p className="text-base-content/70">
              Mantiene cada dato guardado, evita ediciones peligrosas en periodos
              cerrados y deja las comparativas listas cuando las necesitas.
            </p>
            <Link href="/signup" className="btn btn-outline">
              Crear clan ahora
            </Link>
          </div>
          <div className="space-y-6">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-2xl border border-base-300 bg-base-100/80 p-5"
              >
                <span className="badge badge-primary badge-outline text-base">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-base-content/70">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="card bg-neutral text-neutral-content">
              <div className="card-body flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Lista tu sala de mando</h2>
                  <p className="text-neutral-content/70">
                    Empieza con tu clan hoy y guarda cada batalla con historial completo.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/signup" className="btn btn-primary">
                    Crear cuenta
                  </Link>
                  <Link href="/login" className="btn btn-ghost">
                    Entrar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
