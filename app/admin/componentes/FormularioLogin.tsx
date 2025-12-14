"use client";

interface Props {
  password: string;
  setPassword: (password: string) => void;
  verificando: boolean;
  errorAuth: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormularioLogin({ 
  password, 
  setPassword, 
  verificando, 
  errorAuth, 
  onSubmit 
}: Props) {
  return (
    <main>
      <h1>⚙️ Administrar Amigo Secreto</h1>
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <p style={{ fontSize: "48px" }}>🔐</p>
        <p style={{ marginBottom: "20px" }}>Ingresa la contraseña de administrador</p>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            disabled={verificando}
            style={{ 
              padding: "10px", 
              fontSize: "16px",
              marginRight: "10px" 
            }}
          />
          <button 
            type="submit" 
            disabled={verificando || !password.trim()}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            {verificando ? "Verificando..." : "Entrar"}
          </button>
        </form>
        {errorAuth && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorAuth}</p>
        )}
      </div>
    </main>
  );
}
