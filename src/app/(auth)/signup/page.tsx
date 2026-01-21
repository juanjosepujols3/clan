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
      setError("Cuenta creada, pero fallo el acceso.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="badge badge-outline badge-secondary">Nuevo clan</span>
        <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
        <p className="text-base-content/70">
          Configura tu centro de mando en minutos.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text">Nombre visible</span>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Lider de clan"
            />
          </label>
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
        </div>
        <label className="form-control w-full">
          <span className="label-text">Contrasena</span>
          <input
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            placeholder="Minimo 8 caracteres"
          />
          <span className="label-text-alt text-base-content/60">
            Usa al menos 8 caracteres.
          </span>
        </label>
        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
        <span>Ya tienes cuenta?</span>
        <Link className="link" href="/login">
          Entrar
        </Link>
      </div>
    </div>
  );
}
