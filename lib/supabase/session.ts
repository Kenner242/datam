import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

type CurrentUserResult = { user: User | null; error: string | null };
export const AUTH_RECOVERY_MESSAGE_KEY = "datam-auth-recovery-message";
export const FUTURE_JWT_MESSAGE = "La sesión llegó con una fecha futura. Sincroniza la fecha y hora de Windows y vuelve a iniciar sesión.";

function isFutureIssuedJwtError(message: string) {
  return /jwt.{0,40}(issued|future)|issued.{0,40}future|token.{0,40}future/i.test(message);
}

export async function getCurrentUserSafely(): Promise<CurrentUserResult> {
  const initial = await supabase.auth.getUser();
  if (!initial.error) return { user: initial.data.user, error: null };
  if (!isFutureIssuedJwtError(initial.error.message)) return { user: null, error: initial.error.message };

  const refreshed = await supabase.auth.refreshSession();
  if (!refreshed.error && refreshed.data.session) {
    const verified = await supabase.auth.getUser(refreshed.data.session.access_token);
    if (!verified.error) return { user: verified.data.user, error: null };
  }

  await supabase.auth.signOut({ scope: "local" });
  if (typeof window !== "undefined") window.sessionStorage.setItem(AUTH_RECOVERY_MESSAGE_KEY, FUTURE_JWT_MESSAGE);
  return {
    user: null,
    error: FUTURE_JWT_MESSAGE,
  };
}

export async function getCurrentSessionSafely() {
  const identity = await getCurrentUserSafely();
  if (identity.error || !identity.user) return { session: null, error: identity.error };
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error: error.message };
  return { session: data.session, error: data.session ? null : "Inicia sesión nuevamente para continuar." };
}
