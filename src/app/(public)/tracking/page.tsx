"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Package, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  User,
  DollarSign,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("full_name, phone, whatsapp")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profile) {
        setLoading(false);
        return;
      }

      setUserName(profile.full_name);

      // Consulta optimizada para tu base de datos real
      const { data: repairs, error: repairsError } = await supabase
        .from("orders") 
        .select("*")
        .ilike("cliente_nombre", `%${profile.full_name}%`)
        .or(`cliente_tlf.eq.${profile.phone},cliente_ws.eq.${profile.whatsapp}`);

      if (!repairsError && repairs) {
        setOrders(repairs);
      }

      setLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#030303] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Sincronizando con la red...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#030303] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
            Panel de <span className="text-blue-600">Tracking</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            <User size={12} className="text-blue-600" /> Operador: {userName}
          </p>
        </div>
        <Link href="/" className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-blue-600 transition-all">
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="group relative bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 transition-all hover:border-blue-600/30 overflow-hidden"
              >
                {/* Badge de Estado */}
                <div className="absolute top-0 right-0 p-6">
                   <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border ${
                     order.estado === 'Reparado / Listo para entrega' || order.estado === 'Entregado'
                     ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                     : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                   }`}>
                     {order.estado || 'En Proceso'}
                   </span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Imagen del Equipo o Icono */}
                  <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    {order.foto_url ? (
                      <img src={order.foto_url} alt={order.equipo_nombre} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={32} />
                    )}
                  </div>
                  
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                        {order.equipo_nombre || "Equipo en Reparación"}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">ID: {order.id.split('-')[0]}</p>
                    </div>

                    {/* Información Principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-blue-600" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-400 uppercase">Ingreso</span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-emerald-600" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-400 uppercase">Entrega Est.</span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                            {order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleDateString() : 'Pendiente'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign size={14} className="text-amber-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-400 uppercase">Costo Total</span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">${order.costo || '0.00'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertCircle size={14} className="text-rose-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-400 uppercase">Estado Técnico</span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 truncate max-w-[100px]">
                            {order.estado || 'Revisando'}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-100 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-white">Sin Reparaciones Activas</h2>
              <p className="text-xs text-zinc-500 font-medium max-w-xs mx-auto">
                No hemos detectado protocolos de servicio vinculados a su identidad ({userName}).
              </p>
            </div>
            <button 
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
              Regresar al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}