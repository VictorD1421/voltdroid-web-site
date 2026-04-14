"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaTiktok, FaPhoneFlip } from "react-icons/fa6";
import { HiOutlineMapPin, HiOutlineCpuChip, HiOutlineClock } from "react-icons/hi2";

export default function Footer() {
  // Variables de entorno de contacto
  const phoneMain = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+58 412-8927101";
  const phoneMainLink = process.env.NEXT_PUBLIC_PHONE_LINK || "584128927101";
  
  const phoneSec = process.env.NEXT_PUBLIC_PHONE_SEC_DISPLAY || "+58 414-4761227";
  const phoneSecLink = process.env.NEXT_PUBLIC_PHONE_SEC_LINK || "584144761227";

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "#";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || "#";

  return (
    <footer className="relative bg-zinc-50 dark:bg-[#050505] pt-24 pb-12 transition-colors duration-500 border-t border-zinc-200 dark:border-zinc-900 overflow-hidden">
      {/* Decoración radial de fondo para profundidad */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
      <div className="absolute -top-24 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* SECCIÓN 1: IDENTIDAD MODERNA */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-72 h-24 bg-white dark:bg-black rounded-2xl p-4 flex items-center shadow-sm">
                <Image
                  src="/img/logo1.png"
                  alt="Voltdroid Logo"
                  fill
                  priority
                  className="object-contain p-2 dark:hidden"
                />
                <Image
                  src="/img/logo2.png"
                  alt="Voltdroid Logo"
                  fill
                  priority
                  className="object-contain p-2 hidden dark:block"
                />
              </div>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
              Ingeniería automotriz de alta precisión. Desde <span className="text-blue-600 dark:text-blue-400 font-bold">2015</span> transformando la reparación electrónica en Maracay con tecnología de vanguardia.
            </p>

            <div className="flex gap-5">
              {[
                { icon: <FaInstagram size={20} />, href: instagramUrl, color: "hover:text-pink-500" },
                { icon: <FaTiktok size={20} />, href: tiktokUrl, color: "hover:text-white dark:hover:text-zinc-200" },
                { icon: <FaWhatsapp size={20} />, href: whatsappUrl, color: "hover:text-green-500" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all duration-300 hover:scale-110 hover:shadow-xl dark:hover:shadow-blue-500/10 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: INTERACTIVA - CONTACTO Y UBICACIÓN */}
          <div className="lg:col-span-5 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Central de Llamadas</h3>
              
              {/* Card Teléfono 1 */}
              <a 
                href={`tel:${phoneMainLink}`} 
                className="group p-5 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-110">
                    <FaPhoneFlip size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">Línea Principal</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{phoneMain}</span>
                  </div>
                </div>
              </a>

              {/* Card Teléfono 2 */}
              <a 
                href={`tel:${phoneSecLink}`} 
                className="group p-5 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-blue-500 transition-transform group-hover:scale-110">
                    <FaPhoneFlip size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">Línea Secundaria</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{phoneSec}</span>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-dashed border-zinc-300 dark:border-zinc-800">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold text-sm">
                  <HiOutlineMapPin className="text-blue-600" /> Maracay, Edo. Aragua
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">Calle Turmero entre Av. Victoria y Av. Bermúdez.</p>
              </div>
              <div className="flex-1 space-y-4 border-l border-zinc-300 dark:border-zinc-800 pl-6">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold text-sm">
                  <HiOutlineClock className="text-blue-600" /> Horario Central
                </div>
                <p className="text-xs text-zinc-500">Lun — Vie: 8:00 AM a 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: NAVEGACIÓN RÁPIDA */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8">Navegación</h3>
            <ul className="space-y-6">
              <li>
                <a href="#inicio" className="group flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                  Inicio
                  <span className="h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-12"></span>
                </a>
              </li>
              <li>
                <Link href="/tracking" className="group flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors">
                  <span className="flex items-center gap-2">
                    <HiOutlineCpuChip className="text-zinc-400 group-hover:text-blue-600 transition-colors" size={18} /> 
                    Estatus de Reparación
                  </span>
                  <span className="h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-12"></span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BARRA DE CIERRE: CRÉDITOS */}
        <div className="pt-10 border-t border-zinc-200 dark:border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-[10px] font-black tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
              © {new Date().getFullYear()} Voltdroid C.A. • RIF J-40713023-1
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Desarrollado por</span>
              <span className="px-3 py-1 rounded-full bg-blue-600/5 border border-blue-600/20 text-[10px] font-bold text-blue-600 dark:text-blue-500">
                Gabriela Rodríguez
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}