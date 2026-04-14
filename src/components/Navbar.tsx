"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Sun, Moon, Menu, X, ArrowUpRight, LogIn, UserPlus, 
  User, LogOut, ChevronDown, ShieldCheck, Mail, Phone, 
  LayoutDashboard, Save, Edit2, MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Estados de Usuario
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados de Formulario
  const [formData, setFormData] = useState({
    phone: "",
    whatsapp: ""
  });

  // Función para obtener datos extendidos desde la tabla public.users
  const fetchUserData = async (authUser: any) => {
    if (!authUser) return;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;

      if (data) {
        // Guardamos el objeto auth fusionado con los datos de la tabla pública
        setUser({ ...authUser, db: data });
        setFormData({
          phone: data.phone || "",
          whatsapp: data.whatsapp || ""
        });
      }
    } catch (err) {
      console.error("Error cargando perfil extendido:", err);
      // Fallback: si falla la tabla pública, usamos lo que hay en auth
      setUser(authUser);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Obtener sesión inicial y cargar datos de DB
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setUser(null);
      }
    });

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (window.innerWidth < 1024) {
        setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 100);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      subscription.unsubscribe();
    };
  }, [lastScrollY]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const handleUpdateContact = async () => {
    try {
      // 1. Actualizar en la tabla public.users (La base de datos persistente)
      const { error: dbError } = await supabase
        .from("users")
        .update({
          phone: formData.phone,
          whatsapp: formData.whatsapp
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 2. Actualizar metadatos de auth para sincronía
      const { data, error: authError } = await supabase.auth.updateUser({
        data: { 
          phone: formData.phone,
          whatsapp: formData.whatsapp 
        }
      });

      if (authError) throw authError;

      // Actualizar estado local reflejando los cambios
      setUser({ ...data.user, db: { ...user.db, ...formData } });
      setIsEditing(false);
      alert("Información actualizada correctamente");
    } catch (error: any) {
      alert("Error al actualizar: " + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  if (!mounted) return <header className="h-24" />;

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Ventajas", href: "#whyus" },
    { name: "Servicios", href: "#servicios" },
    { name: "Contacto", href: "#contacto" },
    { name: "Estatus", href: "/tracking", special: true },
  ];

  // Priorizar el rol que viene de la base de datos (user.db.role)
  const currentRole = user?.db?.role || user?.user_metadata?.role || "Cliente";
  const isAdmin = currentRole === "admin" || currentRole === "superuser" || currentRole === "engineer";

  return (
    <>
      <header 
        className={`fixed top-0 z-[100] w-full transition-all duration-500 transform ${
          isVisible ? "translate-y-0" : "-translate-y-full lg:translate-y-0"
        } ${
          scrolled 
            ? "py-3 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm" 
            : "py-6 bg-transparent"
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          
          <div className="flex-shrink-0 relative w-[140px] xs:w-[160px] md:w-[180px] h-[50px] md:h-[70px] transition-transform hover:scale-105">
            <Link href="/">
              <Image 
                src={theme === "dark" ? "/img/logo2.png" : "/img/logo1.png"} 
                alt="Logo Voltdroid" fill className="object-contain" priority
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-2xl">
            <ul className="flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={`px-4 py-2 text-sm font-bold transition-all rounded-xl ${link.special ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"}`}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-blue-500 leading-none mb-1">
                      {currentRole}
                    </p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate max-w-[110px]">
                      {user.db?.full_name || user.user_metadata?.full_name || 'Usuario'}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => { setIsProfileOpen(false); setIsEditing(false); }} />
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 z-20 animate-in fade-in slide-in-from-top-4">
                      <div className="flex flex-col gap-3">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Datos de Contacto</span>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-blue-500 hover:text-blue-600">
                              {isEditing ? <X size={14}/> : <Edit2 size={14}/>}
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                              <Mail size={14} className="flex-shrink-0" />
                              <span className="text-xs font-bold truncate">{user.email}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                <Phone size={14} />
                                {isEditing ? (
                                  <input 
                                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-xs w-full outline-none focus:border-blue-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="Teléfono"
                                  />
                                ) : (
                                  <span className="text-xs font-bold">{user.db?.phone || user.user_metadata?.phone || "No asignado"}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-emerald-500">
                                <MessageSquare size={14} />
                                {isEditing ? (
                                  <input 
                                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-xs w-full outline-none focus:border-blue-500 text-zinc-800 dark:text-zinc-100"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                    placeholder="WhatsApp"
                                  />
                                ) : (
                                  <span className="text-xs font-bold">{user.db?.whatsapp || user.user_metadata?.whatsapp || "No asignado"}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {isEditing && (
                            <button 
                              onClick={handleUpdateContact}
                              className="w-full mt-2 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Save size={14} /> Guardar Cambios
                            </button>
                          )}
                        </div>
                        
                        {isAdmin && (
                          <Link 
                            href="/admin"
                            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs"
                          >
                            <LayoutDashboard size={16} /> Panel Administrativo
                          </Link>
                        )}
                        
                        <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all group">
                          <span className="text-xs font-black uppercase">Cerrar Sesión</span>
                          <LogOut size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-blue-400">Iniciar Sesión</Link>
                <Link href="/register" className="px-6 py-2.5 text-sm font-black bg-blue-600 text-white rounded-xl shadow-lg">Registrarse</Link>
              </>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* PANEL MENÚ MÓVIL */}
      <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-[#0F0F0F] shadow-2xl transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-32 h-10">
                <Image src={theme === "dark" ? "/img/logo2.png" : "/img/logo1.png"} alt="Logo" fill className="object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900"><X size={24}/></button>
            </div>

            {user && (
              <div className="mb-6 p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{currentRole}</p>
                    <p className="text-lg font-bold truncate leading-tight">{user.db?.full_name || user.user_metadata?.full_name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-white/10 pt-4 opacity-90">
                  <p className="text-[11px] font-medium flex items-center gap-2"><Mail size={12}/> {user.email}</p>
                  <p className="text-[11px] font-medium flex items-center gap-2"><Phone size={12}/> {user.db?.phone || user.user_metadata?.phone || "S/N"}</p>
                  <p className="text-[11px] font-medium flex items-center gap-2"><MessageSquare size={12}/> {user.db?.whatsapp || user.user_metadata?.whatsapp || "S/N"}</p>
                </div>

                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 flex items-center justify-center gap-2 w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase transition-all"
                  >
                    <LayoutDashboard size={14}/> Dashboard Admin
                  </Link>
                )}
              </div>
            )}

            <nav className="flex-1 overflow-y-auto space-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl text-lg font-bold ${link.special ? "bg-blue-600/10 text-blue-600" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}>
                  {link.name} <ArrowUpRight size={18} className="opacity-30" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm">
                {theme === "dark" ? <><Sun size={18}/> Claro</> : <><Moon size={18}/> Oscuro</>}
              </button>

              {user ? (
                <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500 text-white font-bold text-sm">
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="flex items-center justify-center p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 font-bold text-sm">Iniciar</Link>
                  <Link href="/register" className="flex items-center justify-center p-4 rounded-xl bg-blue-600 text-white font-bold text-sm">Registrar</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}