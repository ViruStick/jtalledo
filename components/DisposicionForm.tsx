"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SelectOption {
  label: string;
  fill: Record<string, string>;
}

interface Template {
  id: string;
  name: string;
  path: string;
  markers: string[];
  markerOptions?: Record<string, SelectOption[]>;
}

interface DisposicionFormProps {
  templateSubdir: string;
  title?: string;
}

export default function DisposicionForm({
  templateSubdir,
  title,
}: DisposicionFormProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const readOnlyMarkers = useMemo(() => {
    const set = new Set<string>();
    if (!template?.markerOptions) return set;
    for (const options of Object.values(template.markerOptions)) {
      for (const opt of options) {
        for (const key of Object.keys(opt.fill)) {
          if (
            key !==
            Object.keys(template.markerOptions).find(
              (k) => template.markerOptions![k] === options,
            )
          ) {
            set.add(key);
          }
        }
      }
    }
    return set;
  }, [template]);

  useEffect(() => {
    setFetching(true);
    setError(null);
    setFormData({});
    fetch(`/api/templates?path=${encodeURIComponent(templateSubdir)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.templates && data.templates.length > 0) {
          const t = data.templates[0];
          setTemplate(t);
          const initial: Record<string, string> = {};
          t.markers.forEach((m: string) => {
            initial[m] = "";
          });
          setFormData(initial);
        } else {
          setError("No se encontró ninguna plantilla en esta categoría");
        }
      })
      .catch(() => setError("Error al cargar la plantilla"))
      .finally(() => setFetching(false));
  }, [templateSubdir]);

  const handleChange = (marker: string, value: string) => {
    setFormData((prev) => ({ ...prev, [marker]: value }));
  };

  const handleSelect = (
    marker: string,
    options: SelectOption[],
    value: string,
  ) => {
    const option = options.find((o) => o.label === value);
    if (option) {
      setFormData((prev) => ({ ...prev, ...option.fill }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templatePath: template!.path,
          formData,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al generar documento");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template!.name}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error al generar el documento",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <LuLoaderCircle className="animate-spin text-3xl text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-lg">No hay plantillas disponibles</p>
      </div>
    );
  }

  const options = template.markerOptions;
  const selectMarkers = options
    ? new Set(Object.keys(options))
    : new Set<string>();

  return (
    <div className="h-[calc(100vh-10rem)] 2xl:h-[calc(100vh-12rem)] flex flex-col">
      <h3 className="text-xl 2xl:text-2xl font-semibold mb-4">
        {title || template.name}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 rounded-4xl space-y-1 overflow-y-auto">
        {template.markers.map((marker, index) => (
          <div key={marker} className="flex flex-col gap-2">
            <Label className="font-semibold px-2">
              {index + 1}. {marker.replace(/_/g, " ")}
            </Label>
            {selectMarkers.has(marker) ? (
              <Select
                value={formData[marker] || ""}
                onValueChange={(value) =>
                  handleSelect(marker, options![marker], value ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un artículo" />
                </SelectTrigger>
                <SelectContent>
                  {options![marker].map((opt) => (
                    <SelectItem key={opt.label} value={opt.label}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : readOnlyMarkers.has(marker) ? (
              <Textarea
                readOnly
                value={formData[marker] || ""}
                rows={4}
                className="resize-none cursor-default bg-gray-50"
              />
            ) : (
              <Input
                type="text"
                value={formData[marker] || ""}
                onChange={(e) => handleChange(marker, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-white cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-1">
              <LuLoaderCircle className="animate-spin" />
              <p>Generando...</p>
            </div>
          ) : (
            "Generar y descargar"
          )}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
