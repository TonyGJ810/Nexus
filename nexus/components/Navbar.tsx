import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthNav } from "@/components/AuthNav";
import { CartNav } from "@/components/CartNav";
import { AdminNavLink } from "@/components/AdminNavLink";

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4">
      <nav
        className="flex items-center justify-between rounded-full border border-white/10 bg-zinc-950/80 px-5 py-2.5 shadow-xl backdrop-blur-md"
        aria-label="Navegación principal"
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-[0.28em] text-zinc-100 neon-text"
        >
          NEXUS
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" type="button">
              Eventos
            </Button>
          </Link>
          <AdminNavLink />
          <CartNav />
          <AuthNav />
        </div>
      </nav>
    </header>
  );
}
