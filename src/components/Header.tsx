"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/products";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#stock", label: "Stock" },
  { href: "#servicio", label: "Servicio técnico" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      Boolean
    ) as HTMLElement[];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  const wa = waLink("Hola! Te escribo desde la web de Apple House, quería hacer una consulta.");

  return (
    <>
      <header>
        <div className="container nav">
          <a href="#inicio" className="brand">
            <Image className="brand-logo" src="/logo.png" alt="Apple House" width={40} height={40} />
            <div className="brand-name">
              Apple House <span>Mendoza</span>
            </div>
          </a>
          <nav className="nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href ? "active" : ""}>
                {l.label}
              </a>
            ))}
          </nav>
          <a className="nav-cta" href={wa} target="_blank" rel="noopener">
            <WaIcon />
            WhatsApp
          </a>
          <button className="menu-btn" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <div className={`mobile-panel${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="nav-cta" href={wa} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
          Escribir por WhatsApp
        </a>
      </div>
    </>
  );
}
