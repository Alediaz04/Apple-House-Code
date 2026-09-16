import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/products";

export default function Contact() {
  return (
    <section id="contacto" style={{ borderBottom: "none" }}>
      <div className="container contact-wrap">
        <div>
          <div className="section-head" style={{ marginBottom: 28 }}>
            <h2>Visitanos o escribinos</h2>
          </div>
          <div className="contact-list">
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" />
                <circle cx="12" cy="9" r="2.6" />
              </svg>
              <div><h4>Local</h4><p>9 de Julio 1063, Ciudad, Mendoza</p></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <div><h4>Horario</h4><p>Lunes a viernes de 9hs a 19hs · sábados de 10hs a 19hs</p></div>
            </div>
            <div className="contact-row">
              <WaIcon className="icon" />
              <div>
                <h4>WhatsApp</h4>
                <p>
                  <a className="link" href={waLink("Hola! Te escribo desde la web de Apple House.")} target="_blank" rel="noopener">
                    261 340-7016
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
              </svg>
              <div>
                <h4>Instagram</h4>
                <p><a className="link" href="https://www.instagram.com/applehousepipo" target="_blank" rel="noopener">@applehousepipo</a></p>
              </div>
            </div>
          </div>
        </div>
        <div className="map-frame">
          <iframe
            src="https://www.google.com/maps?q=9+de+Julio+1063,+Ciudad,+Mendoza,+Argentina&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Apple House"
          />
        </div>
      </div>
    </section>
  );
}
