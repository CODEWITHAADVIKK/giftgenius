"use client";

import { useState, useEffect, type ReactNode } from "react";

/**
 * ClientOnly — renders children only after the component has mounted on the client.
 * On the server (and during the initial hydration pass), renders the fallback.
 * This prevents hydration mismatches for components that depend on browser APIs.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
