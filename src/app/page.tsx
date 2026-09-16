import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Stock from "@/components/Stock";
import Service from "@/components/Service";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import Reviews from "@/components/Reviews";


import { getProductosDb } from "@/lib/products";

export default async function Home() {
  const dbProductos = await getProductosDb();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WhyUs />
        <Reviews />
        <Stock initialProductos={dbProductos} />
        <Service />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
