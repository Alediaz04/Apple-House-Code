import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/products";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-row">
            <div className="brand-name">
              Apple House <span style={{ color: "var(--text-muted)" }}>— Ciudad, Mendoza</span>
            </div>
            <div className="social-row">
              <a href="https://www.instagram.com/applehousepipo" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100082817362869" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V12H8v3h2.5v6H14v-6h2.6l.4-3h-3v-2.2c0-.6.4-.8.9-.8z" />
                </svg>
              </a>
              <a href={waLink("Hola! Te escribo desde la web de Apple House.")} target="_blank" rel="noopener" aria-label="WhatsApp">
                <WaIcon />
              </a>
            </div>
          </div>
          
        </div>
      </footer>

      <a
        className="wa-float"
        href={waLink("Hola! Te escribo desde la web de Apple House, quería hacer una consulta.")}
        target="_blank"
        rel="noopener"
        aria-label="Escribir por WhatsApp"
      >
        <WaIcon />
      </a>
    </>
  );
}
