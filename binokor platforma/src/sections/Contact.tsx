import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m } from "framer-motion";
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { CONFIG } from "../config";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";

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
    const raw = e.target.value;
    const next = { ...values, [field]: field === "phone" ? formatPhone(raw) : raw };
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

    // Endpoint berilmagan bo'lsa ma'lumot hech qayerga yuborilmaydi.
    if (!CONFIG.CONTACT_ENDPOINT) {
      setStatus("success");
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

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
    setStatus("idle");
  };

  return (
    <Section id="contact" tone="base">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <SectionTitle id="contact-title" eyebrow={`09 — ${t("nav.contact")}`} intro={t("contact.text")}>
            {t("contact.title")}
          </SectionTitle>

          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <m.div
                key="ok"
                role="status"
                className="card-dark p-8 text-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-amber" aria-hidden="true" />
                <p className="mb-6 font-heading text-h3 lg:text-h3-lg">{t("contact.form.success")}</p>
                <Button type="button" variant="outline" onClick={reset} aria-label={t("contact.form.again")}>
                  {t("contact.form.again")}
                </Button>
              </m.div>
            ) : (
              <m.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                className="card-dark grid gap-5 p-6 md:grid-cols-2 lg:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Input
                  id="name"
                  label={t("contact.form.name")}
                  required
                  requiredLabel={t("contact.form.required")}
                  value={values.name}
                  onChange={onChange("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  id="organization"
                  label={t("contact.form.organization")}
                  value={values.organization}
                  onChange={onChange("organization")}
                  autoComplete="organization"
                />
                <Input
                  id="phone"
                  label={t("contact.form.phone")}
                  required
                  requiredLabel={t("contact.form.required")}
                  value={values.phone}
                  onChange={onChange("phone")}
                  error={errors.phone}
                  type="tel"
                  inputMode="tel"
                  placeholder="+998 XX XXX XX XX"
                  autoComplete="tel"
                  onFocus={() => {
                    if (!values.phone) setValues((v) => ({ ...v, phone: "+998 " }));
                  }}
                  className="md:col-span-2"
                />
                <Input
                  id="message"
                  label={t("contact.form.message")}
                  required
                  requiredLabel={t("contact.form.required")}
                  value={values.message}
                  onChange={onChange("message")}
                  error={errors.message}
                  multiline
                  className="md:col-span-2"
                />
                <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    aria-label={t("contact.form.submit")}
                    className="disabled:opacity-70"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                  </Button>
                  {status === "failed" && (
                    <p role="alert" className="flex items-center gap-2 text-amber">
                      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t("contact.form.failed")}
                    </p>
                  )}
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>

        <aside aria-labelledby="contact-info-title" className="lg:pt-[120px]">
          <div className="card-dark p-7">
            <h3 id="contact-info-title" className="mb-6 text-h3 lg:text-h3-lg">
              {t("contact.info.title")}
            </h3>
            <ul className="space-y-5">
              <InfoRow icon={<MapPin className="h-5 w-5" />} label={t("contact.info.address")}>
                <a href={CONFIG.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber">
                  {CONFIG.address}
                  <span className="mt-0.5 block text-sm font-bold text-amber">
                    {t("common.map")} ↗<span className="sr-only"> ({t("common.newTab")})</span>
                  </span>
                </a>
              </InfoRow>
              <InfoRow icon={<Phone className="h-5 w-5" />} label={t("contact.info.phone")}>
                <a href={`tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`} className="hover:text-amber">
                  {CONFIG.phone}
                </a>
              </InfoRow>
              <InfoRow icon={<Mail className="h-5 w-5" />} label={t("contact.info.email")}>
                <a href={`mailto:${CONFIG.email}`} className="break-all hover:text-amber">
                  {CONFIG.email}
                </a>
              </InfoRow>
              <InfoRow icon={<Send className="h-5 w-5" />} label={t("contact.info.telegram")}>
                <a
                  href={CONFIG.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all hover:text-amber"
                >
                  {CONFIG.telegram.replace(/^https?:\/\//, "")}
                </a>
              </InfoRow>
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber/25 bg-amber-soft text-amber"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <div className="font-medium text-white">{children}</div>
      </div>
    </li>
  );
}

interface InputProps {
  id: Field;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  multiline?: boolean;
  type?: string;
  inputMode?: "tel" | "text";
  placeholder?: string;
  autoComplete?: string;
  onFocus?: () => void;
  className?: string;
}

function Input({
  id,
  label,
  value,
  onChange,
  error,
  required,
  requiredLabel,
  multiline,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  onFocus,
  className = "",
}: InputProps) {
  const fieldId = `contact-${id}`;
  const errId = `${fieldId}-error`;
  const cls = `w-full rounded-xl border bg-ink px-4 py-3 text-white placeholder:text-muted/70 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30 ${
    error ? "border-amber" : "border-line-strong"
  }`;
  const common = {
    id: fieldId,
    name: id,
    value,
    onChange,
    required,
    autoComplete,
    onFocus,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    className: cls,
  };

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-medium text-muted">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-amber"> *</span>
            <span className="sr-only"> ({requiredLabel})</span>
          </>
        )}
      </label>
      {multiline ? (
        <textarea {...common} rows={5} className={`${cls} resize-y`} />
      ) : (
        <input {...common} type={type} inputMode={inputMode} placeholder={placeholder} />
      )}
      {error && (
        <p id={errId} className="mt-2 flex items-center gap-1.5 text-sm text-amber">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
