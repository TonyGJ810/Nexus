"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export function MisBoletosNavLink() {
  const [hasUser, setHasUser] = useState(false);
  const [ready, setReady] = useState(false);
  const configured = isSupabaseConfigured();
  const supabase = createClient();

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    let cancelled = false;
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      setHasUser(!!user);
    };
    checkUser().finally(() => {
      if (!cancelled) setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkUser());
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured, supabase.auth]);

  if (!ready || !hasUser) return null;

  return (
    <Link href="/mis-boletos">
      <Button variant="ghost" size="sm" type="button" className="gap-1.5">
        <Ticket className="h-4 w-4" />
        Mis Boletos
      </Button>
    </Link>
  );
}
