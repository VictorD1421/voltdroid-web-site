"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const SERVICIOS = [
  {
    title: "Reparación de Computadoras (ECU)",
    description: "Diagnóstico especializado y solución a fallas electrónicas en módulos de cabina, sensores y unidades de control del motor.",
    image: "/img/img1.jpeg",
  },
  {
    title: "Reprogramación y Calibración",
    description: "Actualización de software automotriz avanzado y emparejamiento técnico de módulos para un funcionamiento óptimo.",
    image: "/img/img2.jpeg",
  },
  {
    title: "Reparación de Cluster/Tablero",
    description: "Restauración técnica y solución integral a problemas electrónicos en el clúster de instrumentos y paneles digitales.",
    image: "/img/img4.jpeg",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-zinc-50 dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase text-sm mb-3">
              Tecnología de Primera Línea
            </h2>
            <p className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
              Ingeniería aplicada al <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-500 dark:to-zinc-200">
                sector automotriz
              </span>
            </p>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xs text-sm md:text-base border-l-2 border-blue-600 pl-4 italic">
            "Comprometidos con soluciones duraderas y personal calificado desde 2015 en Maracay."
          </p>
        </div>

        {/* GRID DE SERVICIOS - Centrado para 3 elementos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICIOS.map((servicio, i) => (
            <div 
              key={i} 
              className="group relative bg-white dark:bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
            >
              {/* CONTENEDOR DE IMAGEN */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={servicio.image}
                  alt={servicio.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                   <h3 className="font-black text-2xl text-white leading-tight">
                    {servicio.title}
                  </h3>
                </div>
              </div>

              {/* CONTENIDO TEXTUAL */}
              <div className="p-8">
                <div className="flex justify-end mb-2">
                  <div className="p-2.5 bg-blue-600/10 rounded-full text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-4">
                  {servicio.description}
                </p>
              </div>

              {/* LÍNEA DECORATIVA INFERIOR */}
              <div className="absolute bottom-0 left-0 h-1.5 bg-blue-600 transition-all duration-500 w-0 group-hover:w-full"></div>
            </div>
          ))}
        </div>

        {/* NOTA DE CALIDAD BASADA EN LA VISIÓN */}
        <div className="mt-20 p-8 rounded-2xl bg-white dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
            Líderes en reparación y programación a nivel nacional. Nuestra meta es la satisfacción total mediante estándares rigurosos.
          </p>
        </div>
      </div>
    </section>
  );
}