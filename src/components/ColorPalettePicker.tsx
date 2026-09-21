"use client";

import React, { useState, useEffect } from "react";

export interface ColorOption {
  nombre: string;
  hex: string;
  border?: string;
  isLight?: boolean;
}

export const LISTA_COLORES: ColorOption[] = [
  { nombre: "Negro", hex: "#1c1c1e", border: "rgba(255, 255, 255, 0.25)" },
  { nombre: "Blanco", hex: "#ffffff", border: "#cbd5e1", isLight: true },
  { nombre: "Plateado", hex: "#e2e8f0", border: "#94a3b8", isLight: true },
  { nombre: "Gris Espacial", hex: "#4b5563", border: "rgba(255, 255, 255, 0.2)" },
  { nombre: "Grafito", hex: "#374151", border: "rgba(255, 255, 255, 0.2)" },
  { nombre: "Titán Natural", hex: "#9a9388", border: "#78716c" },
  { nombre: "Titán Desierto", hex: "#c5a087", border: "#a8a29e" },
  { nombre: "Titán Negro", hex: "#383739", border: "rgba(255, 255, 255, 0.2)" },
  { nombre: "Titán Blanco", hex: "#e5e5e7", border: "#94a3b8", isLight: true },
  { nombre: "Dorado", hex: "#f59e0b", border: "#d97706" },
  { nombre: "Azul", hex: "#3b82f6", border: "#2563eb" },
  { nombre: "Azul Sierra", hex: "#93c5fd", border: "#60a5fa", isLight: true },
  { nombre: "Azul Profundo", hex: "#1e3a8a", border: "rgba(255, 255, 255, 0.2)" },
  { nombre: "Verde", hex: "#15803d", border: "#166534" },
  { nombre: "Verde Menta", hex: "#a7f3d0", border: "#6ee7b7", isLight: true },
  { nombre: "Rosa", hex: "#ec4899", border: "#db2777" },
  { nombre: "Morado", hex: "#8b5cf6", border: "#7c3aed" },
  { nombre: "Rojo", hex: "#ef4444", border: "#dc2626" },
  { nombre: "Amarillo", hex: "#facc15", border: "#eab308", isLight: true },
  { nombre: "Naranja", hex: "#f97316", border: "#ea580c" },
];

const COLOR_ALIASES: Record<string, string> = {
  // English aliases
  black: "Negro",
  "space black": "Negro",
  white: "Blanco",
  starlight: "Blanco",
  silver: "Plateado",
  "space gray": "Gris Espacial",
  "space grey": "Gris Espacial",
  graphite: "Grafito",
  "natural titanium": "Titán Natural",
  "titan natural": "Titán Natural",
  "desert titanium": "Titán Desierto",
  "titan desierto": "Titán Desierto",
  "black titanium": "Titán Negro",
  "white titanium": "Titán Blanco",
  gold: "Dorado",
  blue: "Azul",
  "sierra blue": "Azul Sierra",
  "deep blue": "Azul Profundo",
  green: "Verde",
  "alpine green": "Verde",
  "mint green": "Verde Menta",
  pink: "Rosa",
  purple: "Morado",
  "deep purple": "Morado",
  red: "Rojo",
  "product red": "Rojo",
  "product(red)": "Rojo",
  yellow: "Amarillo",
  orange: "Naranja",

  // Spanish aliases
  negro: "Negro",
  blanco: "Blanco",
  plateado: "Plateado",
  "gris espacial": "Gris Espacial",
  grafito: "Grafito",
  "titán natural": "Titán Natural",
  "titán desierto": "Titán Desierto",
  "titán negro": "Titán Negro",
  "titán blanco": "Titán Blanco",
  dorado: "Dorado",
  azul: "Azul",
  "azul sierra": "Azul Sierra",
  "azul profundo": "Azul Profundo",
  verde: "Verde",
  "verde menta": "Verde Menta",
  rosa: "Rosa",
  morado: "Morado",
  rojo: "Rojo",
  amarillo: "Amarillo",
  naranja: "Naranja",
};

