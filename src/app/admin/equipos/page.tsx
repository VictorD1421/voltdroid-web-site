"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, PlusCircle, History, 
  Smartphone, Calendar, DollarSign, 
  Camera, MessageCircle, Settings2, Loader2,
  MoreVertical, Wrench, User, BookOpen, X, Info,
  CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { trackAction } from "@/lib/audit";

type Order = {
  id: string;
  equipo_nombre: string;
  costo: number;
  fecha_inicio: string;
  fecha_entrega: string;
  estado: string;
  cliente_nombre: string;
  cliente_tlf: string;
  cliente_ws: string;
  foto_url?: string;
};

export default function OrdersAdmin() {
  const [activeTab, setActiveTab] = useState<"registro" | "historial">("registro");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    equipo_nombre: "",
    costo: "",
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_entrega: "",
    estado: "Fase Inicial / Revisión",
    cliente_nombre: "",
    cliente_tlf: "",
    cliente_ws: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `reparaciones/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('equipos_fotos').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('equipos_fotos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const saveProcess = async () => {
      let finalFotoUrl = "";
      if (selectedFile) finalFotoUrl = await uploadImage(selectedFile);

      const { error } = await supabase.from("orders").insert([
        {
          equipo_nombre: formData.equipo_nombre,
          costo: parseFloat(formData.costo) || 0,
          fecha_inicio: formData.fecha_inicio,
          fecha_entrega: formData.fecha_entrega,
          estado: formData.estado,
          cliente_nombre: formData.cliente_nombre,
          cliente_tlf: formData.cliente_tlf,
          cliente_ws: formData.cliente_ws,
          foto_url: finalFotoUrl,
        },
      ]);

      if (error) throw error;

      await trackAction({
        modulo: "EQUIPOS",
        accion: `Registró nuevo equipo: ${formData.equipo_nombre}`,
        detalles: { cliente: formData.cliente_nombre, costo: formData.costo }
      });

      setFormData({
        equipo_nombre: "", costo: "", 
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_entrega: "", estado: "Fase Inicial / Revisión",
        cliente_nombre: "", cliente_tlf: "", cliente_ws: ""
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchOrders();
    };

    toast.promise(saveProcess(), {
      loading: 'Sincronizando sistema...',
      success: 'Registro completado con éxito',
      error: (err) => `Error: ${err.message}`,
      finally: () => setIsUploading(false)
    });
  };

  const filteredOrders = orders.filter(o => 
    o.equipo_nombre?.toLowerCase().includes(search.toLowerCase()) || 
    o.cliente_nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">
      <Toaster position="top-right" richColors closeButton />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">Gestión de <span className="text-blue-600">Equipos</span></h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-zinc-500 font-medium text-sm">Terminal de control Voltdroid.</p>
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
            >
              <BookOpen size={14} />
              Manual de Operaciones
            </button>
          </div>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800">
          <button onClick={() => setActiveTab("registro")} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.4rem] text-xs font-black transition-all ${activeTab === "registro" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600" : "text-zinc-500 hover:text-zinc-800"}`}><PlusCircle size={16} /> REGISTRO</button>
          <button onClick={() => setActiveTab("historial")} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.4rem] text-xs font-black transition-all ${activeTab === "historial" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600" : "text-zinc-500 hover:text-zinc-800"}`}><History size={16} /> HISTORIAL</button>
        </div>
      </div>

      {activeTab === "registro" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-left-4 duration-500">
          <form onSubmit={handleRegister} className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-10 rounded-[3rem] shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Dispositivo / Equipo</label>
                  <div className="relative">
                    <Wrench className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input required placeholder="Modelo o Identificador" className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white" 
                      value={formData.equipo_nombre} onChange={(e) => setFormData({...formData, equipo_nombre: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Presupuesto ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input required type="text" placeholder="0.00" className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                      value={formData.costo} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if ((val.match(/\./g) || []).length <= 1) setFormData({...formData, costo: val});
                      }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Fecha de Entrada</label>
                  <input type="date" className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                    value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Promesa de Entrega</label>
                  <input required type="date" className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                    value={formData.fecha_entrega} onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Estado del Trabajo</label>
                <select className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm appearance-none text-zinc-900 dark:text-white"
                  value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})}>
                  <option>Fase Inicial / Revisión</option>
                  <option>En proceso de reparación</option>
                  <option>Reparado / Listo para entrega</option>
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-10 rounded-[3rem] shadow-sm space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 ml-2">Sujeto de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input required placeholder="Nombre" className="w-full pl-12 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                    value={formData.cliente_nombre} 
                    onChange={(e) => setFormData({...formData, cliente_nombre: e.target.value.replace(/[^a-zA-Z\s]/g, '')})} />
                </div>
                <div className="relative">
                  <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input placeholder="Teléfono" className="w-full pl-12 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                    value={formData.cliente_tlf} 
                    onChange={(e) => setFormData({...formData, cliente_tlf: e.target.value.replace(/\D/g, '')})} />
                </div>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input placeholder="WhatsApp" className="w-full pl-12 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-zinc-900 dark:text-white"
                    value={formData.cliente_ws} 
                    onChange={(e) => setFormData({...formData, cliente_ws: e.target.value.replace(/\D/g, '')})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isUploading} className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/40 transition-all flex items-center justify-center gap-3">
              {isUploading ? <Loader2 className="animate-spin" /> : "Ejecutar Registro"}
            </button>
          </form>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 text-white p-10 rounded-[3rem] space-y-6 relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px]" />
              <Camera className="text-blue-500" size={40} />
              <div>
                <h4 className="font-black text-2xl tracking-tighter">Evidencia</h4>
                <p className="text-zinc-500 text-xs font-medium mt-1">Opcional: Registro visual.</p>
              </div>
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
              <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-zinc-800 transition-all overflow-hidden relative">
                {previewUrl ? <Image src={previewUrl} alt="Preview" fill className="object-cover" /> : <><PlusCircle size={24} className="text-zinc-500" /><span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Adjuntar Foto</span></>}
              </div>
              {previewUrl && <button onClick={() => {setPreviewUrl(null); setSelectedFile(null);}} className="w-full py-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all">Eliminar Foto</button>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input placeholder="Filtrar por terminal o cliente..." className="w-full pl-16 pr-8 py-5 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm shadow-sm text-zinc-900 dark:text-white" onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[3rem]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOrders.map((order) => <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />)}
            </div>
          )}
        </div>
      )}

      {/* MANUAL DE USUARIO */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsHelpOpen(false)}>
          <div 
            className="w-full max-w-md bg-white dark:bg-[#0A0A0A] h-full shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Smartphone size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter">Guía de Equipos</h2>
              </div>
              <button onClick={() => setIsHelpOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Info size={18} />
                  <h3 className="font-black text-xs uppercase tracking-widest">Control de Terminales</h3>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  Esta sección permite el ingreso y seguimiento de cada dispositivo que entra a taller. Desde la recepción inicial hasta la entrega final al cliente.
                </p>
              </section>

              <section className="space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Flujo de Trabajo</h3>
                <div className="grid gap-3">
                  <HelpItem icon={<PlusCircle size={16}/>} title="Ingreso" desc="Registra el modelo, presupuesto estimado y fecha compromiso de entrega." />
                  <HelpItem icon={<Camera size={16}/>} title="Evidencia Visual" desc="Captura el estado físico del equipo al recibirlo para evitar reclamos futuros." />
                  <HelpItem icon={<Clock size={16}/>} title="Seguimiento" desc="Cambia los estados (Revisión → Proceso → Reparado) para mantener el orden." />
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Atención al Cliente</h3>
                <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                  <div className="flex gap-4">
                    <MessageCircle className="text-emerald-500 shrink-0" size={18} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest">Enlace Directo WhatsApp</h4>
                      <p className="text-[11px] text-zinc-500 font-medium leading-tight">Usa el botón verde en las tarjetas para abrir un chat directo con el dueño del equipo.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-blue-600/5 border border-blue-600/10 p-6 rounded-[2rem] flex gap-4">
                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Auditoría Activa</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-bold">
                    Toda creación de equipo o cambio de estatus se vincula a tu usuario para fines de control administrativo interno.
                  </p>
                </div>
              </section>
            </div>

            <button 
              onClick={() => setIsHelpOpen(false)}
              className="w-full mt-10 py-4 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Cerrar Manual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
      <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl text-blue-600 shadow-sm border border-zinc-100 dark:border-zinc-700">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black tracking-tight mb-0.5">{title}</h4>
        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdate }: { order: Order, onUpdate: () => void }) {
  const [showEdit, setShowEdit] = useState(false);

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase.from("orders").update({ estado: newStatus }).eq("id", order.id);
    if (!error) { 
      await trackAction({
        modulo: "EQUIPOS",
        accion: `Actualizó estatus de ${order.equipo_nombre}`,
        detalles: { anterior: order.estado, nuevo: newStatus }
      });
      toast.success("Estatus actualizado"); 
      onUpdate(); 
      setShowEdit(false); 
    }
  };

  const deleteOrder = async () => {
    if(confirm("¿Eliminar registro permanentemente?")) {
      if (order.foto_url) {
        const filePath = order.foto_url.split('/public/')[1]?.split('?')[0];
        if (filePath) {
          const pathInBucket = filePath.split('/').slice(1).join('/');
          await supabase.storage.from('equipos_fotos').remove([pathInBucket]);
        }
      }

      const { error } = await supabase.from("orders").delete().eq("id", order.id);
      if(!error) { 
        await trackAction({
          modulo: "EQUIPOS",
          accion: `Eliminó registro de equipo: ${order.equipo_nombre}`,
          detalles: { id: order.id, cliente: order.cliente_nombre }
        });
        toast.success("Registro eliminado"); 
        onUpdate(); 
      }
    }
  };

  return (
    <div className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden hover:border-blue-600/40 transition-all duration-500 shadow-sm flex flex-col">
      <div className="h-48 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden">
        {order.foto_url ? <Image src={order.foto_url} alt={order.equipo_nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full opacity-20 text-zinc-500"><Smartphone size={48} /></div>}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${order.estado.includes("Listo") ? "bg-emerald-500 text-white" : order.estado.includes("proceso") ? "bg-blue-600 text-white" : "bg-black/60 text-white"}`}>{order.estado}</span>
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-black tracking-tighter leading-none truncate pr-4 text-zinc-900 dark:text-white">{order.equipo_nombre}</h3>
          <div className="relative">
            <button onClick={() => setShowEdit(!showEdit)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"><MoreVertical size={18} className="text-zinc-400" /></button>
            {showEdit && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-20 p-2 animate-in fade-in zoom-in-95">
                <button onClick={() => updateStatus("Fase Inicial / Revisión")} className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase text-zinc-900 dark:text-zinc-300">Revisión</button>
                <button onClick={() => updateStatus("En proceso de reparación")} className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase text-zinc-900 dark:text-zinc-300">En Proceso</button>
                <button onClick={() => updateStatus("Reparado / Listo para entrega")} className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase text-emerald-500">Reparado</button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                <button onClick={deleteOrder} className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-[9px] font-black uppercase text-red-500">Eliminar</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-5 border-y border-zinc-100 dark:border-zinc-800">
          <div><span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Titular</span><p className="text-xs font-bold truncate text-zinc-900 dark:text-white">{order.cliente_nombre}</p></div>
          <div className="text-right"><span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Costo</span><p className="text-xs font-black text-blue-600">${order.costo}</p></div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col"><span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Entrega</span><div className="flex items-center gap-2 text-zinc-500 mt-1"><Calendar size={12} /><span className="text-[10px] font-bold">{order.fecha_entrega}</span></div></div>
          <div className="flex gap-2">
            <a href={`https://wa.me/${order.cliente_ws}`} target="_blank" rel="noreferrer" className="p-3 bg-emerald-500 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/20"><MessageCircle size={16} /></a>
            <a href={`tel:${order.cliente_tlf}`} className="p-3 bg-blue-600 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-blue-500/20"><Settings2 size={16} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}