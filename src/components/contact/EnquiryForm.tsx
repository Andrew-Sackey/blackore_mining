"use client";

import { useForm, ValidationError } from "@formspree/react";
import { track } from "@/lib/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { ConcessionOutline } from "@/components/home/ConcessionOutline";
import { DrawPath } from "@/components/motion/DrawPath";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Heading } from "@/components/type/Heading";
import {
  contactForm,
  contactSide,
  investorTypes,
  topics,
  type TopicKey,
} from "@/content/contact";
import { copyText } from "@/content/placeholder";
import { contact, footer } from "@/content/site";
import { dur } from "@/lib/motion";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? "";

const topicKeys = new Set<string>(topics.map((topic) => topic.key));

type EnquiryFields = {
  name: string;
  email: string;
  organisation: string;
  investor: string;
  country: string;
  phone: string;
  message: string;
};

type FieldName = "name" | "email" | "organisation" | "investor" | "message" | "consent";

const fieldOrder: FieldName[] = ["name", "email", "organisation", "investor", "message", "consent"];

function isTopic(value: string | null): value is TopicKey {
  return value !== null && topicKeys.has(value);
}

function topicByKey(key: TopicKey) {
  return topics.find((topic) => topic.key === key) ?? topics[0];
}

function organisationRequired(topic: TopicKey) {
  return topic === "desktop-study" || topic === "partnership";
}

type Values = Record<FieldName, string> & { consent: string };

function readValues(form: HTMLFormElement): Values {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    organisation: String(data.get("organisation") ?? "").trim(),
    investor: String(data.get("investor") ?? "").trim(),
    message: String(data.get("message") ?? "").trim(),
    consent: data.get("consent") === "yes" ? "yes" : "",
  };
}

function validate(values: Values, topic: TopicKey): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.name) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (organisationRequired(topic) && !values.organisation) errors.organisation = "Enter your organisation.";
  if (topic === "partnership" && !values.investor) errors.investor = "Select an investor type.";
  if (values.message.length < 20) errors.message = "Write at least 20 characters.";
  if (!values.consent) errors.consent = "Please agree so we can reply to this enquiry.";
  return errors;
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] ?? "";
}

export function EnquiryForm() {
  return (
    <Suspense fallback={<EnquiryBody topic="licence" />}>
      <EnquiryFromUrl />
    </Suspense>
  );
}

function EnquiryFromUrl() {
  const params = useSearchParams();
  const raw = params.get("topic");
  const topic = isTopic(raw) ? raw : "licence";
  return <EnquiryBody topic={topic} raw={raw} />;
}

