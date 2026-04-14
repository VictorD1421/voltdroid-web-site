"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Clock, 
  User as UserIcon, 
  Activity, 
  ShieldCheck,
  LogIn
} from "lucide-react";

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const [resAuditoria, resAccesos] = await Promise.all([
        supabase
          .from("auditoria")
          .select("*"),
        supabase
          .from("admin_access_logs")
          .select("*")
      ]);

      const auditoriaMapeada = (resAuditoria.data || []).map(log => ({
        ...log,
        tipo: 'accion',
        usuario_nombre: log.usuario_nombre,
        modulo: log.modulo,
        accion: log.accion
      }));

      const accesosMapeados = (resAccesos.data || []).map(log => ({
        ...log,
        tipo: 'acceso',
        usuario_nombre: log.full_name,
        modulo: 'SISTEMA',
        accion: `INGRESO AL PANEL (${log.role})`,
        detalles: { login_id: log.id, role: log.role }
      }));

      const combinedLogs = [...auditoriaMapeada, ...accesosMapeados].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setLogs(combinedLogs);
    } catch (error) {
      console.error("Error al sincronizar registros:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#030303] p-8">
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-600" />
            Centro de <span className="text-blue-600">Auditoría</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">
            Protocolo de Seguridad y Registros Maestros
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-blue-600 transition-all"
        >
          <Activity size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/40">
                <th className="p-5 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800">Marca de Tiempo</th>
                <th className="p-5 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800">Operador</th>
                <th className="p-5 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800">Módulo</th>
                <th className="p-5 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800">Acción / Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Sincronizando registros de seguridad...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    No hay actividad registrada.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                        <Clock size={12} className="text-zinc-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${log.tipo === 'acceso' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-600/10 text-blue-600'}`}>
                          {log.tipo === 'acceso' ? <LogIn size={14} /> : <UserIcon size={14} />}
                        </div>
                        <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-200 uppercase">{log.usuario_nombre}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-tighter border ${
                        log.modulo === 'SISTEMA' 
                        ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                      }`}>
                        {log.modulo}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="space-y-2">
                        <p className={`text-[11px] font-bold uppercase leading-relaxed ${log.tipo === 'acceso' ? 'text-amber-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {log.accion}
                        </p>
                        {log.detalles && (
                          <div className="bg-zinc-50 dark:bg-black/40 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800/50">
                            <pre className="text-[10px] text-blue-600 dark:text-blue-400 font-mono whitespace-pre-wrap">
                              {JSON.stringify(log.detalles, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}