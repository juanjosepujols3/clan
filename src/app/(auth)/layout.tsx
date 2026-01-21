import Link from "next/link";

const highlights = [
  {
    icon: "🎯",
    title: "PHASE1 con ranking",
    body: "Ordena los 40 jugadores y suma el top30 automáticamente.",
  },
  {
    icon: "⚔️",
    title: "Exploración diaria",
    body: "Rachas sin espadas detectadas y guardadas como advertencias.",
  },
  {
    icon: "📊",
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
      <div className="navbar glass-strong border-b border-base-content/10 px-6 sticky top-0 z-50">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="gradient-text">ClanOps</span>
          </Link>
        </div>
        <div className="flex-none">
          <Link href="/" className="btn btn-ghost btn-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <main className="relative px-6 py-12 min-h-[calc(100vh-4rem)]">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute -top-10 right-8 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl animate-float-slow"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }}></div>

        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left side - Showcase */}
          <section className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4 animate-fade-up">
              <span className="badge badge-secondary badge-lg glow-cyan">
                🚀 Acceso para líderes
              </span>
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                Tu centro de mando en{" "}
                <span className="gradient-text">cada batalla</span>.
              </h1>
              <p className="text-lg text-base-content/70 leading-relaxed">
                Organiza PHASE1, exploración diaria y advertencias sin perder el
                historial. Todo listo para tu siguiente decisión.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="glass rounded-2xl p-5 hover:glass-strong transition-all group">
                <div className="text-xs uppercase text-primary font-semibold tracking-wider">Plantilla</div>
                <div className="text-3xl font-bold mt-1 group-hover:gradient-text transition-all">40 jugadores</div>
                <div className="text-sm text-base-content/60 mt-1">Múltiples clanes</div>
              </div>
              <div className="glass rounded-2xl p-5 hover:glass-strong transition-all group">
                <div className="text-xs uppercase text-secondary font-semibold tracking-wider">Historial</div>
                <div className="text-3xl font-bold mt-1 group-hover:gradient-text transition-all">100% guardado</div>
                <div className="text-sm text-base-content/60 mt-1">Sin sobreescritura</div>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 glass rounded-2xl p-5 hover:glass-strong transition-all group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:gradient-text transition-all">
                      {item.title}
                    </h3>
                    <p className="text-sm text-base-content/70 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right side - Auth form */}
          <div className="order-1 lg:order-2 animate-scale-in">
            <div className="glass-strong rounded-3xl p-8 shadow-2xl border-2 border-violet-500/20 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl animate-glow-pulse"></div>
              <div className="relative space-y-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
