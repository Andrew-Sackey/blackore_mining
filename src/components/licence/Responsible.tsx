"use client";

import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MediaFrame } from "@/components/media/MediaFrame";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Body } from "@/components/type/Body";
import { Eyebrow } from "@/components/type/Eyebrow";
import { licenceCare } from "@/content/licence";
import { copyText, isPlaceholder } from "@/content/placeholder";

export function Responsible() {
  const title = copyText(licenceCare.title);
  useTagline(title);

  return (
    <Section tone="ink-2" space="md">
      <Container>
        <div className="care-grid">
          <div>
            <div className="section-intro">
              <Eyebrow>{licenceCare.eyebrow}</Eyebrow>
              <SplitHeading note={isPlaceholder(licenceCare.title) ? licenceCare.title.note : undefined}>
                {title}
              </SplitHeading>
            </div>
            <ul className="care-list">
              {licenceCare.commitments.map((item) => (
                <li key={copyText(item.title)}>
                  <p className="type-subheading">
                    <Copy value={item.title} />
                  </p>
                  <Body>
                    <Copy value={item.body} />
                  </Body>
                </li>
              ))}
            </ul>
          </div>
          <MediaFrame id={licenceCare.mediaId} ratio="4/5" />
        </div>
      </Container>
    </Section>
  );
}
