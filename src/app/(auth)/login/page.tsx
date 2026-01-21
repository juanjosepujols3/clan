"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña inválida.");
      return;
    }

    const from = searchParams.get("from") || "/dashboard";
    router.push(from);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="badge badge-secondary badge-lg glow-cyan">
          🔐 Acceso
        </span>
        <h1 className="text-3xl font-bold">Inicia sesión</h1>
        <p className="text-base-content/70">
          Entra a tu panel de clanes y retoma el control semanal.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Correo</span>
          <input
            type="email"
            className="input input-bordered bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lider@clan.com"
            required
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Contraseña</span>
          <input
            type="password"
            className="input input-bordered bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu clave"
            required
          />
        </label>

        {error ? (
          <div className="alert alert-error text-sm glass-strong">
            <span>⚠️ {error}</span>
          </div>
        ) : null}

        <button
          className="btn btn-primary w-full btn-lg glow-violet hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Ingresando...
            </>
          ) : (
            "Entrar →"
          )}
        </button>
      </form>

      <div className="divider">O</div>

      <div className="flex flex-wrap items-center justify-between text-sm">
        <span className="text-base-content/70">¿Nuevo por aquí?</span>
        <Link className="link link-primary font-semibold" href="/signup">
          Crear cuenta →
        </Link>
      </div>
    </div>
  );
}
