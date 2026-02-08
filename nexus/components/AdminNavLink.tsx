"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const configured = isSupabaseConfigured();
  const supabase = createClient();

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    setIsAdmin(profile?.role === "admin");
  };

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    checkAdmin().finally(() => setReady(true));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    return () => subscription.unsubscribe();
  }, [configured, supabase.auth]);

  if (!ready || !isAdmin) return null;

  return (
    <Link href="/admin">
      <Button variant="ghost" size="sm" type="button" className="gap-1.5">
        <LayoutDashboard className="h-4 w-4" />
        Admin
      </Button>
    </Link>
  );
}
