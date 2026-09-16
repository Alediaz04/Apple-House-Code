"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Stock",
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
    label: "Ventas equipos",
    href: "/admin/ventas-equipos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    label: "Ventas accesorios",
    href: "/admin/ventas-accesorios",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Reparaciones",
    href: "/admin/reparaciones",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <aside className={`admin-sidebar${open ? " is-open" : ""}`}>
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-dot" />
          <span className="admin-logo-text">Apple House</span>
          <span className="admin-badge">Admin</span>
          <button
            className="admin-menu-btn"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="admin-sidebar-nav">
        <Link href="/" className="admin-back-link" onClick={() => setOpen(false)}>
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
                onClick={() => setOpen(false)}
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