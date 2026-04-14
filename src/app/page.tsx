import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    /* bg-white dark:bg-black: Controla el fondo de toda la pantalla.
       transition-colors: Asegura que el cambio de tema sea suave.
    */
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-black transition-colors duration-300">
      
      {/* Navegación fija con soporte de blur y modo oscuro */}
      <Navbar />
      
      <main className="flex-grow">
        {/* Sección Principal (Imagen/Texto de entrada) */}
        <Hero />
        
        {/* Sección Histórica, Misión y Visión (Componente Separado) */}
        <About />
        
        {/* Cuadrícula de servicios (ECUs, Llaves, etc.) */}
        <Services />

       

        {/* Sección de propuesta de valor (Por qué elegirnos) */}
        <WhyUs />

         <Contact />
      </main>
      
      {/* Footer con links y contacto en Maracay */}
      <Footer />

    </div>
  );
}