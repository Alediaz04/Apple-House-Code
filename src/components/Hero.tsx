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
            <div className="stat"><b>PROPIO</b><span>service técnico en el local</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <svg className="device" viewBox="0 0 240 480" fill="none">
            <defs>
              <clipPath id="phoneLogoClip">
                <circle cx="120" cy="112" r="32" />
              </clipPath>
              <linearGradient id="phoneGlow" x1="0" y1="0" x2="240" y2="480" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2F6FED" stopOpacity="0.12" />
                <stop offset="1" stopColor="#FCAF45" stopOpacity="0.06" />
              </linearGradient>
            </defs>

            {/* Phone chassis */}
            <rect x="4" y="4" width="232" height="472" rx="48" fill="#131519" stroke="#2C303B" strokeWidth="2.5" />
            
            {/* Screen */}
            <rect x="14" y="14" width="212" height="452" rx="38" fill="#0B0C0E" stroke="#1A1C22" strokeWidth="1.5" />
            <rect x="14" y="14" width="212" height="452" rx="38" fill="url(#phoneGlow)" />

            {/* Dynamic Island */}
            <rect x="86" y="24" width="68" height="20" rx="10" fill="#14161C" stroke="#22252E" strokeWidth="0.8" />
            <circle cx="140" cy="34" r="3.5" fill="#0B0C0E" />

            {/* Status bar */}
            <text x="36" y="38" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="#9A9CA3">9:41</text>
            <circle cx="198" cy="34" r="2.5" fill="#9A9CA3" />
            <circle cx="204" cy="34" r="2.5" fill="#9A9CA3" />

            {/* Top Brand Card with Circular Logo */}
            <rect x="26" y="60" width="188" height="138" rx="20" fill="#14161D" stroke="#262934" strokeWidth="1" />
            <circle cx="120" cy="112" r="34" fill="#1C1F28" stroke="rgba(255,255,255,0.08)" />
            <image href="/logo.png" x="88" y="80" width="64" height="64" clipPath="url(#phoneLogoClip)" preserveAspectRatio="xMidYMid slice" />
            <text x="120" y="162" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="15" fill="#F3F3F1">Apple House</text>
            <text x="120" y="180" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#9A9CA3">Ciudad, Mendoza</text>

            {/* Feature Widgets */}
            <rect x="26" y="210" width="90" height="86" rx="18" fill="#14161D" stroke="#262934" strokeWidth="1" />
            <text x="71" y="248" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="14" fill="#6AA6FF">Stock</text>
            <text x="71" y="268" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#9A9CA3">Equipos</text>

            <rect x="124" y="210" width="90" height="86" rx="18" fill="#14161D" stroke="#262934" strokeWidth="1" />
            <text x="169" y="248" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="14" fill="#FCAF45">Service</text>
            <text x="169" y="268" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#9A9CA3">Técnico</text>

            {/* Warranty Badge Card */}
            <rect x="26" y="308" width="188" height="56" rx="16" fill="#14161D" stroke="#262934" strokeWidth="1" />
            <text x="120" y="332" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="13" fill="#FCAF45">Garantía 30 días</text>
            <text x="120" y="349" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#9A9CA3">En todos los equipos usados</text>

            {/* Home indicator bar */}
            <rect x="85" y="444" width="70" height="4" rx="2" fill="#3D414D" />
          </svg>
        </div>
      </div>
    </section>
  );
}
