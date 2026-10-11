import { notFound } from "next/navigation";
import * as about from "@/content/about";
import * as concession from "@/content/concession";
import * as contact from "@/content/contact";
import * as home from "@/content/home";
import * as licence from "@/content/licence";
import * as site from "@/content/site";
import { isPlaceholder, type Placeholder } from "@/content/placeholder";
import { CopyMarkdown } from "@/app/dev/placeholders/CopyMarkdown";
import "./placeholders.css";

type Row = { page: string; text: string; note: string };

function collect(value: unknown, page: string, rows: Row[], seen: WeakSet<object>) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  if (isPlaceholder(value as Placeholder)) {
    const item = value as Placeholder;
    rows.push({ page, text: item.text, note: item.note ?? "" });
    return;
  }
  const list = Array.isArray(value) ? value : Object.values(value);
  for (const item of list) collect(item, page, rows, seen);
}

function rowsFor(page: string, value: unknown) {
  const rows: Row[] = [];
  collect(value, page, rows, new WeakSet());
  return rows;
}

export default function PlaceholdersPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const groups = [
    ["Home", home],
    ["About", about],
    ["The Concession", concession],
    ["Licence & Roadmap", licence],
    ["Contact", contact],
    ["Site", site],
  ] as const;

  const rows = groups.flatMap(([page, value]) => rowsFor(page, value));
  const markdown = groups
    .map(([page, value]) => {
      const items = rowsFor(page, value);
      if (!items.length) return "";
      const lines = items.map((row) => `- ${row.text}${row.note ? ` — ${row.note}` : ""}`);
      return `## ${page}\n${lines.join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return (
    <main className="placeholders">
      <header className="placeholders-head">
        <div>
          <p className="eyebrow">Development</p>
          <h1>Placeholders</h1>
          <p>{rows.length} items still wrapped in ph().</p>
        </div>
        <CopyMarkdown markdown={markdown} />
      </header>
      {groups.map(([page, value]) => {
        const items = rowsFor(page, value);
        if (!items.length) return null;
        return (
          <section key={page}>
            <h2>{page}</h2>
            <table>
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, index) => (
                  <tr key={`${page}-${index}`}>
                    <td>{row.text}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </main>
  );
}
