import ReviewsCarousel, { Review } from "./ReviewsCarousel";

export default function Reviews() {
    const realReviews: Review[] = [
        {
            author_name: "Brandon Labra Espinosa",
            rating: 5,
            text: "Excelente experiencia con Apple House de Pipo Sein. Estuve recorriendo varios locales en Mendoza buscando unos AirPods Pro 3 originales y, después de pasar por cuatro o cinco lugares, terminé comprándolos acá. Hay copias de los AirPods que están demasiado bien hechas... Con Pipo pude revisar todo tranquilo y finalmente encontré los originales que estaba buscando. Muy buena atención, cordialidad y, sobre todo, mucha seguridad al momento de comprar. También tiene muy buenos precios... Muy conforme con la compra y totalmente recomendable.",
            profile_photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=BL&backgroundColor=18181b"
        },
        {
            author_name: "Pablo Esquivel",
            rating: 5,
            text: "El nivel de atención es excelente, su predisposición para buscarte una solución y la variedad de productos espectacular. Recomendado 100%.",
            profile_photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=PE&backgroundColor=18181b"
        },
        {
            author_name: "Ramiro Vega",
            rating: 5,
            text: "Pipo un genio, compramos con unos amigos accesorios para el celu y tuvimos excelente accesoria por parte de él. Súper recomiendo",
            profile_photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=RV&backgroundColor=18181b"
        },
        {
            author_name: "Matias Rojas",
            rating: 5,
            text: " 10/10, excelente servicio, el tipo que atiende es un capo y muy atento, los precios son geniales, muy recomendado",
            profile_photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=MR&backgroundColor=18181b"
        },
        {
            author_name: "Yeremik Alejandro Conejeros",
            rating: 5,
            text: "Un tipazo, tuve que obligarlo a que me cobre, y de pasada le compré unas fundas re lindas que tenía, 10/10 si le pasa algo nuevo a mi celu voy de una sin duda",
            profile_photo_url: "https://api.dicebear.com/7.x/initials/svg?seed=YA&backgroundColor=18181b"
        }
    ];

    return (
        <section className="py-16 bg-zinc-900">
            <div className="container mx-auto px-4 text-center">
                {/* Usamos el dato de tu primera captura para dar más contexto */}
                <div className="flex justify-center items-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-white">5.0</span>
                    <div className="flex flex-col items-start">
                        <div className="flex gap-1 text-yellow-400">
                            {/* 5 Estrellas estáticas para el resumen */}
                            ★★★★★
                        </div>
                        <span className="text-sm text-gray-400">Basado en 83 opiniones</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Lo que dicen nuestros clientes</h2>
                <p className="text-gray-400 mb-8">Experiencias reales de quienes confían en nosotros</p>

                <ReviewsCarousel reviews={realReviews} />
            </div>
        </section>
    );
}