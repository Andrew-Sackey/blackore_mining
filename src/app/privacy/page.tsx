import type { Metadata } from "next";
import { Copy } from "@/components/content/Copy";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Body } from "@/components/type/Body";
import { privacyPage } from "@/content/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice",
  description: "How BlackOre Mining handles the information you send through this website.",
  path: "/privacy",
  image: "/og/og-home.png",
  imageAlt:
    "BlackOre Mining. Birimian ground, ready to be tested. A 41.09 km² exploration concession at Badu, Bono Region, Ghana.",
});

export default function PrivacyPage() {
  return (
    <main>
      <PageHero eyebrow={privacyPage.eyebrow} title={privacyPage.title} />
      <Section tone="ink" space="lg">
        <Container>
          <div className="privacy-copy">
            {privacyPage.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <Body>
                  <Copy value={section.body} />
                </Body>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
