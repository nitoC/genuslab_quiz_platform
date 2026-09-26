"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import { submitContactMessage } from "@/lib/api/apis";
import {
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineSend,
  MdCheckCircle,
  MdErrorOutline,
  MdOutlineArrowOutward,
} from "react-icons/md";
import {
  FaXTwitter,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

/* ── contact details (genuslabtechnologies.com/contact) ─────────────── */

const SUPPORT_EMAIL = "support@genuslabtechnologies.com";
const ADMIN_EMAIL = "admin@genuslabtechnologies.com";
const PHONE_LABEL = "+234 816 277 3858";
// const PHONE_LABEL = "+234 707 920 6847";
const PHONE_HREF = "tel:+2347079206847";
const OFFICE_LABEL = "Suite 41, Vicbalkon towers, Utako, Abuja, Nigeria";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/Zq2rjfkY1jvGA5De6";
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Vicbalkon%20Towers%2C%20Utako%2C%20Abuja%2C%20Nigeria&output=embed";

const contactCards: {
  label: string;
  icon: IconType;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    label: "Email",
    icon: MdOutlineEmail,
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}?cc=${ADMIN_EMAIL}`,
  },
  {
    label: "Phone",
    icon: MdOutlinePhone,
    value: PHONE_LABEL,
    href: PHONE_HREF,
  },
  {
    label: "Office",
    icon: MdOutlineLocationOn,
    value: OFFICE_LABEL,
    href: OFFICE_MAP_URL,
    external: true,
  },
];

const socialLinks: { icon: IconType; label: string; href: string }[] = [
  { icon: FaXTwitter, label: "X", href: "https://x.com/genuslabt" },
  {
    icon: FaYoutube,
    label: "YouTube",
    href: "https://www.youtube.com/@Genuslab_technologies",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://web.facebook.com/people/Genuslab-Technologies/100089159413660/",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/genuslabofficial/",
  },
  {
    icon: FaTiktok,
    label: "TikTok",
    href: "https://www.tiktok.com/@genus_lab",
  },
];

// The same four workspace photos used in "Visit Our Spaces" on
// https://genuslabtechnologies.com/contact
const spaces = [
  { src: "/images/spaces/dev_side.jpg", alt: "Genuslab office space" },
  { src: "/images/spaces/studio_empty.jpg", alt: "Genuslab studio space" },
  { src: "/images/spaces/team_meeting.jpg", alt: "Genuslab meeting room" },
  { src: "/images/spaces/building.jpg", alt: "Genuslab building exterior" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.4 },
};

const labelClass = "mb-1.5 block text-sm font-semibold text-[#080820]";
const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue focus:ring-2 focus:ring-blue/20";

type FormState = {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  subject: "",
  message: "",
};

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status === "sent" || status === "error") setStatus("idle");
  };

  // Pre-filled email used as a fallback so a message is never lost when the
  // API is unreachable.
  const mailtoFallback = `mailto:${SUPPORT_EMAIL}?cc=${ADMIN_EMAIL}&subject=${encodeURIComponent(
    form.subject || "Website enquiry",
  )}&body=${encodeURIComponent(
    `${form.message}\n\n—\nName: ${form.name}\nEmail: ${form.email}${
      form.company ? `\nCompany / Organization: ${form.company}` : ""
    }`,
  )}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
        type: "message",
      });
      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F5F9FF]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">
              Contact
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#080820] md:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
              Have a project in mind or want to collaborate? We&apos;d love to
              hear from you. Reach out and let&apos;s build something amazing
              together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[280px] md:max-w-sm"
          >
            <Image
              src="/images/contact.png"
              alt=""
              width={420}
              height={420}
              className="h-auto w-full"
              priority
            />
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* SEND A MESSAGE */}
          <motion.section
            {...fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-[#080820]">
                Send a Message
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F9FF] px-4 py-1.5 text-xs font-semibold text-blue">
                <MdOutlineSchedule size={14} />
                We&apos;ll respond within 24 hours
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name <span className="text-red">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="company" className={labelClass}>
                    Company / Organization
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-red">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject / Project Type
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Web app, mobile app, consultation"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message <span className="text-red">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project or inquiry..."
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-8 py-3 font-bold text-white transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <MdOutlineSend size={18} />
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "sent" && (
                <p className="flex items-start gap-2 rounded-xl bg-[#F5F9FF] p-4 text-sm font-medium text-green">
                  <MdCheckCircle size={18} className="mt-0.5 shrink-0" />
                  Message sent. Our team typically responds within 24 hours.
                </p>
              )}

              {status === "error" && (
                <p className="flex items-start gap-2 rounded-xl bg-[#F5F9FF] p-4 text-sm font-medium text-red">
                  <MdErrorOutline size={18} className="mt-0.5 shrink-0" />
                  <span>
                    We couldn&apos;t send your message just now.{" "}
                    <a
                      href={mailtoFallback}
                      className="font-bold underline underline-offset-2"
                    >
                      Email us directly
                    </a>{" "}
                    and we&apos;ll pick it up from there.
                  </span>
                </p>
              )}
            </form>
          </motion.section>

          {/* CONTACT INFORMATION */}
          <motion.section {...fadeUp} className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-[#080820]">
                Contact Information
              </h2>

              <ul className="mt-6 space-y-3">
                {contactCards.map(
                  ({ label, icon: Icon, value, href, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-blue hover:bg-[#F5F9FF]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F9FF] text-blue">
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                            {label}
                          </span>
                          <span className="mt-0.5 block break-words text-sm font-semibold text-[#080820]">
                            {value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ),
                )}
              </ul>

              <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-900">
                Connect With Us
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid h-11 w-11 place-content-center rounded-full border border-gray-900/80 text-base transition hover:bg-gray-900 hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* MAP */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <iframe
                title="GenusLab Technologies office location map"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
              <a
                href={OFFICE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-[#080820] transition hover:text-blue"
              >
                <span className="flex items-center gap-2">
                  <MdOutlineLocationOn size={18} className="text-blue" />
                  Utako, Abuja, Nigeria
                </span>
                <MdOutlineArrowOutward size={16} className="shrink-0" />
              </a>
            </div>

            {/* QUICK RESPONSE */}
            <div className="rounded-2xl border border-gray-200 bg-[#F5F9FF] p-6">
              <h3 className="text-lg font-bold text-[#080820]">
                Quick Response Guaranteed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Our team typically responds within 24 hours. For urgent
                inquiries, please call us directly.
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      {/* VISIT OUR SPACES */}
      <section className="bg-[#F5F9FF]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-extrabold text-[#080820] md:text-3xl">
              Visit Our Spaces
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {spaces.map((space, i) => (
              <motion.div
                key={space.src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative h-52 overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <Image
                  src={space.src}
                  alt={space.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