function EnquiryBody({ topic, raw = null }: { topic: TopicKey; raw?: string | null }) {
  const router = useRouter();
  const { scrollToElement } = useSmoothScroll();
  const formRef = useRef<HTMLFormElement>(null);
  const trackedEnquiry = useRef(false);
  const skipTrack = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef("");
  const sourceRef = useRef("direct");
  const helperId = useId();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [thanksName, setThanksName] = useState("");
  const [thumb, setThumb] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const current = topicByKey(topic);
  const needsOrganisation = organisationRequired(topic);
  const needsInvestor = topic === "partnership";

  useTagline(contactForm.title);

  const [state, handleSubmit, reset] = useForm<EnquiryFields>(formId || "unconfigured", {
    data: {
      _subject: () => `BlackOre enquiry · ${topicByKey(topic).label} · ${nameRef.current}`,
      topic: () => topic,
      source: () => sourceRef.current,
    },
  });

  const done = simulated || state.succeeded;

  useEffect(() => {
    if (!done) {
      trackedEnquiry.current = false;
      return;
    }
    if (trackedEnquiry.current || skipTrack.current) return;
    trackedEnquiry.current = true;
    track("enquiry_submitted", { topic });
  }, [done, topic]);
  const busy = simulating || state.submitting;
  const formFailed = (state.errors?.getFormErrors().length ?? 0) > 0;
  const email = copyText(contact.email);

  useLayoutEffect(() => {
    try {
      const previous = sessionStorage.getItem("bo-path-current");
      if (previous && previous !== "/contact") sourceRef.current = previous;
    } catch {
      sourceRef.current = "direct";
    }
  }, []);

  useEffect(() => {
    if (raw && !isTopic(raw)) router.replace("/contact?topic=licence", { scroll: false });
  }, [raw, router]);

  useLayoutEffect(() => {
    const root = switchRef.current;
    if (!root) return;
    const measure = () => {
      const button = root.querySelector<HTMLElement>(`[data-topic="${topic}"]`);
      if (!button) return;
      setThumb({
        x: button.offsetLeft,
        y: button.offsetTop,
        width: button.offsetWidth,
        height: button.offsetHeight,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [topic]);

  useEffect(() => {
    if (!done) return;
    successRef.current?.focus();
  }, [done]);

  function selectTopic(next: TopicKey) {
    router.replace(`/contact?topic=${next}`, { scroll: false });
  }

  function onTopicKey(event: KeyboardEvent<HTMLDivElement>) {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !back) return;
    event.preventDefault();
    const index = topics.findIndex((item) => item.key === topic);
    const next = topics[(index + (forward ? 1 : -1) + topics.length) % topics.length];
    selectTopic(next.key);
    requestAnimationFrame(() => {
      switchRef.current?.querySelector<HTMLButtonElement>(`[data-topic="${next.key}"]`)?.focus();
    });
  }

  function showError(field: FieldName) {
    return (touched[field] || attempted) ? errors[field] : undefined;
  }

  function blurField(field: FieldName) {
    const form = formRef.current;
    if (!form) return;
    const next = validate(readValues(form), topic);
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: next[field] }));
  }

  function growMessage(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    const line = 24;
    const max = line * 10 + 28;
    element.style.height = `${Math.min(element.scrollHeight, max)}px`;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = readValues(form);
    const next = validate(values, topic);
    setAttempted(true);
    setErrors(next);
    const first = fieldOrder.find((field) => next[field]);
    if (first) {
      const input = document.getElementById(`enquiry-${first}`);
      const target = input?.closest(".field");
      if (target instanceof HTMLElement) scrollToElement(target);
      input?.focus();
      return;
    }

    nameRef.current = values.name;
    setThanksName(firstName(values.name));
    const gotcha = String(new FormData(form).get("_gotcha") ?? "").trim();
    if (!formId) {
      console.warn(
        "[contact] NEXT_PUBLIC_FORMSPREE_FORM_ID is not set. Simulating a successful enquiry.",
      );
      setSimulating(true);
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      setSimulating(false);
      setSimulated(true);
      return;
    }
    if (gotcha) {
      skipTrack.current = true;
      setSimulated(true);
      return;
    }
    await handleSubmit(new FormData(form));
  }

  function sendAnother() {
    skipTrack.current = false;
    reset();
    setSimulated(false);
    setThanksName("");
    setErrors({});
    setTouched({});
    setAttempted(false);
    setMessage("");
    formRef.current?.reset();
    window.setTimeout(() => document.getElementById("enquiry-name")?.focus(), 0);
  }

  const productionFallback = !formId && process.env.NODE_ENV === "production";

  return (
    <>
      <div className="contact-layout">
        <div className={done ? "contact-main is-done" : "contact-main"}>
          {productionFallback ? (
            <EmailFallback email={email} />
          ) : (
            <>
              <div className="enquiry-collapse" inert={done ? true : undefined}>
                <div className="enquiry-collapse-inner">
                  <form ref={formRef} className="enquiry-form" noValidate onSubmit={onSubmit}>
                    <Eyebrow>Enquiry</Eyebrow>
                    <SplitHeading>{contactForm.title}</SplitHeading>
                    <div
                      ref={switchRef}
                      className="topic-switch"
                      role="radiogroup"
                      aria-label="Enquiry topic"
                      onKeyDown={onTopicKey}
                    >
                      <span
                        className={thumb.width ? "topic-thumb is-set" : "topic-thumb"}
                        style={{
                          width: thumb.width,
                          height: thumb.height,
                          transform: `translate3d(${thumb.x}px, ${thumb.y}px, 0)`,
                        }}
                        aria-hidden="true"
                      />
                      {topics.map((item) => {
                        const selected = item.key === topic;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            data-topic={item.key}
                            tabIndex={selected ? 0 : -1}
                            className="topic-pill"
                            onClick={() => selectTopic(item.key)}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="field-row">
                      <Field
                        id="enquiry-name"
                        name="name"
                        label="Full name"
                        required
                        autoComplete="name"
                        error={showError("name")}
                        onBlur={() => blurField("name")}
                      />
                      <Field
                        id="enquiry-email"
                        name="email"
                        type="email"
                        label="Email"
                        required
                        autoComplete="email"
                        error={showError("email")}
                        onBlur={() => blurField("email")}
                        server={
                          <ValidationError field="email" errors={state.errors} className="field-error" id="enquiry-email-server" />
                        }
                      />
                    </div>

                    <Field
                      id="enquiry-organisation"
                      name="organisation"
                      label="Organisation"
                      required={needsOrganisation}
                      optional={!needsOrganisation}
                      autoComplete="organization"
                      error={showError("organisation")}
                      onBlur={() => blurField("organisation")}
                    />

                    <div className={needsInvestor ? "investor-slot is-open" : "investor-slot"}>
                      <div className="investor-slot-inner">
                        <Field
                          id="enquiry-investor"
                          name="investor"
                          label="Investor type"
                          required
                          as="select"
                          error={needsInvestor ? showError("investor") : undefined}
                          onBlur={() => blurField("investor")}
                          disabled={!needsInvestor}
                        >
                          <option value="">Select investor type</option>
                          {investorTypes.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>

                    <div className="field-row">
                      <Field id="enquiry-country" name="country" label="Country" autoComplete="country-name" />
                      <Field id="enquiry-phone" name="phone" type="tel" label="Phone" autoComplete="tel" />
                    </div>

                    <div className="field">
                      <label htmlFor="enquiry-message">Message (required)</label>
                      <p id={helperId} className="topic-helper">
                        <Crossfade text={current.helper} />
                      </p>
                      <div className="message-wrap">
                        {message.length === 0 ? (
                          <span className="message-placeholder" aria-hidden="true">
                            <Crossfade text={current.placeholder} />
                          </span>
                        ) : null}
                        <textarea
                          id="enquiry-message"
                          name="message"
                          required
                          rows={4}
                          value={message}
                          aria-invalid={showError("message") ? true : undefined}
                          aria-describedby={showError("message") ? `${helperId} enquiry-message-error` : helperId}
                          onChange={(event) => {
                            setMessage(event.target.value);
                            growMessage(event.target);
                          }}
                          onBlur={() => blurField("message")}
                        />
                      </div>
                      {showError("message") ? (
                        <p id="enquiry-message-error" className="field-error">
                          {showError("message")}
                        </p>
                      ) : (
                        <ValidationError field="message" errors={state.errors} className="field-error" id="enquiry-message-server" />
                      )}
                    </div>

                    <div className="field">
                      <label className="consent" htmlFor="enquiry-consent">
                        <input
                          id="enquiry-consent"
                          name="consent"
                          type="checkbox"
                          value="yes"
                          aria-invalid={showError("consent") ? true : undefined}
                          aria-describedby={showError("consent") ? "enquiry-consent-error" : undefined}
                          onBlur={() => blurField("consent")}
                        />
                        <span>
                          {contactForm.consent}{" "}
                          <TransitionLink href="/privacy">{contactForm.privacy}</TransitionLink>
                          {" (required)."}
                        </span>
                      </label>
                      {showError("consent") ? (
                        <p id="enquiry-consent-error" className="field-error">
                          {showError("consent")}
                        </p>
                      ) : null}
                    </div>

                    <p className="hp" aria-hidden="true">
                      <label>
                        Leave this field empty
                        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                      </label>
                    </p>

                    {formFailed && !done ? (
                      <p className="form-error" role="alert">
                        {contactForm.sendError} <CopyLine value={email} />.
                      </p>
                    ) : null}

                    <div className="enquiry-actions">
                      <button className={busy ? "btn enquiry-submit is-busy" : "btn enquiry-submit"} type="submit" disabled={busy}>
                        {busy ? contactForm.sending : contactForm.submit}
                        {busy ? null : <span aria-hidden="true">→</span>}
                      </button>
                      <Caption className="is-sentence">
                        <Copy value={contactForm.note} />
                      </Caption>
                    </div>
                  </form>
                </div>
              </div>
              {done ? (
                <div ref={successRef} tabIndex={-1} className="enquiry-success" aria-live="polite">
                  <DrawPath
                    className="success-mark"
                    label="Sent"
                    viewBox="0 0 52 52"
                    when="mount"
                    duration={dur.base}
                    paths={[
                      "M26 4.5a21.5 21.5 0 1 1-0.01 0",
                      "M15 27.5 23.2 35.2 37.5 18",
                    ]}
                  />
                  <Heading>
                    {contactForm.thanks} {thanksName}.
                  </Heading>
                  <Body>
                    <Copy value={contactForm.reply} />
                  </Body>
                  <div className="success-actions">
                    <button type="button" className="text-link" onClick={sendAnother}>
                      {contactForm.again}
                    </button>
                    <TransitionLink href={contactForm.backHref} className="btn">
                      {contactForm.back}
                    </TransitionLink>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
        <SideColumn />
      </div>
    </>
  );
}

function EmailFallback({ email }: { email: string }) {
  return (
    <div className="enquiry-fallback">
      <Eyebrow>Enquiry</Eyebrow>
      <SplitHeading>{contactForm.title}</SplitHeading>
      <Body>{contactForm.setup}</Body>
      <CopyLine value={email} />
    </div>
  );
}

function SideColumn() {
  return (
    <aside className="contact-side">
      <Reveal stagger>
        <div className="side-block">
          <h3>Direct contact</h3>
          <CopyLine value={copyText(contact.email)} display={<Copy value={contact.email} />} />
          <CopyLine value={copyText(contact.phone)} display={<Copy value={contact.phone} />} />
          <p className="side-office">
            <Copy value={contact.office} />
          </p>
          <p className="side-hours">
            <Copy value={contactSide.hours} />
          </p>
        </div>
        <div className="side-block">
          <h3>What happens next</h3>
          <ol className="next-steps">
            {contactSide.steps.map((step) => (
              <li key={typeof step === "string" ? step : step.text}>
                {typeof step === "string" ? step : <Copy value={step} />}
              </li>
            ))}
          </ol>
        </div>
        <div className="side-block">
          <h3>The concession</h3>
          <div className="contact-outline">
            <ConcessionOutline />
          </div>
          <p className="side-where">{contactSide.where}</p>
          <p className="side-coords">{footer.coordinates}</p>
          <TransitionLink href={contactSide.seeHref} className="text-link">
            {contactSide.see} <span aria-hidden="true">→</span>
          </TransitionLink>
        </div>
      </Reveal>
    </aside>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
  error,
  onBlur,
  as = "input",
  disabled = false,
  server,
  children,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
  onBlur?: () => void;
  as?: "input" | "select";
  disabled?: boolean;
  server?: ReactNode;
  children?: ReactNode;
}) {
  const mark = required ? " (required)" : optional ? " (optional)" : "";
  const errorId = `${id}-error`;
  return (
    <div className={error ? "field is-invalid" : "field"}>
      <label htmlFor={id}>
        {label}
        {mark}
      </label>
      {as === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onBlur={onBlur}
          defaultValue=""
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onBlur={onBlur}
        />
      )}
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : (
        server
      )}
    </div>
  );
}

function CopyLine({ value, display }: { value: string; display?: ReactNode }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      const node = textRef.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <p className="copy-line">
      <span ref={textRef}>{display ?? value}</span>
      <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </button>
    </p>
  );
}

function Crossfade({ text }: { text: string }) {
  const [pair, setPair] = useState({ previous: text, current: text });
  if (text !== pair.current) setPair({ previous: pair.current, current: text });
  const changing = pair.previous !== pair.current;

  return (
    <span className="crossfade">
      {changing ? (
        <span className="is-out" aria-hidden="true">
          {pair.previous}
        </span>
      ) : null}
      <span className="is-in" key={pair.current}>
        {pair.current}
      </span>
    </span>
  );
}
