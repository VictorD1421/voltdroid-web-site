"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, PackageCheck, Clock, TrendingUp, 
  BookOpen, Zap, Activity
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendientes: 0,
    completados: 0,
    enProceso: 0,
    rendimiento: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: 'exact', head: true });

      const { data: orders } = await supabase
        .from("orders")
        .select("estado");

      if (orders) {
        const pendientes = orders.filter(o => o.estado === "Fase Inicial / Revisión").length;
        const completados = orders.filter(o => o.estado === "Reparado / Listo para entrega").length;
        const enProceso = orders.filter(o => o.estado === "En proceso de reparación").length;
        const total = orders.length;
        const rendimiento = total > 0 ? Math.round((completados / total) * 100) : 0;

        setStats({
          totalUsers: usersCount || 0,
          pendientes,
          completados,
          enProceso,
          rendimiento
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
            Core <span className="text-blue-600">Engine</span>
            <Zap className="text-blue-600 fill-blue-600 animate-pulse" size={24} />
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Gestión integral del ecosistema Voltdroid.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Sistema Operativo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Comunidad" 
          value={loading ? "..." : stats.totalUsers.toString()} 
          subtitle="Usuarios registrados"
          icon={<Users size={20} />}
          gradient="from-blue-600 to-indigo-600"
        />
        <StatCard 
          title="Servicios" 
          value={loading ? "..." : stats.pendientes.toString()} 
          subtitle="En Fase Inicial / Revisión"
          icon={<Clock size={20} />}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard 
          title="Completados" 
          value={loading ? "..." : stats.completados.toString()} 
          subtitle="Listos para entrega"
          icon={<PackageCheck size={20} />}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard 
          title="Rendimiento" 
          value={loading ? "..." : `${stats.rendimiento}%`} 
          subtitle="Tasa de finalización"
          icon={<TrendingUp size={20} />}
          gradient="from-purple-600 to-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 text-blue-600">
              <BookOpen size={120} />
            </div>
            
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              Guía de Inicio Rápido
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ManualStep 
                num="01" 
                title="Gestión de Roles" 
                desc="Asigna 'engineer' o 'superusuario' en la sección Usuarios para habilitar accesos." 
              />
              <ManualStep 
                num="02" 
                title="Control de Pedidos" 
                desc="Actualiza el estado de las reparaciones para notificar automáticamente al cliente." 
              />
              <ManualStep 
                num="03" 
                title="Seguridad" 
                desc="Revisa los logs de acceso periódicamente para mantener la integridad de los datos." 
              />
              <ManualStep 
                num="04" 
                title="Soporte" 
                desc="Usa el módulo de ajustes para configurar las notificaciones del sistema." 
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center justify-center min-h-[200px]">
            <Activity className="text-blue-600 mb-4" size={40} />
            <h4 className="text-2xl font-black">{stats.enProceso}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Reparaciones en Proceso</p>
            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-blue-600 animate-pulse" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem]">
            <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-4">Estado Global</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>Base de Datos</span>
                <span className="text-emerald-500 uppercase text-[10px]">Operativo</span>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, gradient }: { title: string; value: string; subtitle: string; icon: any; gradient: string }) {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] group hover:border-blue-500/50 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-1">{title}</p>
      <div className="text-3xl font-black mb-1">{value}</div>
      <p className="text-xs font-medium text-zinc-500 leading-tight">{subtitle}</p>
    </div>
  );
}

function ManualStep({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 group/step hover:bg-blue-600 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[10px] font-black text-blue-600 group-hover/step:text-white transition-colors">{num}</span>
        <h5 className="font-bold text-sm group-hover/step:text-white transition-colors">{title}</h5>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 group-hover/step:text-blue-100 transition-colors leading-relaxed">
        {desc}
      </p>
    </div>
  );
}