export function PantallaCargando({ mensaje }: { mensaje?: string }) {
  return (
    <main className="min-h-dvh bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-5xl mb-4 animate-bounce">⚙️</div>
      <div className="flex gap-1 mb-3">
        <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
      </div>
      {mensaje && <p className="text-white/50 text-sm">{mensaje}</p>}
    </main>
  );
}
