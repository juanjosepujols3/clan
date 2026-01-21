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
        <h1 className="text-2xl sm:text-3xl font-bold">Inicia sesión</h1>
        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
          Entra a tu panel de clanes y retoma el control semanal.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Correo</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lider@clan.com"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Contraseña</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu clave"
            required
          />
        </div>

        {error && (
          <div className="alert alert-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
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

      <div className="divider text-sm">O</div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <span className="text-base-content/70">¿Nuevo por aquí?</span>
        <Link className="link link-primary font-semibold" href="/signup">
          Crear cuenta →
        </Link>
      </div>
    </div>
  );
}
