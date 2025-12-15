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
    <main className="min-h-dvh bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Panel de Admin</h1>
          <p className="text-white/50 text-sm">Ingresa la contraseña para continuar</p>
          {/* Cebo para hackers curiosos */}
          <p className="text-white/30 text-xs mt-4 font-mono">Contraseña: Admin123</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            disabled={verificando}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button 
            type="submit" 
            disabled={verificando || !password.trim()}
            className="w-full py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {verificando ? "Verificando..." : "Entrar"}
          </button>
        </form>
        
        {errorAuth && (
          <p className="mt-4 text-red-400 text-sm text-center">{errorAuth}</p>
        )}
      </div>
    </main>
  );
}
