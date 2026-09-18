"use client";

import PolicyLayout, { PolicySection } from "@/components/legal/PolicyLayout";
import {
  MdInfoOutline,
  MdBadge,
  MdCreditCard,
  MdQuiz,
  MdDevices,
  MdSettings,
  MdCampaign,
  MdShare,
  MdAccountBalanceWallet,
  MdPublic,
  MdLock,
  MdArchive,
  MdGavel,
  MdCookie,
  MdChildCare,
  MdLink,
  MdHistory,
  MdMailOutline,
} from "react-icons/md";

const sections: PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: MdInfoOutline,
    body: (
      <p>
        GenusLab Technologies respects the privacy of its users and is
        committed to protecting personal information collected through its
        websites, applications, digital platforms, academy, quiz services,
        competitions, referral programmes, customer support channels, and
        related services. This Privacy Policy explains how we collect, use,
        store, process, disclose, and protect personal information.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We May Collect",
    icon: MdBadge,
    body: (
      <>
        <p>
          Depending on how you interact with our services, we may collect
          personal information such as full name, email address, phone
          number, username, profile photograph, date of birth where
          required, country or location information, gender where
          voluntarily provided, and account login details.
        </p>
        <p>
          We may also collect account and service information such as
          account creation date, subscription status, membership level, quiz
          participation, scores, leaderboard position, Academy level, course
          progress, rewards, referral activity, and account preferences.
        </p>
      </>
    ),
  },
  {
    id: "payment-information",
    title: "Payment Information",
    icon: MdCreditCard,
    body: (
      <p>
        Payments may be processed through third-party payment service
        providers. GenusLab Technologies may receive payment status,
        transaction amount, transaction reference, payment date, currency,
        and limited payment method information. GenusLab Technologies does
        not necessarily store complete card details directly. Payment
        providers process sensitive financial information according to their
        own security and compliance obligations.
      </p>
    ),
  },
  {
    id: "quiz-academy-referral-information",
    title: "Quiz, Academy and Referral Information",
    icon: MdQuiz,
    body: (
      <p>
        We may collect quiz answers, scores, competition results, rankings,
        response times, rewards, course enrolment, attendance, assignments,
        assessment results, project submissions, learning progress,
        certificates, tutor feedback, referral codes, referral links, number
        of referrals, qualifying referrals, referral reward amounts, and
        referral payment history.
      </p>
    ),
  },
  {
    id: "technical-information",
    title: "Technical Information",
    icon: MdDevices,
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Internet Protocol address</li>
        <li>Device type</li>
        <li>Operating system</li>
        <li>Browser type</li>
        <li>App version</li>
        <li>Login activity</li>
        <li>Device identifiers</li>
        <li>Usage data</li>
        <li>Error logs</li>
        <li>Network information</li>
      </ul>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    icon: MdSettings,
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Create and maintain user accounts.</li>
        <li>Provide access to our platforms.</li>
        <li>Process subscriptions and transactions.</li>
        <li>Deliver Academy programmes.</li>
        <li>Operate quiz competitions and calculate rankings.</li>
        <li>Determine reward and referral eligibility.</li>
        <li>Provide customer support and service notifications.</li>
        <li>Improve platform performance and develop new features.</li>
        <li>Detect fraud, abuse, and security threats.</li>
        <li>Verify transactions.</li>
        <li>Maintain system security.</li>
        <li>Analyse platform usage.</li>
        <li>Meet regulatory or legal obligations.</li>
      </ul>
    ),
  },
  {
    id: "marketing-communications",
    title: "Marketing Communications",
    icon: MdCampaign,
    body: (
      <p>
        Where permitted, we may send users information about new GenusLab
        products, courses, promotions, competitions, events, rewards, and
        service updates. Users may be able to unsubscribe from certain
        promotional communications. Essential account, payment, security, or
        transactional messages may still be sent where necessary.
      </p>
    ),
  },
  {
    id: "sharing-personal-information",
    title: "Sharing Personal Information",
    icon: MdShare,
    body: (
      <p>
        GenusLab Technologies does not sell personal information as a
        business model. We may share information with trusted service
        providers where necessary to operate our services, including payment
        processors, cloud infrastructure providers, hosting providers, email
        service providers, customer support platforms, analytics providers,
        communication service providers, professional advisers, and
        regulatory authorities where required.
      </p>
    ),
  },
  {
    id: "payment-processors",
    title: "Payment Processors",
    icon: MdAccountBalanceWallet,
    body: (
      <p>
        GenusLab Technologies may use third-party payment providers,
        including Flutterwave and other approved processors. When making
        payments, users may also be subject to the privacy policies and
        terms of those payment providers.
      </p>
    ),
  },
  {
    id: "public-information",
    title: "Public Information",
    icon: MdPublic,
    body: (
      <p>
        Certain information may become visible to other users where this is
        part of the service. For example, a leaderboard may display a
        username, profile photograph, score, rank, competition performance,
        or reward information. Users should avoid placing confidential or
        sensitive personal information in publicly visible profile fields.
      </p>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: MdLock,
    body: (
      <p>
        GenusLab Technologies implements reasonable administrative,
        organisational, and technical measures intended to protect personal
        information from unauthorised access, loss, misuse, modification,
        disclosure, and destruction. However, no online platform or data
        transmission system can guarantee absolute security. Users are
        responsible for maintaining the confidentiality of their passwords
        and account credentials.
      </p>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: MdArchive,
    body: (
      <p>
        We may retain personal information for as long as reasonably
        necessary to provide our services, maintain accounts, resolve
        disputes, prevent fraud, maintain business and financial records, and
        meet regulatory and legal obligations. Information that is no longer
        required may be deleted, anonymised, or securely archived where
        appropriate.
      </p>
    ),
  },
  {
    id: "user-rights",
    title: "User Rights",
    icon: MdGavel,
    body: (
      <p>
        Depending on applicable laws, users may have rights concerning their
        personal information, including the right to request access,
        correction or deletion; object to certain processing; withdraw
        certain permissions; and request information about how their data is
        used. Some information may need to be retained where required for
        legal, security, fraud prevention, accounting, or regulatory
        reasons.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and Similar Technologies",
    icon: MdCookie,
    body: (
      <p>
        Our website or platform may use cookies and similar technologies to
        maintain login sessions, remember preferences, improve
        functionality, analyse website traffic, detect suspicious activity,
        and improve user experience. Users may be able to control certain
        cookies through their browser settings.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: MdChildCare,
    body: (
      <p>
        GenusLab Technologies does not knowingly collect personal
        information from children contrary to applicable law. Where
        parental or guardian consent is legally required, users must obtain
        appropriate permission before creating or operating an account.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    icon: MdLink,
    body: (
      <p>
        Our services may contain links to third-party websites or platforms.
        GenusLab Technologies is not responsible for the privacy practices,
        content, or security of websites controlled by third parties. Users
        should review the privacy policies of those websites separately.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Privacy Policy",
    icon: MdHistory,
    body: (
      <p>
        We may update this Privacy Policy periodically to reflect changes to
        our services, technology, regulatory requirements, or business
        developments. Updated versions may be published on our website with
        a revised effective date.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    icon: MdMailOutline,
    body: (
      <p>
        Questions regarding this Privacy Policy may be submitted through the
        official GenusLab Technologies contact information provided on our
        website.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="GenusLab Technologies · Website Policies"
      title="Privacy Policy"
      dates="Effective Date: September 18, 2026 · Last Updated: September 18, 2026"
      intro="How we collect, use, and protect your information across GenusLab Academy, GenusLab Quiz, and every related service."
      heroImage="/images/doc.png"
      sections={sections}
    />
  );
}
