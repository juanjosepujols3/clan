"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "No se pudo crear la cuenta.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Cuenta creada, pero falló el acceso.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="badge badge-secondary badge-lg glow-cyan">
          ✨ Nuevo clan
        </span>
        <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
        <p className="text-base-content/70">
          Configura tu centro de mando en minutos.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text font-semibold mb-2">Nombre visible</span>
            <input
              type="text"
              className="input input-bordered bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Líder de clan"
            />
          </label>

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
        </div>

        <label className="form-control w-full">
          <span className="label-text font-semibold mb-2">Contraseña</span>
          <input
            type="password"
            className="input input-bordered bg-base-200/50 focus:bg-base-200 focus:border-primary focus:glow-violet transition-all"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
          />
          <span className="label-text-alt text-base-content/60 mt-2">
            💡 Usa al menos 8 caracteres para mayor seguridad.
          </span>
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
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta →"
          )}
        </button>
      </form>

      <div className="divider">O</div>

      <div className="flex flex-wrap items-center justify-between text-sm">
        <span className="text-base-content/70">¿Ya tienes cuenta?</span>
        <Link className="link link-primary font-semibold" href="/login">
          Entrar →
        </Link>
      </div>
    </div>
  );
}
