"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function SunIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function getSafeRedirectPath(searchParams: URLSearchParams): string | null {
  const redirect = searchParams.get("redirect");
  if (!redirect) return null;
  if (redirect.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(redirect)) return null;
  return redirect;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Correo electrónico o contraseña incorrectos.");
      setIsLoading(false);
      return;
    }

    const redirectPath = getSafeRedirectPath(searchParams);
    router.replace(redirectPath ?? "/");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen bg-[#FBF4EC] md:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] p-[56px_60px] text-white md:flex">
        <div className="absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full bg-[rgba(255,255,255,.12)]" />
        <div className="absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full bg-[rgba(255,255,255,.10)]" />
        <div className="relative flex items-center gap-[13px]">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-[rgba(255,255,255,.22)]">
            <SunIcon />
          </div>
          <span className="font-display text-[21px] font-semibold tracking-[0.5px]">OpenDayCare</span>
        </div>
        <div className="relative">
          <h1 className="mb-[18px] font-display text-[42px] font-semibold leading-[1.12]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="max-w-[430px] text-[17px] leading-[1.6] text-[rgba(255,255,255,.92)]">
            Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
          </p>
        </div>
        <div className="relative text-[14px] text-[rgba(255,255,255,.9)]">🌿 Guardería Sala Soles</div>
      </aside>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="mb-[6px] font-display text-[30px] font-semibold text-[#3F362E]">Iniciar sesión</h2>
          <p className="mb-[28px] text-[15px] text-[#94887B]">Ingresá para ver el día de hoy.</p>

          <label className="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-[#94887B]">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@guarderia.com"
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-[#3F362E] placeholder-[#B6A99B] focus:border-[#F2937A]"
          />

          <label className="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-[#94887B]">CONTRASEÑA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-[#3F362E] placeholder-[#B6A99B] focus:border-[#F2937A]"
          />
          <div className="mb-[20px] text-right">
            <Link href="#" className="text-[13.5px] font-bold text-[#C5503A]">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && (
            <p className="mb-[16px] rounded-[12px] border-[1.5px] border-[#F2A78E] bg-[#FCE9E2] px-4 py-3 text-[14px] font-semibold text-[#C5503A]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-4 py-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Ingresando…" : "Iniciar sesión"}
          </button>

          <p className="mt-[24px] text-center text-[14.5px] text-[#94887B]">
            ¿Te invitó la guardería?{" "}
            <Link href="/activar-cuenta" className="font-extrabold text-[#C5503A]">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
