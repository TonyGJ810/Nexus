"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setLoading(false);
        setMessage({ type: "error", text: error.message });
        return;
      }
      setMessage({ type: "ok", text: "Cuenta creada con éxito. Iniciando sesión…" });
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setMessage({ type: "error", text: "Cuenta creada. Inicia sesión con tu email y contraseña." });
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        const text =
          error.message === "Email not confirmed"
            ? "Para entrar sin confirmar correo, desactiva 'Confirm email' en Supabase: Authentication → Providers → Email."
            : error.message;
        setMessage({ type: "error", text });
        return;
      }
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {message && (
              <p
                className={
                  message.type === "error"
                    ? "text-sm text-red-400"
                    : "text-sm text-cyan-400"
                }
              >
                {message.text}
              </p>
            )}
            <Button type="submit" variant="neon" className="w-full" disabled={loading}>
              {loading ? "Espera…" : isSignUp ? "Registrarme" : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => setIsSignUp((v) => !v)}
              className="w-full text-center text-sm text-zinc-400 hover:text-zinc-100"
            >
              {isSignUp ? "Ya tengo cuenta" : "Crear cuenta"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
