"use client";

import { ErrorScreen } from "@/components/layout/ErrorScreen";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen reset={reset} />;
}
