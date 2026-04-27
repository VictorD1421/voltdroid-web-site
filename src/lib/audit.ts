import { supabase } from "./supabase";

interface AuditProps {
  accion: string;
  modulo: string;
  detalles?: any; 
}

export const trackAction = async ({ accion, modulo, detalles = null }: AuditProps) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    const { error } = await supabase.from("auditoria").insert({
      accion: `[${modulo}] ${accion}`, 
      usuario_id: session.user.id,
      usuario_nombre: profile?.full_name || session.user.email || "Usuario Voltdroid",
      detalles: detalles 
    });

    if (error) throw error;
  } catch (err) {
    console.error("Error en log de auditoría:", err);
  }
};