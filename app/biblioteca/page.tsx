"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DetectiveWorkspace from "@/components/DetectiveWorkspace";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserSafely } from "@/lib/supabase/session";

export default function LibraryPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getCurrentUserSafely().then(({ user, error }) => {
      if (!user) router.replace(`/login?next=/biblioteca${error ? "&reason=session" : ""}`);
      else setReady(true);
    });
  }, [router]);

  return <><Navbar /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">{ready ? <DetectiveWorkspace /> : <p className="text-sm text-muted">Preparando tu biblioteca...</p>}</main></>;
}
