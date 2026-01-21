"use client";

import { useState } from "react";

export default function ImportExportPage() {
  const [type, setType] = useState<"phase1" | "exploration">("phase1");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState({ ign: "", value: "", date: "" });
  const [needsMapping, setNeedsMapping] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const upload = async () => {
    if (!file) {
      setMessage("Selecciona un archivo para importar.");
      return;
    }

    if (needsMapping && (!mapping.ign || !mapping.value || !mapping.date)) {
      setMessage("Selecciona todas las columnas antes de subir.");
      return;
    }

    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);

    if (needsMapping) {
      form.append("mapping", JSON.stringify(mapping));
    }

    const response = await fetch("/api/import", {
      method: "POST",
      body: form,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "Fallo la importacion.");
      return;
    }

    if (payload.needsMapping) {
      setNeedsMapping(true);
      setHeaders(payload.headers || []);
      setMapping({ ign: "", value: "", date: "" });
      setMessage("Asigna columnas para continuar.");
      return;
    }

    setNeedsMapping(false);
    setHeaders([]);
    setMessage(
      payload.errors?.length ? payload.errors.join(" | ") : "Importacion completa."
    );
  };

  const handleExport = (exportType: string) => {
    const url = new URL("/api/import/export", window.location.origin);
    url.searchParams.set("type", exportType);
    if (exportType === "phase1") {
      const periodId = prompt("Ingresa el ID del periodo a exportar");
      if (!periodId) {
        return;
      }
      url.searchParams.set("periodId", periodId);
    }
    window.location.href = url.toString();
  };

  const uploadScreenshot = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    form.append("type", "ocr");
    const response = await fetch("/api/import", { method: "POST", body: form });
    const payload = await response.json().catch(() => ({}));
    setMessage(payload.message || "OCR proximamente.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Importar / Exportar</h1>
        <p className="text-base-content/70">
          Sube CSV/XLSX desde Google Sheets. Exporta datos cuando quieras.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="card-title">Importar</h2>
            <div className="flex flex-col gap-3">
              <select
                className="select select-bordered"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "phase1" | "exploration")
                }
              >
                <option value="phase1">Puntajes PHASE1</option>
                <option value="exploration">Espadas de exploracion</option>
              </select>
              <input
                type="file"
                className="file-input file-input-bordered"
                accept=".csv,.xlsx"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              {needsMapping ? (
                <div className="space-y-2">
                  <div className="text-sm text-base-content/70">
                    Asigna las columnas de tu hoja.
                  </div>
                  <div className="grid gap-2">
                    <select
                      className="select select-bordered select-sm"
                      value={mapping.ign}
                      onChange={(event) =>
                        setMapping((prev) => ({ ...prev, ign: event.target.value }))
                      }
                    >
                      <option value="">Selecciona columna IGN</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-bordered select-sm"
                      value={mapping.value}
                      onChange={(event) =>
                        setMapping((prev) => ({ ...prev, value: event.target.value }))
                      }
                    >
                      <option value="">Selecciona columna de valor</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-bordered select-sm"
                      value={mapping.date}
                      onChange={(event) =>
                        setMapping((prev) => ({ ...prev, date: event.target.value }))
                      }
                    >
                      <option value="">Selecciona columna de fecha</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
              <button className="btn btn-primary" onClick={upload}>
                Subir archivo
              </button>
              {message ? <div className="alert alert-info">{message}</div> : null}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="card-title">Exportar</h2>
            <div className="flex flex-col gap-3">
              <button className="btn btn-outline" onClick={() => handleExport("phase1")}>
                Exportar PHASE1 (por ID de periodo)
              </button>
              <button className="btn btn-outline" onClick={() => handleExport("exploration")}>
                Exportar exploracion
              </button>
              <button className="btn btn-outline" onClick={() => handleExport("warnings")}>
                Exportar advertencias
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          <h2 className="card-title">OCR de captura (proximamente)</h2>
          <form className="flex flex-col gap-3" onSubmit={uploadScreenshot}>
            <input
              type="file"
              name="file"
              className="file-input file-input-bordered"
              accept="image/*"
              required
            />
            <button className="btn btn-outline" type="submit">
              Subir captura
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
