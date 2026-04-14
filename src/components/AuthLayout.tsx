"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowLeft, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthLayout({ children, title, subtitle }: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string 
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* 1. IMAGEN DE FONDO (Corregida) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/img/img7.jpeg" 
          alt="Atmósfera Voltdroid"
          fill
          priority
          // Reduje el blur de 80px a 20px y subí la opacidad para que sea visible
          className="object-cover object-center dark:opacity-20 opacity-10 blur-[20px] scale-105" 
        />
        {/* Filtro de color para dar uniformidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-purple-600/5 dark:from-blue-900/10 dark:to-black/20" />
      </div>

      {/* INTERFAZ FLOTANTE PRINCIPAL */}
      <main className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-white/20 dark:border-zinc-800/50 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] overflow-hidden z-10 relative">
        
        {/* PANEL IZQUIERDO: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden text-white">
          {/* Textura de fondo sutil sobre el azul */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
             <Image src="/img/img7.jpeg" alt="pattern" fill className="object-cover" />
          </div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
               <Image src="/img/logo2.png" alt="Voltdroid" width={180} height={50} className="brightness-200" />
            </Link>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              <Cpu size={14} /> Sistema de Diagnóstico V3.0
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter uppercase">
              Ingeniería <br /> de Precisión
            </h1>
            <p className="text-blue-100 text-sm max-w-xs font-medium leading-relaxed opacity-80">
              Gestione protocolos de hardware y software automotriz con la plataforma más avanzada de Venezuela.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
            <span>© {new Date().getFullYear()} VOLTDROID C.A.</span>
            <div className="w-1 h-1 bg-white rounded-full" />
            <span>Rif J-40713023-1</span>
          </div>
        </div>

        {/* PANEL DERECHO: Formulario */}
        <div className="flex flex-col p-8 lg:p-16 relative bg-white/40 dark:bg-zinc-950/20">
          
          {/* Controles superiores */}
          <div className="flex justify-between items-center mb-12 relative z-20">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Inicio
            </Link>
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-all active:scale-95 shadow-sm">
                {theme === 'dark' ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-600" />}
              </button>
            )}
          </div>

          {/* Header del formulario */}
          <div className="mb-10 text-center lg:text-left relative z-10">
            <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-2">
              {title}
            </h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="relative z-10">
             {children}
          </div>

          {/* Footer Mobile */}
          <div className="mt-auto pt-8 flex lg:hidden justify-center gap-4 text-[10px] font-black uppercase text-zinc-400">
            <span>Términos</span>
            <span>Privacidad</span>
            <span>Soporte</span>
          </div>
        </div>
      </main>
    </div>
  );
}