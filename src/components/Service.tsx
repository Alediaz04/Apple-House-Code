import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/products";

const ITEMS = [
  { title: "Cambio de pantalla", sub: "iPhone e iPad" },
  { title: "Cambio de batería", sub: "iPhone y MacBook" },
  { title: "Reparación de placa", sub: "Fallas de carga, audio y cámara" },
  { title: "Service de MacBook", sub: "Diagnóstico y reparación" },
  { title: "Diagnóstico general", sub: "Antes de presupuestar cualquier arreglo" },
];

export default function Service() {
  return (
    <section id="servicio">
      <div className="container">
        <div className="section-head">
          <h2>Service técnico Apple</h2>
          <p>Diagnóstico, reparación y recambio de piezas, hecho en el local.</p>
        </div>
        <div className="service-wrap">
          <div className="service-list">
            {ITEMS.map((it) => (
              <div className="service-item" key={it.title}>
                <h4>{it.title}</h4>
                <span>{it.sub}</span>
              </div>
            ))}
          </div>
          <div className="service-panel">
            <h3>Llevá tu equipo y salí con el diagnóstico</h3>
            <p>
              Contanos qué le pasa al equipo por WhatsApp y coordinamos para que lo traigas al
              local en 9 de Julio 1063. El diagnóstico te dice qué tiene y cuánto sale antes de
              reparar.
            </p>
            <a
              href={waLink("Hola! Quería contarles un problema que tiene mi equipo.")}
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
            >
              <WaIcon />
              Contar el problema por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
