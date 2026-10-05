import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, ExternalLink, Mail, MapPin, Phone, Send } from "lucide-react";
import { CONFIG } from "../config";
import { Button } from "../components/ui/Button";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";

type Field = "name" | "organization" | "phone" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<"name" | "phone" | "message", string>>;
type Status = "idle" | "sending" | "success" | "failed";

const EMPTY: Values = { name: "", organization: "", phone: "", message: "" };
const PHONE_RE = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;

/** Kiritilgan raqamni `+998 XX XXX XX XX` ko'rinishiga keltiradi. */
function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if ("998".startsWith(digits)) digits = "998";
  else if (!digits.startsWith("998")) digits = "998" + digits;
  digits = digits.slice(0, 12);
  const rest = digits.slice(3);
  const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5, 7), rest.slice(7, 9)].filter(Boolean);
  return ["+998", ...parts].join(" ");
}

export function Contact() {
  const { t } = useTranslation();
  const hasForm = Boolean(CONFIG.CONTACT_ENDPOINT);

  return (
    <Section id="contact" tone="soft">
      <SectionTitle id="contact-title" intro={t("contact.text")}>
        {t("contact.title")}
      </SectionTitle>

      <div className={`grid gap-6 ${hasForm ? "lg:grid-cols-[1fr_1.4fr]" : "lg:grid-cols-2"}`}>
        <div className="card p-6">
          <h3 className="mb-5 text-h3">{t("contact.info.title")}</h3>
          <ul className="space-y-5">
            <InfoRow icon={<MapPin className="h-5 w-5" />} label={t("contact.info.address")}>
              {CONFIG.address}
              <a
                href={CONFIG.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[14px] font-medium text-brand hover:underline"
              >
                {t("common.map")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">({t("common.newTab")})</span>
              </a>
            </InfoRow>
            {CONFIG.phone && (
              <InfoRow icon={<Phone className="h-5 w-5" />} label={t("contact.info.phone")}>
                <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="hover:text-brand">
                  {CONFIG.phone}
                </a>
              </InfoRow>
            )}
            {CONFIG.email && (
              <InfoRow icon={<Mail className="h-5 w-5" />} label={t("contact.info.email")}>
                <a href={`mailto:${CONFIG.email}`} className="break-all hover:text-brand">
                  {CONFIG.email}
                </a>
              </InfoRow>
            )}
            {CONFIG.telegram && (
              <InfoRow icon={<Send className="h-5 w-5" />} label={t("contact.info.telegram")}>
                <a href={CONFIG.telegram} target="_blank" rel="noopener noreferrer" className="break-all hover:text-brand">
                  {CONFIG.telegram.replace(/^https?:\/\//, "")}
                </a>
              </InfoRow>
            )}
          </ul>
        </div>

        {hasForm ? (
          <ContactForm />
        ) : (
          <div className="card flex items-center gap-4 bg-brand-50 p-6 text-[15px] text-ink">
            <Send className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
            <p>{t("contact.noForm")}</p>
          </div>
        )}
      </div>
    </Section>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-[13px] text-muted">{label}</span>
        <span className="flex flex-col font-medium">{children}</span>
      </div>
    </li>
  );
}

/** Murojaat formasi — faqat CONTACT_ENDPOINT berilganda ko'rsatiladi. */
function ContactForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (v: Values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = t("contact.errors.name");
    if (!PHONE_RE.test(v.phone)) e.phone = t("contact.errors.phone");
    if (!v.message.trim()) e.message = t("contact.errors.message");
    return e;
  };

  const onChange = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: field === "phone" ? formatPhone(e.target.value) : e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    const firstInvalid = (Object.keys(errs) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CONFIG.CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "success" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="card flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="mb-3 h-12 w-12 text-brand" aria-hidden="true" />
        <p className="mb-5 font-heading text-[18px] font-bold">{t("contact.form.success")}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setSubmitted(false);
            setStatus("idle");
          }}
        >
          {t("contact.form.again")}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="card grid gap-4 p-6 md:grid-cols-2">
      <Input id="name" label={t("contact.form.name")} required requiredLabel={t("contact.form.required")} value={values.name} onChange={onChange("name")} error={errors.name} autoComplete="name" />
      <Input id="organization" label={t("contact.form.organization")} value={values.organization} onChange={onChange("organization")} autoComplete="organization" />
      <Input
        id="phone"
        label={t("contact.form.phone")}
        required
        requiredLabel={t("contact.form.required")}
        value={values.phone}
        onChange={onChange("phone")}
        onFocus={() => {
          if (!values.phone) setValues((v) => ({ ...v, phone: "+998 " }));
        }}
        error={errors.phone}
        type="tel"
        placeholder="+998 XX XXX XX XX"
        autoComplete="tel"
        className="md:col-span-2"
      />
      <Input id="message" label={t("contact.form.message")} required requiredLabel={t("contact.form.required")} value={values.message} onChange={onChange("message")} error={errors.message} multiline className="md:col-span-2" />
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <Button type="submit" disabled={status === "sending"} className="disabled:opacity-70">
          <Send className="h-4 w-4" aria-hidden="true" />
          {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
        </Button>
        {status === "failed" && (
          <p role="alert" className="flex items-center gap-2 text-[14px] text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("contact.form.failed")}
          </p>
        )}
      </div>
    </form>
  );
}

interface InputProps {
  id: Field;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

function Input({ id, label, value, onChange, onFocus, error, required, requiredLabel, multiline, type = "text", placeholder, autoComplete, className = "" }: InputProps) {
  const fieldId = `contact-${id}`;
  const errId = `${fieldId}-error`;
  const cls = `w-full rounded-md border bg-white px-3.5 py-2.5 text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ${
    error ? "border-red-600" : "border-line"
  }`;
  const common = {
    id: fieldId,
    name: id,
    value,
    onChange,
    onFocus,
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    className: cls,
  };
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1.5 block text-[14px] font-medium">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-red-600"> *</span>
            <span className="sr-only"> ({requiredLabel})</span>
          </>
        )}
      </label>
      {multiline ? <textarea {...common} rows={5} /> : <input {...common} type={type} placeholder={placeholder} />}
      {error && (
        <p id={errId} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
