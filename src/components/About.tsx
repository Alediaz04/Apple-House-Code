export default function About() {
  return (
    <section id="quienes-somos">
      <div className="container about-wrap">
        <div className="about-copy">
          <div className="eyebrow"><span className="dot"></span> Quiénes somos</div>
          <h2 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: 20 }}>
            Un local de barrio, con el trabajo de una casa técnica
          </h2>
          <p>Apple House se ubica en 9 de Julio 1063, en la Ciudad de Mendoza. Vendemos iPhone, Mac, iPad y accesorios nuevos y usados, y reparamos en el mismo local.</p>
          <p>Cada equipo usado se revisa antes de salir a la venta: batería, pantalla y funcionamiento general. Por eso damos 30 días de garantía.</p>
          </div>
        <div className="about-figures">
          <div className="figure"><b>+20</b><span>modelos de iPhone en stock</span></div>
          <div className="figure"><b>30 días</b><span>garantía en usados</span></div>
          <div className="figure"><b>+4.000</b><span>seguidores en Instagram</span></div>
          <div className="figure"><b>Reparaciones</b><span>realizadas en el día</span></div>
        </div>
      </div>
    </section>
  );
}
