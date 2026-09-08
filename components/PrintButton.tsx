"use client";

import { Button } from "./Button";

/** Opens the browser print dialog. Hidden on paper through the parent's print:hidden. */
export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <Button variant="primary" sm onClick={() => window.print()}>
      {children}
    </Button>
  );
}
