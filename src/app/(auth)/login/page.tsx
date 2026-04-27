"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LifeBuoy, ShieldCheck, ShieldAlert, Loader2, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { createClient } from "@/utils/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const isPasswordValid = useMemo(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&/])[A-Za-z\d@$!%*#?&/]{6,}$/;
    return passwordRegex.test(password);
  }, [password]);

  const canExecuteAuth = isEmailValid && isPasswordValid && !isPending;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecuteAuth) return;

    setIsPending(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setAuthError("PROTOCOLO INCOMPLETO: Por favor, verifique su identidad en su bandeja de entrada antes de acceder.");
        } else {
          setAuthError("ERROR DE ACCESO: Credenciales no reconocidas por el sistema.");
        }
        setIsPending(false);
        return;
      }

      router.refresh();
      
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
      
    } catch (err) {
      setAuthError("FALLO DE RED: No se pudo establecer conexión con la terminal maestra.");
      setIsPending(false);
    }
  };

  return (
    <AuthLayout 
      title="Acceso Maestro" 
      subtitle="Inicie sesión para desbloquear los módulos operativos"
    >
      <form className="space-y-6 animate-in slide-in-from-bottom-4 duration-700" onSubmit={handleLogin}>
        
        {authError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] font-black uppercase tracking-tight text-amber-500 leading-relaxed">
              {authError}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Operador Credencial
            </label>
            {email.length > 0 && (
              <span className={`text-[9px] font-bold uppercase ${isEmailValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isEmailValid ? 'Sintaxis Válida' : 'Formato Inválido'}
              </span>
            )}
          </div>
          <div className="group relative">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isEmailValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`}>
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium transition-all focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none"
              placeholder="id@voltdroid.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Clave de Seguridad
            </label>
            <Link href="/forgot-password" className="text-[10px] font-black text-blue-600 hover:text-blue-400 transition-colors uppercase tracking-tighter">
              ¿Olvidaste el acceso?
            </Link>
          </div>
          <div className="group relative">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isPasswordValid ? 'text-emerald-500' : 'text-zinc-400 group-focus-within:text-blue-600'}`}>
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium transition-all focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none"
              placeholder="••••••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="px-1 flex flex-wrap gap-3 text-[9px] font-black uppercase tracking-tighter transition-all duration-300">
            <span className={`flex items-center gap-1.5 ${password.length >= 6 ? 'text-emerald-500' : 'text-zinc-400'}`}>
              <div className={`w-1 h-1 rounded-full ${password.length >= 6 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-400'}`} />
              6+ Caracteres
            </span>
            <span className={`flex items-center gap-1.5 ${/[A-Za-z]/.test(password) ? 'text-emerald-500' : 'text-zinc-400'}`}>
              <div className={`w-1 h-1 rounded-full ${/[A-Za-z]/.test(password) ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-400'}`} />
              Letras
            </span>
            <span className={`flex items-center gap-1.5 ${/\d/.test(password) ? 'text-emerald-500' : 'text-zinc-400'}`}>
              <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-400'}`} />
              Número
            </span>
            <span className={`flex items-center gap-1.5 ${/[@$!%*#?&/]/.test(password) ? 'text-emerald-500' : 'text-zinc-400'}`}>
              <div className={`w-1 h-1 rounded-full ${/[@$!%*#?&/]/.test(password) ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-zinc-400'}`} />
              Especial (/@$...)
            </span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={!canExecuteAuth}
          className={`relative w-full overflow-hidden group rounded-2xl py-4.5 font-black uppercase tracking-widest text-[12px] text-white transition-all shadow-xl
            ${canExecuteAuth 
              ? 'bg-zinc-950 dark:bg-blue-600 hover:scale-[1.01] active:scale-[0.98] cursor-pointer' 
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}
          `}
        >
          {canExecuteAuth && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : canExecuteAuth ? (
              <ShieldCheck size={20} className="animate-pulse" />
            ) : (
              <ShieldAlert size={20} />
            )}
            {isPending ? 'Sincronizando...' : canExecuteAuth ? 'Ejecutar Autenticación' : 'Protocolo Incompleto'}
          </span>
        </button>

        <div className="pt-2">
          <Link href="/support" className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
            <LifeBuoy size={14} className="group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Soporte de Terminal</span>
          </Link>
        </div>

        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <span className="relative bg-[#fcfcfc] dark:bg-[#030303] px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
            O crea una nueva conexión
          </span>
        </div>

        <Link 
          href="/register" 
          className="group flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-600/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-black uppercase text-zinc-900 dark:text-white">Registrarse</span>
            <span className="text-[10px] text-zinc-500 font-medium">Acceso total</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowRight size={18} />
          </div>
        </Link>
      </form>
    </AuthLayout>
  );
}