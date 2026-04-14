"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage({ type: 'error', text: "ERROR: No se pudo enviar el protocolo de recuperación." });
    } else {
      setMessage({ type: 'success', text: "PROTOCOL ENVIADO: Revise su bandeja de entrada para continuar." });
    }
    setIsPending(false);
  };

  return (
    <AuthLayout title="Recuperación" subtitle="Solicite un enlace de acceso temporal">
      <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4" onSubmit={handleResetRequest}>
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <p className="text-[10px] font-black uppercase">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Correo de Operador</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600" size={18} />
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:border-blue-600 transition-all"
              placeholder="id@voltdroid.com"
            />
          </div>
        </div>

        <button disabled={isPending || !email} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all">
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {isPending ? 'Procesando...' : 'Enviar Protocolo'}
        </button>

        <Link href="/login" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft size={14} />
          <span className="text-[10px] font-bold uppercase">Volver al Terminal</span>
        </Link>
      </form>
    </AuthLayout>
  );
}