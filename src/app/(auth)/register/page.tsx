"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ShieldCheck, Phone, Eye, EyeOff, ShieldAlert, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para notificaciones elegantes
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    confirmPassword: ""
  });

  // Limpiar notificaciones después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- VALIDACIONES ---
  const isNameValid = useMemo(() => /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(formData.fullName), [formData.fullName]);
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), [formData.email]);
  const isPhoneValid = useMemo(() => /^\d{10,15}$/.test(formData.phone), [formData.phone]);
  const isWhatsappValid = useMemo(() => /^\d{10,15}$/.test(formData.whatsapp), [formData.whatsapp]);
  const passwordMeetsCriteria = useMemo(() => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&/])[A-Za-z\d@$!%*#?&/]{6,}$/.test(formData.password);
  }, [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const canRegister = isNameValid && isEmailValid && isPhoneValid && isWhatsappValid && passwordMeetsCriteria && passwordsMatch && !isPending;

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, [field]: value });
  };

  // --- REGISTRO PROFESIONAL ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRegister) return;

    setIsPending(true);
    setNotification(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Estos metadatos serán capturados por el Trigger en Supabase
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
          }
        }
      });

      if (error) throw error;

      setNotification({
        type: 'success',
        message: "¡Registro exitoso! Revisa tu correo para verificar la cuenta."
      });

      // Redirigir al inicio tras una breve pausa para que lea el mensaje
      setTimeout(() => router.push("/"), 3000);

    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || "Error crítico en la red de autenticación."
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout 
      title="Registro de Ingeniero" 
      subtitle="Alta de nuevo operador en el Sistema de Diagnóstico V3.0"
    >
      {/* BANNER DE NOTIFICACIÓN INTEGRADO */}
      {notification && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 border ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <p className="text-xs font-black uppercase tracking-widest">{notification.message}</p>
        </div>
      )}

      <form className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700" onSubmit={handleRegister}>
        
        {/* IDENTIDAD LEGAL */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Identidad Legal</label>
            {formData.fullName.length > 0 && (
              <span className={`text-[9px] font-bold uppercase ${isNameValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isNameValid ? 'Válido' : 'Requerido'}
              </span>
            )}
          </div>
          <div className="relative group">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isNameValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={18} />
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 px-12 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
              placeholder="Nombre y Apellido"
              required
            />
          </div>
        </div>

        {/* CORREO */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Comunicación Digital</label>
          <div className="relative group">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEmailValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={18} />
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 px-12 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
              placeholder="id@voltdroid.com"
              required
            />
          </div>
        </div>

        {/* TELÉFONOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Móvil</label>
            <div className="relative group">
              <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPhoneValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={16} />
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => handleNumericInput(e, 'phone')}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-11 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
                placeholder="10+ dígitos"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">WhatsApp</label>
            <div className="relative group">
              <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isWhatsappValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={16} />
              <input 
                type="text" 
                value={formData.whatsapp}
                onChange={(e) => handleNumericInput(e, 'whatsapp')}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-11 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
                placeholder="10+ dígitos"
              />
            </div>
          </div>
        </div>

        {/* CONTRASEÑAS */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Clave de Acceso</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${passwordMeetsCriteria ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 px-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Confirmación</label>
            <div className="relative group">
              <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${passwordsMatch ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`} size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 px-12 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
                placeholder="Re-ingresar clave"
                required
              />
            </div>
          </div>
        </div>

        {/* BOTÓN REGISTRO */}
        <button 
          type="submit"
          disabled={!canRegister}
          className={`relative w-full overflow-hidden group rounded-2xl py-4 font-black uppercase tracking-widest text-[11px] text-white transition-all shadow-xl mt-4
            ${canRegister 
              ? 'bg-blue-600 hover:scale-[1.01] active:scale-[0.98] cursor-pointer' 
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}
          `}
        >
          {canRegister && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : canRegister ? (
              <UserPlus size={18} />
            ) : (
              <ShieldAlert size={18} />
            )}
            {isPending ? 'Sincronizando...' : canRegister ? 'Finalizar Registro' : 'Protocolo Incompleto'}
          </span>
        </button>

        <p className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-4">
          ¿Ya eres parte de la red? {" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-400 transition-colors ml-1">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}