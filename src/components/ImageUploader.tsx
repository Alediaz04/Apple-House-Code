"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";

interface ImageUploaderProps {
  initialImage?: string | null;
  name?: string;
  onChange?: (base64: string | null) => void;
}

export function ImageUploader({
  initialImage = null,
  name = "imagen",
  onChange,
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function compressAndProcessFile(file: File) {
    setErrorMsg(null);
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionado máx 800px para no sobrecargar la base de datos
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Exportamos en formato WebP liviano al 82% de calidad
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.82);
          setImagePreview(compressedDataUrl);
          setIsRemoved(false);
          if (onChange) onChange(compressedDataUrl);
        }
        setIsCompressing(false);
      };

      img.onerror = () => {
        setErrorMsg("No se pudo procesar la imagen seleccionada.");
        setIsCompressing(false);
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo.");
      setIsCompressing(false);
    };

    reader.readAsDataURL(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      compressAndProcessFile(files[0]);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      compressAndProcessFile(files[0]);
    }
  }

  function handleRemove() {
    setImagePreview(null);
    setIsRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) onChange(null);
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Campos ocultos para enviarlo en el FormData */}
      <input type="hidden" name={name} value={imagePreview || ""} />
      <input type="hidden" name="eliminarImagen" value={isRemoved ? "true" : "false"} />

      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginBottom: "10px",
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {imagePreview ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "140px",
              height: "140px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "#000",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={imagePreview}
              alt="Vista previa del producto"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "rgba(0, 0, 0, 0.75)",
                color: "#4ade80",
                fontSize: "0.7rem",
                fontWeight: "700",
                padding: "2px 6px",
                borderRadius: "4px",
                backdropFilter: "blur(4px)",
              }}
            >
              1 Foto
            </span>
          </div>

          <div style={{ flex: 1, minWidth: "180px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px", color: "var(--text)" }}>
              Foto del producto cargada
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
              Foto optimizada correctamente. Solo se permite 1 foto por producto.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Cambiar foto
              </button>

              <button
                type="button"
                onClick={handleRemove}
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Quitar foto
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? "2px dashed #38bdf8" : "2px dashed var(--border)",
            background: isDragging ? "rgba(56, 189, 248, 0.08)" : "rgba(255, 255, 255, 0.02)",
            borderRadius: "16px",
            padding: "28px 20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
            }}
          >
            {isCompressing ? (
              <span className="spinner" style={{ borderTopColor: "#38bdf8" }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>

          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
            {isCompressing ? "Procesando foto..." : "Haz clic o arrastra la foto del producto aquí"}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
            Solo imágenes (PNG, JPG, WEBP) · Máximo 1 foto por producto
          </p>
        </div>
      )}

      {/* Input de archivo nativo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
