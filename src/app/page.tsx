import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "Top30 automático",
    body: "Guarda los 40 jugadores y calcula el total con los 30 mejores sin esfuerzo.",
  },
  {
    icon: "⚔️",
    title: "Exploración diaria",
    body: "Registra espadas, calcula rachas y dispara advertencias si alguien baja el ritmo.",
  },
  {
    icon: "📊",
    title: "Comparaciones por rango",
    body: "Compara cualquier rango A vs B para detectar mejoras reales en PHASE1 y exploración.",
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
    title: "Registra cada día",
    body: "Captura PHASE1, exploración y deja todo el historial disponible para auditorías.",
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
      <header className="navbar glass-strong sticky top-0 z-50 px-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="gradient-text">ClanOps</span>
          </Link>
          <span className="ml-3 hidden text-sm text-base-content/70 md:inline">
            Centro de mando para Survivor.io
          </span>
        </div>
        <div className="flex-none gap-3">
          <Link href="/login" className="btn btn-ghost">
            Entrar
          </Link>
          <Link href="/signup" className="btn btn-primary glow-violet">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl animate-float-slow"></div>
        <div className="pointer-events-none absolute top-1/3 left-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }}></div>
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl animate-float-slow" style={{ animationDelay: "4s" }}></div>

        {/* Hero Section */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
          <div className="space-y-8">
            <span className="badge badge-secondary badge-lg animate-fade-in glow-cyan">
              🚀 Centro de operaciones
            </span>
            <h1
              className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Controla la semana de batalla{" "}
              <span className="gradient-text">sin caos</span> de hojas sueltas.
            </h1>
            <p
              className="text-xl text-base-content/80 leading-relaxed animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              ClanOps centraliza PHASE1, exploración diaria, advertencias y
              comparativas para que tomes decisiones en tiempo real.
            </p>
            <div
              className="flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="/signup" className="btn btn-primary btn-lg glow-violet hover:scale-105 transition-transform">
                Empezar ahora →
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg hover:glass">
                Ya tengo cuenta
              </Link>
            </div>

            {/* Stats cards */}
            <div
              className="grid gap-4 sm:grid-cols-3 animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="glass rounded-2xl p-5 hover:glass-strong transition-all duration-300 group">
                <div className="text-xs uppercase text-secondary font-semibold tracking-wider">Plantilla</div>
                <div className="text-3xl font-bold mt-1 group-hover:gradient-text transition-all">40 jugadores</div>
                <div className="text-sm text-base-content/60 mt-1">Sin límite de historial</div>
              </div>
              <div className="glass rounded-2xl p-5 hover:glass-strong transition-all duration-300 group">
                <div className="text-xs uppercase text-primary font-semibold tracking-wider">Top30</div>
                <div className="text-3xl font-bold mt-1 group-hover:gradient-text transition-all">Total real</div>
                <div className="text-sm text-base-content/60 mt-1">Ranking siempre visible</div>
              </div>
              <div className="glass rounded-2xl p-5 hover:glass-strong transition-all duration-300 group">
                <div className="text-xs uppercase text-accent font-semibold tracking-wider">Alertas</div>
                <div className="text-3xl font-bold mt-1 group-hover:gradient-text transition-all">Advertencias</div>
                <div className="text-sm text-base-content/60 mt-1">Rachas sin espadas</div>
              </div>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="relative animate-scale-in" style={{ animationDelay: "300ms" }}>
            <div className="glass-strong rounded-3xl p-6 shadow-2xl border-2 border-violet-500/20">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase text-secondary font-semibold tracking-wider">
                      Panel semanal
                    </div>
                    <h2 className="text-2xl font-bold mt-1">Semana actual</h2>
                  </div>
                  <span className="badge badge-primary badge-lg animate-glow-pulse">En vivo</span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-violet-600/5 p-4 border border-violet-500/20">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">PHASE1 Top30</span>
                      <span className="font-bold text-primary text-lg">2,148,900</span>
                    </div>
                    <progress className="progress progress-primary" value={70} max={100}></progress>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 p-4 border border-cyan-500/20">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Exploración diaria</span>
                      <span className="font-bold text-secondary text-lg">32 registros</span>
                    </div>
                    <progress className="progress progress-secondary" value={82} max={100}></progress>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-3">
                  {[
                    { name: "Echo", value: "+12,400", rank: "🥇" },
                    { name: "Nova", value: "+8,950", rank: "🥈" },
                    { name: "Riven", value: "+7,120", rank: "🥉" },
                  ].map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between glass rounded-xl px-4 py-3 hover:glass-strong transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{entry.rank}</span>
                        <span className="font-semibold">{entry.name}</span>
                      </div>
                      <span className="text-sm font-mono text-success">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl animate-glow-pulse"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 hover:glass-strong hover:scale-105 transition-all duration-300 group border border-base-content/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="text-5xl group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <div className="text-xs uppercase text-primary font-semibold tracking-wider">
                  Módulo 0{index + 1}
                </div>
                <h3 className="text-xl font-bold group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 leading-relaxed">{feature.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Workflow Section */}
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <span className="badge badge-outline badge-primary badge-lg glow-violet">
              Flujo claro
            </span>
            <h2 className="text-4xl font-bold lg:text-5xl">
              Una rutina semanal <span className="gradient-text">sin fricción</span>
            </h2>
            <p className="text-lg text-base-content/70 leading-relaxed">
              Mantiene cada dato guardado, evita ediciones peligrosas en períodos
              cerrados y deja las comparativas listas cuando las necesitas.
            </p>
            <Link href="/signup" className="btn btn-outline btn-lg hover:btn-primary hover:glow-violet transition-all">
              Crear clan ahora →
            </Link>
          </div>

          <div className="space-y-5">
            {workflow.map((item, index) => (
              <div
                key={item.step}
                className="flex gap-5 glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="badge badge-primary badge-lg text-lg font-bold min-w-[3rem] h-12 glow-violet">
                  {item.step}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:gradient-text transition-all">
                    {item.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="glass-strong rounded-3xl p-10 md:p-12 border-2 border-violet-500/20 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"></div>
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"></div>

              <div className="relative flex flex-col items-center gap-8 md:flex-row md:justify-between text-center md:text-left">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Lista tu <span className="gradient-text">sala de mando</span>
                  </h2>
                  <p className="text-lg text-base-content/70">
                    Empieza con tu clan hoy y guarda cada batalla con historial completo.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/signup" className="btn btn-primary btn-lg glow-violet hover:scale-105 transition-transform">
                    Crear cuenta
                  </Link>
                  <Link href="/login" className="btn btn-ghost btn-lg hover:glass">
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
