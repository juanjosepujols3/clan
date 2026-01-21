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
      setError("Correo o contrasena invalida.");
      return;
    }

    const from = searchParams.get("from") || "/dashboard";
    router.push(from);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="badge badge-outline badge-secondary">Acceso</span>
        <h1 className="text-2xl font-semibold">Inicia sesion</h1>
        <p className="text-base-content/70">
          Entra a tu panel de clanes y retoma el control semanal.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="form-control w-full">
          <span className="label-text">Correo</span>
          <input
            type="email"
            className="input input-bordered"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lider@clan.com"
            required
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">Contrasena</span>
          <input
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu clave"
            required
          />
        </label>
        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
        <span>Nuevo por aqui?</span>
        <Link className="link" href="/signup">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
