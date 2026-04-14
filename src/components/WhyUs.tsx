"use client";

import { Cpu, ShieldCheck, Banknote, MapPin, Zap } from "lucide-react";

const BENEFICIOS = [
  {
    title: "Equipos de Vanguardia",
    description: "Operamos con osciloscopios y programadores de última gama para diagnósticos exactos y precisos.",
    icon: <Cpu className="w-7 h-7" />,
  },
  {
    title: "Soporte Especializado",
    description: "Personal altamente calificado enfocado en brindar soluciones técnicas de alta gama.",
    icon: <Zap className="w-7 h-7" />,
  },
  {
    title: "Ahorro Inteligente",
    description: "Optimizamos tu presupuesto reparando módulos electrónicos críticos en lugar de sustituirlos por piezas nuevas.",
    icon: <Banknote className="w-7 h-7" />,
  },
  {
    title: "Garantía de Ingeniería",
    description: "Cada proceso es ejecutado bajo los estándares más rigurosos de la industria automotriz.",
    icon: <ShieldCheck className="w-7 h-7" />,
  }
];

export default function WhyUs() {
  return (
    <section className="relative py-32 bg-zinc-50 dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent dark:from-blue-500/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200 dark:border-blue-800">
            <Zap size={14} fill="currentColor" />
            Excelencia Técnica
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">
            ¿Por qué confiar en <span className="text-blue-600">Voltdroid</span>?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            Fundada en 2015 para llenar el vacío de soluciones de alta precisión. No solo reparamos circuitos; aseguramos la confiabilidad de tu motor mediante ingeniería avanzada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {BENEFICIOS.map((item, index) => (
            <div 
              key={index} 
              className="group relative p-8 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
            >
              <div className="relative w-16 h-16 mb-8 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                {item.icon}
                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h4 className="text-xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                {item.title}
              </h4>
              
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                {item.description}
              </p>

              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-blue-600" />
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Calle Turmero entre Avenida Victoria y Avenida Bermúdez, Maracay
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}