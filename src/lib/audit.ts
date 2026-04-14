import { supabase } from "./supabase";

interface AuditProps {
  accion: string;
  modulo: string; // Lo seguiremos recibiendo para formatear el mensaje, pero no se enviará como columna
  detalles?: any; 
}

export const trackAction = async ({ accion, modulo, detalles = null }: AuditProps) => {
  try {
    // 1. Obtener sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // 2. Obtener nombre del usuario desde tu tabla de perfiles
    const { data: profile } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    // 3. Insertar en la tabla de auditoría (Ajustado a tus columnas reales)
    const { error } = await supabase.from("auditoria").insert({
      // Combinamos el módulo y la acción en la columna 'accion' que sí existe
      accion: `[${modulo}] ${accion}`, 
      usuario_id: session.user.id,
      usuario_nombre: profile?.full_name || session.user.email || "Usuario Voltdroid",
      detalles: detalles // Columna jsonb existente
    });

    if (error) throw error;
  } catch (err) {
    // Este catch capturará errores si los nombres de columnas no coinciden
    console.error("Error en log de auditoría:", err);
  }
};