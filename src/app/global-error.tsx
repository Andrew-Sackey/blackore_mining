"use client";

import { ErrorScreen } from "@/components/layout/ErrorScreen";
import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorScreen reset={reset} />
      </body>
    </html>
  );
}
