"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Package, 
  ArrowLeft, Sun, Moon, Zap, User, Book
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role, email")
        .eq("id", session.user.id)
        .single();

      const role = userData?.role?.toLowerCase();
      const superUserRoles = ["superuser", "superusuario"];
      const allowedRoles = ["admin", ...superUserRoles];

      // Verificación de acceso base al panel admin
      if (!allowedRoles.includes(role)) {
        router.push("/");
        return;
      }

      // RESTRICCIÓN DE AUDITORÍA: Solo superusuarios
      const isSuper = superUserRoles.includes(role);
      if (pathname.includes("/admin/auditoria") && !isSuper) {
        router.push("/admin");
        return;
      }

      setIsSuperUser(isSuper);
      setUserEmail(userData?.email || null);
      setAuthorized(true);
    };

    checkAdmin();
  }, [router, pathname]);

  if (!mounted || !authorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-[#050505] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-blue-600/20 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-t-2 border-blue-600 rounded-full animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={20} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Verificando Credenciales</p>
      </div>
    );
  }

  // Definición de ítems con propiedad de visibilidad
  const menuItems = [
    { href: "/admin", icon: <LayoutDashboard size={22} />, label: "Dashboard", visible: true },
    { href: "/admin/usuarios", icon: <Users size={22} />, label: "Usuarios", visible: true },
    { href: "/admin/equipos", icon: <Package size={22} />, label: "Pedidos", visible: true },
    { href: "/admin/auditoria", icon: <Book size={22} />, label: "Auditoría", visible: isSuperUser },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-32">
      
      {/* --- TOP BAR --- */}
      <header className="fixed top-0 w-full z-40 bg-white/50 dark:bg-[#030303]/50 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="relative w-60 h-18">
              <Image 
                src={theme === "dark" ? "/img/logo2.png" : "/img/logo1.png"} 
                alt="Voltdroid" fill className="object-contain object-left" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 hidden sm:inline">{userEmail}</span>
             <User size={14} className="opacity-60" />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-6 pt-28">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* --- COMMAND DOCK (BOTTOM NAV) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <nav className="flex items-center gap-2 p-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-zinc-700/30 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-black/5">
          
          {menuItems.filter(item => item.visible).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-[2rem] transition-all duration-300 group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 -translate-y-2" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-500"
                }`}
              >
                {item.icon}
                <span className={`absolute -top-10 px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest whitespace-nowrap`}>
                  {item.label}
                </span>
                {isActive && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                )}
              </Link>
            );
          })}

          <div className="w-[1px] h-8 bg-zinc-300 dark:bg-zinc-700 mx-2" />

          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-[2rem] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group"
          >
            {theme === "dark" ? (
              <Sun size={22} className="group-hover:text-amber-500 group-hover:rotate-45 transition-all duration-500" />
            ) : (
              <Moon size={22} className="group-hover:text-blue-600 group-hover:-rotate-12 transition-all duration-500" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}