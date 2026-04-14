"use client";

import { HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineMapPin, HiOutlineFingerPrint } from "react-icons/hi2";

export default function About() {
  // Cálculo dinámico de trayectoria
  const yearsExperience = new Date().getFullYear() - 2015;

  return (
    <section id="nosotros" className="relative py-24 lg:py-40 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      
      {/* Decoración de fondo Atmosférica */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* BLOQUE IZQUIERDO: Narrativa e Impacto */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 text-xs font-black uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Nuestra Identidad
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white leading-[1.05] tracking-tighter">
                Ingeniería que <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                  Desafía lo Convencional
                </span>
              </h2>
              
              <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                <p className="text-justify italic border-l-4 border-blue-600 pl-6 py-2 bg-zinc-50 dark:bg-zinc-900/30 rounded-r-2xl">
                  Fundada el <span className="text-zinc-900 dark:text-zinc-100 font-bold">17 de diciembre de 2015</span> por Aaron Dudamel en Maracay, 
                  Voltdroid surgió bajo una premisa clara: la electrónica automotriz no debe ser desechable.
                </p>
                <p>
                  Evolucionamos de un taller especializado a un centro de diagnóstico avanzado. Hoy, somos el punto de referencia en Venezuela para la programación de módulos y recuperación de componentes críticos, eliminando la dependencia de la sustitución genérica de piezas.
                </p>
              </div>
            </div>

            {/* Stats con Diseño Neumórfico Sutil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-transform hover:scale-[1.02]">
                <div className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">{yearsExperience}+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Años de Trayectoria</div>
              </div>
              
              <div className="p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-blue-600 text-white shadow-xl shadow-blue-900/20 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-2">
                   <HiOutlineFingerPrint size={32} className="opacity-50" />
                   <div className="text-4xl font-black tracking-tighter">100%</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Precisión Técnica</div>
              </div>
            </div>
          </div>

          {/* BLOQUE DERECHO: Pilares Estratégicos */}
          <div className="lg:col-span-6 lg:pl-12 space-y-6">
            
            {/* Tarjeta Misión */}
            <div className="relative group overflow-hidden p-10 rounded-[3rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl dark:hover:shadow-blue-500/5">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <HiOutlineRocketLaunch size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 italic uppercase tracking-tighter">Misión</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Democratizar el acceso a la tecnología automotriz de alta gama, proveyendo soluciones de reparación electrónica con estándares globales para el mercado nacional.
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta Visión */}
            <div className="relative group overflow-hidden p-10 rounded-[3rem] bg-zinc-900 dark:bg-zinc-800/20 border border-zinc-800 dark:border-zinc-700 transition-all duration-500 hover:shadow-2xl lg:ml-12">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-blue-500 flex items-center justify-center text-zinc-900 dark:text-white">
                  <HiOutlineLightBulb size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-zinc-100 mb-4 italic uppercase tracking-tighter">Visión</h4>
                  <p className="text-zinc-400 leading-relaxed font-medium">
                    Consolidarnos como el laboratorio de ingeniería electrónica líder en Venezuela, siendo sinónimo de innovación, ética técnica y vanguardia digital.
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta Única Sede Actualizada */}
            <div className="mt-12 p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center gap-6">
               <div className="p-4 rounded-full bg-white dark:bg-zinc-900 text-blue-600 shadow-sm">
                  <HiOutlineMapPin size={24} />
               </div>
               <div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1 text-center sm:text-left">Sede Central Única</h5>
                  <p className="text-zinc-900 dark:text-zinc-100 font-bold text-sm leading-tight">
                    Calle Turmero, Maracay <span className="block font-medium text-zinc-500 text-xs">Entre Av. Victoria y Av. Bermúdez.</span>
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}