"use client";

import { ReactNode } from "react";

// No provider needed with graphql-request - it's just a simple client
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

