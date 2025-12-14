export function PantallaCargando({ mensaje }: { mensaje?: string }) {
  return (
    <main>
      <h1>⚙️ Administrar Amigo Secreto</h1>
      <div className="spinner"></div>
      {mensaje && <p>{mensaje}</p>}
    </main>
  );
}
