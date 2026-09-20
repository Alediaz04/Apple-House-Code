
//n Next.js, para navegar entre páginas internas del sitio siempre se usa Link en vez de una etiqueta <a> común.
//  Con <a> el navegador recarga toda la página; con Link, Next.js solo cambia el contenido, es más rápido.(linea 18)


//La clase "eyebrow" con el <span className="dot"> es el mismo patrón que usan en Hero.tsx y 
// About.tsx para esos textitos chicos arriba de los títulos — así queda consistente visualmente con el resto del sitio.(linea 23)


//"btn btn-primary" es la misma clase que usan los botones de WhatsApp y 
// "Ver stock" en Hero.tsx, para que el botón de "Volver al inicio" no desentone.(linea 43)


//No usé useState ni nada de React porque esta página no necesita interactividad:
//  es texto estático + un link. Por eso no lleva "use client" arriba tampoco.


import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "none",
      }}
    >
      {/* Resplandor decorativo de fondo, sutil, detrás del contenido */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 520,
          height: 520,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(47,111,237,0.16) 0%, rgba(47,111,237,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ textAlign: "center", position: "relative" }}>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          <span className="dot"></span> Error 404
        </div>

        {/* Ícono de "página perdida" */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 4,
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-strong)"
            strokeWidth="1.5"
            style={{ opacity: 0.85 }}
          >
            <path d="M9.5 9.5c.5-1.5 2-2.5 3.5-2 1.8.6 2.3 2.8 1 4-.8.7-1.5 1-1.5 2.5" />
            <circle cx="12" cy="17.5" r="0.6" fill="var(--accent-strong)" stroke="none" />
            <rect x="3" y="3" width="18" height="18" rx="4" strokeOpacity="0.35" />
          </svg>
        </div>

        {/* Numeral grande con degradé */}
        <div
          style={{
            fontSize: "clamp(72px, 14vw, 140px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            backgroundImage:
              "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 60%, var(--accent) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 3.4vw, 34px)",
            marginTop: 4,
            marginBottom: 16,
          }}
        >
          Página no encontrada
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: 32,
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          La página que buscás no existe o se movió de lugar. Puede que el link
          esté roto o que la hayamos cambiado de dirección.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
            style={{ justifyContent: "center" }}
          >
            Volver al inicio
          </Link>

          <Link
            href="/#contacto"
            className="btn"
            style={{
              justifyContent: "center",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            Contactar al local
          </Link>
        </div>
      </div>
    </section>
  );
}