export default function VentasPage() {
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ marginBottom: 6 }}>Ventas</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Registro e historial de ventas de equipos realizados en Apple House.
      </p>

      <div
        style={{
          padding: 48,
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: 16,
          border: "1px stroke rgba(255, 255, 255, 0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💰</div>
        <h3 style={{ marginBottom: 8 }}>Módulo de Ventas</h3>
        <p style={{ color: "var(--text-muted)", maxWidth: 460, margin: "0 auto" }}>
          Próximamente podrás registrar ventas, registrar el cliente y descontar stock automáticamente.
        </p>
      </div>
    </div>
  );
}
