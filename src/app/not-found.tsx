
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
    <section style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          <span className="dot"></span> Error 404
        </div>

        <h1
          style={{
            fontSize: "clamp(28px,4vw,40px)",
            marginTop: 12,
            marginBottom: 16,
          }}
        >
          Página no encontrada
        </h1>

        <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
          La página que buscás no existe o se movió de lugar.
        </p>

        <Link
          href="/"
          className="btn btn-primary"
          style={{ justifyContent: "center" }}
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}