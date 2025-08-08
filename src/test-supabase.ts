import { supabase } from "./supabase";

// Função para testar a conectividade com o Supabase
export async function testSupabaseConnection() {
  try {
    console.log("🔄 Testando conectividade com Supabase...");

    // Tenta fazer uma consulta simples
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Erro na conexão com Supabase:", error.message);
      return false;
    }

    console.log("✅ Conectividade com Supabase OK!");
    console.log("📊 Dados da sessão:", data);
    return true;
  } catch (err) {
    console.error("❌ Erro inesperado:", err);
    return false;
  }
}

// Testa automaticamente ao carregar o módulo
testSupabaseConnection();
