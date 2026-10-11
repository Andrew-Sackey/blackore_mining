import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { contactPage } from "@/content/contact";
import { pageMetadata } from "@/lib/seo";
import "./contact.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Ask about the Badu licence, request the desktop study or discuss a partnership with BlackOre Mining.",
  path: "/contact",
  image: "/og/og-contact.png",
  imageAlt: "Contact BlackOre Mining about the Badu licence, the desktop study, or a partnership.",
});

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        lede={contactPage.lede}
        mediaId={contactPage.mediaId}
        drawIn
      />
      <Section tone="ink" space="lg">
        <Container>
          <EnquiryForm />
        </Container>
      </Section>
    </main>
  );
}
