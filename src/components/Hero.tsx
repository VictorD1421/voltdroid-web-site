"use client";

import Link from "next/link";
import { ChevronRight, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section 
      id="inicio" 
      className="relative min-h-[90vh] lg:h-screen flex items-center justify-center overflow-hidden bg-white text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white"
    >
      {/* IMAGEN DE FONDO (Desde public/img) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.05] dark:opacity-20 transition-opacity duration-500"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop')" 
        }}
      ></div>

      {/* ELEMENTOS DE DISEÑO DINÁMICO (Blobs de luz) */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[120px] z-10"></div>

      {/* OVERLAY DE DEGRADADO PROFESIONAL */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-black/40 dark:to-black"></div>

      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto mt-10">
        
        {/* BADGE SUPERIOR */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 text-[10px] md:text-xs font-bold tracking-[0.2em] text-blue-600 uppercase bg-blue-50 border border-blue-100 rounded-full dark:text-blue-400 dark:bg-blue-400/5 dark:border-blue-400/20 shadow-sm">
          <Cpu size={14} className="animate-spin-slow" />
          Referente en Electrónica Automotriz
        </div>
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]">
          REVOLUCIÓN <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-500 dark:to-blue-300">
            TECNOLÓGICA
          </span> <br className="hidden sm:block" />
          PARA TU MOTOR
        </h1>

        {/* DESCRIPCIÓN ENFOCADA EN VOLTDROID */}
        <p className="text-base md:text-xl font-medium text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed italic">
          "Más allá de la simple sustitución de piezas". Soluciones duraderas en programación de computadoras, módulos y clústeres automotrices en <span className="text-blue-600 font-bold">Maracay</span>.
        </p>

        {/* ACCIONES */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link 
            href="/tracking"
            className="group relative w-full sm:w-auto overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-5 px-10 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/20"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              Consultar Estatus
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Efecto hover interno */}
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -z-0"></div>
          </Link>

          <a 
            href="#servicios"
            className="w-full sm:w-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-white font-bold py-5 px-10 rounded-2xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            Ver Laboratorio
          </a>
        </div>

        {/* MÉTRICAS RÁPIDAS (Opcional, añade mucha autoridad) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-zinc-100 dark:border-zinc-900 pt-10">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">2015</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500">Fundación</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-blue-600">ALTA</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500">Precisión</span>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">Vnzla</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500">Alcance Nacional</span>
          </div>
        </div>
      </div>

      {/* LÍNEA DECORATIVA ANIMADA */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </section>
  );
}