const REASONS = [
  {
    icon: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />,
    title: "Garantía de 30 días",
    text: "Todos los equipos usados salen con garantía escrita desde el día de la compra.",
  },
  {
    icon: <path d="M3 12h4l2-7 4 14 2-7h6" />,
    title: "Batería medida",
    text: "Cada iPhone usado se publica con el porcentaje real de salud de batería.",
  },
  {
    icon: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6V4h8v2" />
      </>
    ),
    title: "Importados de EE. UU.",
    text: "Los equipos nuevos llegan importados directamente, sin intermediarios.",
  },
  {
    icon: <path d="M14 3l6 6-9 9-6 1 1-6 8-10z" />,
    title: "Service en el local",
    text: "Reparación propia de pantallas, baterías y placas, sin tercerizar.",
  },
];

export default function WhyUs() {
  return (
    <section style={{ paddingTop: 64 }}>
      <div className="container">

        <div
          className="section-head"
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          <h2 style={{ maxWidth: '100%' }}>Por qué comprar acá</h2>
          <p style={{ maxWidth: '100%' }}>Lo que un cliente necesita saber antes de pagar por un equipo usado.</p>
        </div>

        <div className="reasons">
          {REASONS.map((r) => (
            <div
              className="reason"
              key={r.title}
              // Agregamos estos estilos para centrar todo y darle aire a los costados
              style={{
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {r.icon}
              </svg>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}