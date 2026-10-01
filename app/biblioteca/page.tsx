"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LibraryWorkspace from "@/components/LibraryWorkspace";
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

  return <><Navbar /><main className="library-page">{ready ? <LibraryWorkspace /> : <p className="px-6 py-10 text-sm text-muted">Preparando tu biblioteca...</p>}</main></>;
}
