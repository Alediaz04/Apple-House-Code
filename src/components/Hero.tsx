import Image from "next/image";
import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/products";

export default function Hero() {
  return (
    <section id="inicio" className="hero" style={{ borderBottom: "1px solid var(--border)", paddingTop: 64 }}>
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">
            <span className="dot"></span> Ciudad de Mendoza · 9 de Julio 1063
          </div>
          <h1>Tu próximo iPhone, con la garantía en regla.</h1>
          <p className="hero-sub">
            Equipos usados revisados y equipos nuevos importados directamente de Estados Unidos.
            Service técnico propio, en el mismo local donde comprás.
          </p>
          <div className="hero-actions">
            <a href="#stock" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a4 4 0 0 1 8 0v2" />
              </svg>
              Ver stock disponible
            </a>
            <a
              href={waLink("Hola! Te escribo desde la web de Apple House, quería consultar disponibilidad.")}
              target="_blank"
              rel="noopener"
              className="btn btn-outline"
            >
              <WaIcon />
              Consultar por WhatsApp
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat"><b>+4.000</b><span>seguidores en Instagram</span></div>
            <div className="stat"><b>30 días</b><span>de garantía en usados</span></div>
            <div className="stat"><b>propio</b><span>service técnico en el local</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <Image className="hero-logo-bg" src="/logo.png" alt="" width={560} height={560} />
          <svg className="device" viewBox="0 0 220 440" fill="none">
            <rect x="6" y="6" width="208" height="428" rx="46" fill="#131519" stroke="#2A2D35" strokeWidth="2" />
            <rect x="20" y="24" width="180" height="392" rx="30" fill="#0B0C0E" stroke="#20232B" />
            <rect x="78" y="34" width="64" height="18" rx="9" fill="#1C1F25" />
            <circle cx="110" cy="380" r="3" fill="#2A2D35" />
            <rect x="34" y="70" width="152" height="86" rx="14" fill="#16181D" stroke="#242732" />
            <rect x="34" y="166" width="72" height="72" rx="14" fill="#16181D" stroke="#242732" />
            <rect x="114" y="166" width="72" height="72" rx="14" fill="#1C1F25" stroke="#242732" />
            <rect x="34" y="248" width="152" height="46" rx="12" fill="#16181D" stroke="#242732" />
            <text x="110" y="112" textAnchor="middle" fontFamily="Space Grotesk" fontSize="15" fill="#FCAF45">Apple House</text>
            <text x="110" y="135" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#5E6169">Ciudad, Mendoza</text>
            <text x="70" y="206" textAnchor="middle" fontFamily="Space Grotesk" fontSize="12" fill="#9A9CA3">Stock</text>
            <text x="150" y="206" textAnchor="middle" fontFamily="Space Grotesk" fontSize="12" fill="#9A9CA3">Service</text>
            <text x="110" y="276" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#5E6169">garantía · 30 días</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
