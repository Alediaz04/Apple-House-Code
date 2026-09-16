import ProductoForm from "./ProductoForm";
import Link from "next/link";

export default function AgregarProductoPage() {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Agregar nuevo equipo</h1>
          <p className="admin-page-subtitle">
            Cargá un producto al inventario. Estará disponible en la web pública y en el panel al instante.
          </p>
        </div>
        <Link href="/admin/stock" className="admin-btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 8l-9-5-9 5 9 5 9-5z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </svg>
          Ver Inventario
        </Link>
      </div>

      <ProductoForm />
    </div>
  );
}