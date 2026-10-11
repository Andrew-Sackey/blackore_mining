"use client";

import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { Subheading } from "@/components/type/Subheading";
import { aboutIntro } from "@/content/about";
import { copyText, isPlaceholder } from "@/content/placeholder";

export function AboutIntro() {
  const statement = aboutIntro.statement;
  useTagline(copyText(statement));

  return (
    <Section tone="ink" space="lg">
      <Container>
        <div className="about-intro">
          <div className="about-intro-copy">
            <Eyebrow>{aboutIntro.eyebrow}</Eyebrow>
            <SplitHeading
              className="type-heading"
              note={isPlaceholder(statement) ? statement.note : undefined}
            >
              {copyText(statement)}
            </SplitHeading>
            <Lede>
              <Copy value={aboutIntro.lede} />
            </Lede>
          </div>
          <dl className="about-facts">
            {aboutIntro.facts.map((fact) => (
              <div key={fact.label}>
                <dt>
                  <Caption as="span">{fact.label}</Caption>
                </dt>
                <dd>
                  <Subheading>
                    <Copy value={fact.value} />
                  </Subheading>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
