"use client";

import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineMapPin, HiOutlineClock, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

export default function Contact() {
  // Env variables
  const whatsappPrimary = process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY; // 414 según tu petición de intercambio
  const whatsappSecondary = process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY; // 412
  const phoneDisplayPrimary = process.env.NEXT_PUBLIC_PHONE_SEC_DISPLAY;
  const phoneDisplaySecondary = process.env.NEXT_PUBLIC_PHONE_DISPLAY;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL;
  const mapsUrl = process.env.NEXT_PUBLIC_MAPS_URL;

  return (
    <section id="contacto" className="relative py-20 bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs mb-3">
            Canales de atención
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
            ¿Necesitas <span className="text-blue-600">Asistencia?</span>
          </h3>
        </div>

        {/* Main Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          
          {/* WhatsApp Principal (414) */}
          <a 
            href={whatsappPrimary} 
            target="_blank" 
            className="md:col-span-2 group relative p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[220px]"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                  <FaWhatsapp size={32} className="text-green-500" />
                </div>
                <HiOutlineArrowTopRightOnSquare className="text-zinc-300 dark:text-zinc-600 group-hover:text-green-500 transition-colors" size={24} />
              </div>
              <div className="mt-6">
                <h4 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">WhatsApp Principal</h4>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold">{phoneDisplayPrimary}</p>
              </div>
            </div>
            <p className="relative z-10 text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-500 mt-4">Respuesta inmediata</p>
            <FaWhatsapp size={180} className="absolute -right-10 -bottom-10 text-zinc-200 dark:text-zinc-800/20 group-hover:text-green-500/5 transition-colors duration-700" />
          </a>

          {/* Redes Sociales Stack */}
          <div className="flex flex-col gap-4">
            <a 
              href={instagram} 
              target="_blank" 
              className="group flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-pink-500 transition-all"
            >
              <div className="flex items-center gap-4">
                <FaInstagram size={28} className="text-pink-500" />
                <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Instagram</span>
              </div>
              <HiOutlineArrowTopRightOnSquare size={20} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-all" />
            </a>

            <a 
              href={tiktok} 
              target="_blank" 
              className="group flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-all"
            >
              <div className="flex items-center gap-4">
                <FaTiktok size={28} className="text-zinc-900 dark:text-white" />
                <span className="font-bold text-zinc-900 dark:text-white tracking-tight">TikTok</span>
              </div>
              <HiOutlineArrowTopRightOnSquare size={20} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-all" />
            </a>

            <a 
              href={whatsappSecondary} 
              target="_blank" 
              className="group flex flex-col p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all"
            >
              <div className="flex items-center gap-3 mb-1">
                <FaWhatsapp size={20} className="text-blue-500" />
                <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">Línea Secundaria</span>
              </div>
              <span className="text-xs text-zinc-500 font-bold">{phoneDisplaySecondary}</span>
            </a>
          </div>
        </div>

        {/* Footer Info Bar (Ubicación Compacta) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/40 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <HiOutlineClock size={20} />
            </div>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Lun - Vie: 8:00 AM - 5:00 PM
            </p>
          </div>

          <a 
            href={mapsUrl} 
            target="_blank" 
            className="flex items-center justify-between p-5 bg-zinc-900 dark:bg-zinc-800/50 rounded-[1.5rem] border border-zinc-800 group hover:bg-blue-600 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg text-white group-hover:bg-white group-hover:text-blue-600 transition-colors">
                <HiOutlineMapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 group-hover:text-white/80 uppercase tracking-[0.2em]">Sede Maracay</p>
                <p className="text-xs font-bold text-white tracking-tight">Calle Turmero, Edo. Aragua</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-all">Ver mapa</span>
          </a>
        </div>
      </div>
    </section>
  );
}