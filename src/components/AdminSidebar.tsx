"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Ver Stock",
    href: "/admin/stock",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    label: "Agregar Equipo",
    href: "/admin/agregar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    label: "Ventas",
    href: "/admin/ventas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Estadísticas",
    href: "/admin/estadisticas",
    badge: "Próximamente",
    disabled: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-dot" />
          <span className="admin-logo-text">Apple House</span>
          <span className="admin-badge">Admin</span>
        </div>
      </div>

      <div className="admin-sidebar-nav">
        <Link href="/" className="admin-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a la web
        </Link>

        <div className="admin-section-label">Navegación</div>

        <nav className="admin-menu">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (item.disabled) {
              return (
                <div key={item.href} className="admin-menu-item disabled">
                  <span className="admin-menu-icon">{item.icon}</span>
                  <span className="admin-menu-label">{item.label}</span>
                  {item.badge && <span className="admin-item-badge">{item.badge}</span>}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-menu-item${isActive ? " active" : ""}`}
              >
                <span className="admin-menu-icon">{item.icon}</span>
                <span className="admin-menu-label">{item.label}</span>
                {item.badge && <span className="admin-item-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">AH</div>
          <div>
            <div className="admin-user-name">Panel de Control</div>
            <div className="admin-user-role">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
