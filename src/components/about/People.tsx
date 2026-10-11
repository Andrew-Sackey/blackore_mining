"use client";

import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { ContourField } from "@/components/intro/ContourField";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Subheading } from "@/components/type/Subheading";
import { aboutPeople } from "@/content/about";
import { SHOW_TEAM } from "@/content/site";
import { copyText, isPlaceholder } from "@/content/placeholder";

function initials(role: string) {
  return role
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function People() {
  const title = aboutPeople.title;
  useTagline(copyText(title));

  return (
    <Section tone="ink-2" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{aboutPeople.eyebrow}</Eyebrow>
          <SplitHeading note={isPlaceholder(title) ? title.note : undefined}>{copyText(title)}</SplitHeading>
        </div>
        {SHOW_TEAM ? (
          <div className="team-scroll">
            {aboutPeople.people.map((person) => {
              const role = copyText(person.role);
              return (
                <article key={role} className="team-card">
                  <div className="team-portrait">
                    <ContourField className="team-contours" />
                    <span className="team-mono">{initials(role)}</span>
                  </div>
                  <Subheading>
                    <Copy value={person.name} />
                  </Subheading>
                  <Caption as="span">
                    <Copy value={person.role} />
                  </Caption>
                  <Body>
                    <Copy value={person.bio} />
                  </Body>
                </article>
              );
            })}
          </div>
        ) : null}
        <div className="team-partner">
          <Caption>{aboutPeople.partner.caption}</Caption>
          <Subheading>{aboutPeople.partner.name}</Subheading>
          <Body>{aboutPeople.partner.body}</Body>
          <TransitionLink href={aboutPeople.partner.href} className="text-link">
            {aboutPeople.partner.link} <span>→</span>
          </TransitionLink>
        </div>
      </Container>
    </Section>
  );
}
