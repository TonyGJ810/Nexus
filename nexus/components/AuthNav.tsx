"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthNav() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const configured = isSupabaseConfigured();
  const supabase = createClient();

  useEffect(() => {
    if (!configured) return;
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, [configured, supabase.auth]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="max-w-[120px] truncate text-sm text-zinc-400">
          {user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={signOut} type="button" className="gap-1.5">
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button variant="glass" size="sm" type="button" className="gap-1.5">
        <LogIn className="h-4 w-4" />
        Iniciar sesión
      </Button>
    </Link>
  );
}