export function findColorByName(name: string): ColorOption | undefined {
  const clean = name.trim().toLowerCase();
  if (!clean) return undefined;

  // 1. Direct match with LISTA_COLORES
  const direct = LISTA_COLORES.find((c) => c.nombre.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Alias match
  const aliasName = COLOR_ALIASES[clean];
  if (aliasName) {
    return LISTA_COLORES.find((c) => c.nombre.toLowerCase() === aliasName.toLowerCase());
  }

  return undefined;
}

export function parseColorString(colorStr?: string | null) {
  if (!colorStr || colorStr.trim() === "" || colorStr.trim() === "—") return [];

  // Split by comma or slash
  const rawParts = colorStr
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const result: Array<
    | { type: "color"; color: ColorOption; rawText: string }
    | { type: "text"; text: string }
  > = [];

  for (const part of rawParts) {
    const matched = findColorByName(part);
    if (matched) {
      result.push({ type: "color", color: matched, rawText: part });
    } else {
      result.push({ type: "text", text: part });
    }
  }

  return result;
}

interface ColorDisplayProps {
  colorString?: string | null;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export function ColorDisplay({
  colorString,
  showName = false,
  size = "md",
  style,
}: ColorDisplayProps) {
  if (!colorString || colorString.trim() === "" || colorString.trim() === "—") {
    return <span style={{ opacity: 0.5 }}>—</span>;
  }

  const items = parseColorString(colorString);
  if (items.length === 0) return <span style={{ opacity: 0.5 }}>—</span>;

  const circlePx = size === "sm" ? 14 : size === "lg" ? 22 : 18;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap", ...style }}>
      {items.map((item, idx) => {
        if (item.type === "color") {
          const col = item.color;
          const isLight = col.isLight || col.hex.toLowerCase() === "#ffffff";

          return (
            <span
              key={idx}
              title={col.nombre}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: showName ? "rgba(255, 255, 255, 0.08)" : "transparent",
                border: showName ? "1px solid rgba(255, 255, 255, 0.12)" : "none",
                borderRadius: "12px",
                padding: showName ? "2px 8px" : "0",
                fontSize: "0.82rem",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: `${circlePx}px`,
                  height: `${circlePx}px`,
                  borderRadius: "50%",
                  background: col.hex,
                  backgroundColor: col.hex,
                  border: col.border
                    ? `1.5px solid ${col.border}`
                    : isLight
                    ? "1.5px solid #94a3b8"
                    : "1.5px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: isLight
                    ? "0 1px 3px rgba(0, 0, 0, 0.2)"
                    : "0 1px 2px rgba(0, 0, 0, 0.15)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {showName && <span>{col.nombre}</span>}
            </span>
          );
        } else {
          return (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "0.82rem",
                fontWeight: 500,
              }}
            >
              {item.text}
            </span>
          );
        }
      })}
    </div>
  );
}

interface ColorPalettePickerProps {
  initialValue?: string | null;
  name?: string;
  onChange?: (value: string) => void;
  resetSignal?: any;
}

export function ColorPalettePicker({
  initialValue = "",
  name = "color",
  onChange,
  resetSignal,
}: ColorPalettePickerProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customText, setCustomText] = useState<string>("");

  // Parse initial value on mount or change of initialValue
  useEffect(() => {
    if (!initialValue) {
      setSelectedColors([]);
      setCustomText("");
      return;
    }

    const items = parseColorString(initialValue);
    const selected: string[] = [];
    const remaining: string[] = [];

    items.forEach((item) => {
      if (item.type === "color") {
        if (!selected.includes(item.color.nombre)) {
          selected.push(item.color.nombre);
        }
      } else {
        remaining.push(item.text);
      }
    });

    setSelectedColors(selected);
    setCustomText(remaining.join(", "));
  }, [initialValue]);

  // Reset signal support
  useEffect(() => {
    if (resetSignal !== undefined) {
      setSelectedColors([]);
      setCustomText("");
    }
  }, [resetSignal]);

  // Combined string calculation
  const combinedValue = [
    selectedColors.join(", "),
    customText.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  // Notify parent on change
  useEffect(() => {
    if (onChange) {
      onChange(combinedValue);
    }
  }, [combinedValue, onChange]);

  const toggleColor = (nombreColor: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(nombreColor)) {
        return prev.filter((c) => c !== nombreColor);
      } else {
        return [...prev, nombreColor];
      }
    });
  };

  const removeSelectedColor = (nombreColor: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== nombreColor));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Campo oculto para envio nativo en formularios HTML / Server Actions */}
      <input type="hidden" name={name} value={combinedValue} />

      {/* Selector de paleta visual de colores */}
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {LISTA_COLORES.map((color) => {
            const isSelected = selectedColors.includes(color.nombre);
            const isWhiteOrLight = color.isLight || color.hex.toLowerCase() === "#ffffff";

            return (
              <button
                key={color.nombre}
                type="button"
                title={color.nombre}
                onClick={() => toggleColor(color.nombre)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: color.hex,
                  backgroundColor: color.hex,
                  border: isSelected
                    ? "2px solid #3b82f6"
                    : color.border
                    ? `1.5px solid ${color.border}`
                    : "1.5px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: isSelected
                    ? "0 0 0 3px rgba(59, 130, 246, 0.4), 0 2px 5px rgba(0,0,0,0.2)"
                    : isWhiteOrLight
                    ? "0 1px 3px rgba(0, 0, 0, 0.25)"
                    : "0 1px 2px rgba(0, 0, 0, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  transform: isSelected ? "scale(1.12)" : "scale(1)",
                  padding: 0,
                  outline: "none",
                }}
              >
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isWhiteOrLight ? "#0f172a" : "#ffffff"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visualización de colores seleccionados (chips/badges) */}
      {selectedColors.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.7, marginRight: "4px" }}>Seleccionados:</span>
          {selectedColors.map((colName) => {
            const colObj = LISTA_COLORES.find((c) => c.nombre === colName);
            const isLight = colObj?.isLight;
            return (
              <span
                key={colName}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "2px 8px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: colObj?.hex || "#ccc",
                    border: isLight ? "1px solid #94a3b8" : "none",
                  }}
                />
                {colName}
                <button
                  type="button"
                  onClick={() => removeSelectedColor(colName)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    opacity: 0.6,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    padding: "0 2px",
                    lineHeight: 1,
                  }}
                  title="Quitar color"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Campo de texto libre opcional */}
      <div className="input-wrapper">
        <input
          id="color-custom"
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Ej: Negro, Blanco, Green con detalle estético"
          className="form-input"
        />
      </div>
    </div>
  );
}
