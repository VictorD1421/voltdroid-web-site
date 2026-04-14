"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, UserPlus, Shield, 
  User as UserIcon, Mail, Trash2, X,
  Loader2, BookOpen, Zap, Info, 
  CheckCircle2, AlertTriangle
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { trackAction } from "@/lib/audit";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'superusuario';
  created_at: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({ email: "", password: "", full_name: "", role: "user" });
  const [iscreating, setIsCreating] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setCurrentUser(data);
      }
    };
    getSession();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    const createProcess = async () => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
            role: newUser.role,
          }
        }
      });

      if (authError) throw authError;

      await trackAction({
        modulo: "USUARIOS",
        accion: `Creó un nuevo usuario: ${newUser.full_name}`,
        detalles: { email: newUser.email, rol: newUser.role }
      });

      return authData;
    };

    toast.promise(createProcess(), {
      loading: 'Registrando en la nube Voltdroid...',
      success: () => {
        setIsModalOpen(false);
        setNewUser({ email: "", password: "", full_name: "", role: "user" });
        fetchUsers();
        return "Usuario creado exitosamente";
      },
      error: (err) => `Error: ${err.message}`,
      finally: () => setIsCreating(false)
    });
  };

  const deleteUser = async (targetUser: UserProfile) => {
    if (currentUser?.role === 'admin' && targetUser.role === 'superusuario') {
      return toast.error("No tienes nivel para purgar un Superusuario");
    }

    toast(`¿Confirmas la eliminación de ${targetUser.full_name}?`, {
      action: {
        label: "Eliminar",
        onClick: async () => {
          const { error } = await supabase.from("users").delete().eq("id", targetUser.id);
          if (error) {
            toast.error("Error al eliminar: " + error.message);
          } else {
            await trackAction({
              modulo: "USUARIOS",
              accion: `Eliminó al usuario: ${targetUser.full_name}`,
              detalles: { id: targetUser.id, email: targetUser.email, rol_que_tenia: targetUser.role }
            });
            toast.success("Usuario purgado del sistema");
            fetchUsers();
          }
        },
      },
    });
  };

  // --- FUNCIÓN CORREGIDA ---
  const updateRole = async (targetUserId: string, targetCurrentRole: string, newRole: string) => {
    // 1. Validaciones de permisos
    if (currentUser?.role === 'admin') {
      if (targetCurrentRole === 'superusuario' || newRole === 'superusuario') {
        return toast.error("Denegado: No puedes gestionar niveles de Superusuario");
      }
    }

    // 2. Identificar al usuario localmente ANTES de la actualización para el log
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return toast.error("No se encontró el usuario en la lista local");

    const updateProcess = async () => {
      const { data, error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", targetUserId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No se aplicaron cambios");

      // Log de auditoría con datos seguros
      await trackAction({
        modulo: "USUARIOS",
        accion: `Cambió rol de ${targetUser.full_name}`,
        detalles: { 
          usuario_afectado: targetUser.email,
          anterior: targetCurrentRole, 
          nuevo: newRole 
        }
      });

      return data;
    };

    toast.promise(updateProcess(), {
      loading: 'Reconfigurando privilegios...',
      success: () => {
        fetchUsers();
        return `Nivel actualizado a: ${newRole}`;
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 relative">
      <Toaster position="top-right" richColors closeButton />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Comunidad <span className="text-blue-600">Voltdroid</span></h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-zinc-500 font-medium text-sm">Tu nivel actual: <span className="text-blue-500 uppercase font-black">{currentUser?.role}</span></p>
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
            >
              <BookOpen size={14} />
              Manual de Uso
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre o email..."
              className="pl-12 pr-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-xs"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <UserPlus size={16} />
            Nuevo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-zinc-200/50 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              currentUserRole={currentUser?.role || 'user'}
              onRoleChange={updateRole} 
              onDelete={() => deleteUser(user)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tighter">Nuevo Acceso</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Nombre Completo</label>
                <input required type="text" className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                  value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Email corporativo</label>
                <input required type="email" className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                  value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Password Temporal</label>
                <input required type="password" placeholder="••••••••" className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                  value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
              </div>

              <button disabled={iscreating} className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 mt-4">
                {iscreating ? <Loader2 className="animate-spin" size={20} /> : "Generar Usuario"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isHelpOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-[#0A0A0A] border-l border-zinc-200 dark:border-zinc-800 z-[200] shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap size={16} />
              </div>
              <h2 className="font-black uppercase tracking-tighter text-xl text-blue-600">Manual Core</h2>
            </div>
            <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" /> Operaciones Permitidas
              </h3>
              <ul className="space-y-3">
                <HelpItem title="Registro" desc="Crea accesos mediante email y contraseña. El sistema enviará una confirmación automática." />
                <HelpItem title="Búsqueda" desc="Filtra usuarios instantáneamente por nombre o correo corporativo." />
                <HelpItem title="Escalamiento" desc="Cambia los privilegios de un usuario usando el icono de escudo en su tarjeta." />
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Shield size={12} className="text-blue-500" /> Jerarquía de Poder
              </h3>
              <div className="space-y-3">
                <RoleInfo role="Superusuario" desc="Control total. Puede crear administradores y otros superusuarios." color="bg-purple-600" />
                <RoleInfo role="Admin" desc="Gestión operativa. No puede eliminar ni modificar superusuarios." color="bg-red-500" />
                <RoleInfo role="User" desc="Acceso estándar a los módulos básicos de la plataforma." color="bg-zinc-500" />
              </div>
            </section>

            <section className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <h4 className="font-bold text-xs uppercase tracking-widest">Protocolo de Auditoría</h4>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Cada acción realizada en esta sección (creación, eliminación o cambio de rol) es **rastreada permanentemente** en el Centro de Auditoría con tu firma digital.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

// Componentes auxiliares permanecen igual...
function HelpItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="space-y-1">
      <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">{title}</h4>
      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </li>
  );
}

function RoleInfo({ role, desc, color }: { role: string, desc: string, color: string }) {
  return (
    <div className="flex gap-4">
      <div className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${color}`} />
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest">{role}</h4>
        <p className="text-[11px] text-zinc-500 font-medium leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function UserCard({ user, currentUserRole, onRoleChange, onDelete }: { 
  user: UserProfile, 
  currentUserRole: string,
  onRoleChange: (id: string, currentRole: string, role: string) => void,
  onDelete: () => void
}) {
  const [showRoles, setShowRoles] = useState(false);
  
  const availableRoles = currentUserRole === 'superusuario' 
    ? ["user", "admin", "superusuario"] 
    : ["user", "admin"];

  return (
    <div className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
          <UserIcon size={24} />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowRoles(!showRoles)} 
              className={`p-3 rounded-xl transition-all ${showRoles ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:text-blue-500'}`}
            >
              <Shield size={18} />
            </button>
            
            {showRoles && (
              <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-20 p-2 animate-in slide-in-from-top-2">
                <p className="text-[9px] font-black uppercase text-zinc-400 p-3 tracking-widest">Cambiar Nivel</p>
                {availableRoles.map(r => (
                  <button 
                    key={r} 
                    onClick={() => { onRoleChange(user.id, user.role, r); setShowRoles(false); }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-black capitalize transition-all mb-1 ${user.role === r ? 'bg-blue-600 text-white' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500'}`}
                  >
                    {r === 'superusuario' ? '⚡ Superuser' : r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onDelete} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-1 mb-8">
        <h3 className="font-black text-xl truncate tracking-tighter">{user.full_name || "Sin Nombre"}</h3>
        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold">
          <Mail size={12} className="opacity-40" />
          <span className="truncate">{user.email}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
          user.role === 'superusuario' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 
          user.role === 'admin' ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
        }`}>
          {user.role}
        </span>
        <p className="text-[10px] font-mono text-zinc-400">VOLT-{user.id.slice(0, 5).toUpperCase()}</p>
      </div>
    </div>
  );
}