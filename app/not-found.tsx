import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-eyebrow">404</p>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o ha sido movida.</p>
      <Link href="/">Volver al inicio</Link>
    </main>
  );
}
