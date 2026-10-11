import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Copy } from "@/components/content/Copy";
import { Container } from "@/components/layout/Container";
import { mediaItems } from "@/content/media";
import { ph } from "@/content/placeholder";
import { Heading } from "@/components/type/Heading";
import { Lede } from "@/components/type/Lede";

export const metadata: Metadata = {
  title: "Shot list",
  robots: { index: false, follow: false },
};

const note = ph(
  "Send this list to the videographer. Replace a row when the file arrives.",
  "Shot list note",
);

export default function ShotListPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="shot-page">
      <Container>
        <Heading>Shot list</Heading>
        <Lede>
          <Copy value={note} />
        </Lede>
        <table className="shot-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Kind</th>
              <th>Placeholder</th>
              <th>Shot</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {mediaItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.kind}</td>
                <td>{item.placeholderVariant}</td>
                <td>{item.shot}</td>
                <td>Needed</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </main>
  );
}
