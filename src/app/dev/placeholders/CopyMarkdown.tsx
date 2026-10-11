"use client";

import { useState } from "react";

export function CopyMarkdown({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn placeholders-copy"
      onClick={() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        const fallback = () => {
          const area = document.createElement("textarea");
          area.value = markdown;
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        };
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(markdown).catch(fallback);
          return;
        }
        fallback();
      }}
    >
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}
