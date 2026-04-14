"use client";

import AuthLayout from "@/components/AuthLayout";
import { Lock, ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const isPasswordValid = useMemo(() => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&/])[A-Za-z\d@$!%*#?&/]{6,}$/.test(password);
  }, [password]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setIsPending(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert("Error al actualizar: " + error.message);
      setIsPending(false);
    } else {
      setIsDone(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <AuthLayout title="Nueva Clave" subtitle="Actualice sus credenciales de seguridad">
      <form className="space-y-6" onSubmit={handleUpdate}>
        {isDone ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center space-y-3">
            <CheckCircle2 className="mx-auto" size={32} />
            <p className="text-xs font-black uppercase tracking-widest">Sincronización Exitosa</p>
            <p className="text-[10px] opacity-80">Redirigiendo a la terminal maestra...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nueva Contraseña</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isPasswordValid ? 'text-emerald-500' : 'text-zinc-400'}`} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:border-blue-600 transition-all"
                  placeholder="••••••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button disabled={isPending || !isPasswordValid} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3">
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              {isPending ? 'Actualizando...' : 'Confirmar Nueva Clave'}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
}