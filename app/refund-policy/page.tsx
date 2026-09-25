"use client";

import PolicyLayout, { PolicySection } from "@/components/legal/PolicyLayout";
import {
  MdInfoOutline,
  MdCreditCard,
  MdCheckCircle,
  MdContentCopy,
  MdHourglassEmpty,
  MdSchool,
  MdQuiz,
  MdShare,
  MdErrorOutline,
  MdSecurity,
  MdSchedule,
  MdAccountBalanceWallet,
  MdSupportAgent,
  MdGavel,
} from "react-icons/md";

const sections: PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: MdInfoOutline,
    body: (
      <p>
        This Refund Policy explains the circumstances under which users may
        request refunds for payments made to GenusLab Technologies. By
        purchasing a subscription, service, course, digital product, or other
        paid offering from GenusLab Technologies, you acknowledge that you
        have read and agreed to this Refund Policy.
      </p>
    ),
  },
  {
    id: "subscription-payments",
    title: "Subscription Payments",
    icon: MdCreditCard,
    body: (
      <p>
        Payments made for access to GenusLab Academy, GenusLab Quiz Premium,
        or any other subscription-based GenusLab service may provide users
        with immediate access to digital services, features, content,
        competitions, educational materials, or premium benefits. Because
        digital access may begin immediately after payment, subscription
        payments are generally non-refundable once access has been
        successfully activated and used. However, GenusLab Technologies may
        consider refund requests in certain circumstances.
      </p>
    ),
  },
  {
    id: "when-a-refund-may-be-considered",
    title: "When a Refund May Be Considered",
    icon: MdCheckCircle,
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>A user was charged more than once for the same transaction.</li>
        <li>
          Payment was successfully deducted but the purchased service was not
          activated.
        </li>
        <li>A technical error caused an incorrect charge.</li>
        <li>
          GenusLab Technologies is unable to provide a paid service for a
          significant period.
        </li>
        <li>
          A payment was made for a service that GenusLab Technologies
          subsequently cancelled before the service commenced.
        </li>
        <li>
          Other exceptional circumstances are approved by GenusLab
          Technologies after review.
        </li>
      </ul>
    ),
  },
  {
    id: "duplicate-transactions",
    title: "Duplicate Transactions",
    icon: MdContentCopy,
    body: (
      <p>
        If you are charged multiple times for the same transaction, please
        contact our customer support team and provide your full name,
        registered email address or phone number, transaction reference,
        payment date, amount charged, and proof of payment. Verified
        duplicate transactions may be refunded to the original payment method
        where technically possible.
      </p>
    ),
  },
  {
    id: "failed-or-pending-transactions",
    title: "Failed or Pending Transactions",
    icon: MdHourglassEmpty,
    body: (
      <p>
        If your payment appears unsuccessful but your bank account or card
        has been charged, you should first allow sufficient time for the
        payment provider or financial institution to automatically reverse
        the transaction. Where the transaction remains unresolved, contact
        GenusLab Technologies customer support with your payment reference
        and proof of payment. GenusLab Technologies may work with its payment
        processing partners to investigate the transaction.
      </p>
    ),
  },
  {
    id: "digital-courses-and-academy-services",
    title: "Digital Courses and Academy Services",
    icon: MdSchool,
    body: (
      <>
        <p>
          Where a user purchases access to a digital course, class,
          educational programme, or other learning service, refunds may not
          normally be available after access to learning materials has been
          granted, the user has attended a class, the user has accessed
          course content, the programme has commenced, or a certificate or
          digital learning resource has been issued.
        </p>
        <p>
          Where GenusLab Technologies cancels a paid course or service
          entirely and no reasonable alternative is provided, affected users
          may be eligible for a refund or service credit.
        </p>
      </>
    ),
  },
  {
    id: "quiz-and-competition-payments",
    title: "Quiz and Competition Payments",
    icon: MdQuiz,
    body: (
      <p>
        Subscription payments do not constitute payment for guaranteed
        winnings. Users pay for access to the applicable GenusLab service and
        its features. Cash rewards, prizes, leaderboard rewards, referral
        rewards, studio competition rewards, and other promotional benefits
        are subject to eligibility criteria and competition rules. Failure to
        win a competition or reward does not qualify a user for a refund.
      </p>
    ),
  },
  {
    id: "referral-rewards",
    title: "Referral Rewards",
    icon: MdShare,
    body: (
      <p>
        Referral rewards are promotional benefits and are not refunds of
        subscription payments. Eligibility may depend on the referred person
        completing a qualifying transaction, the referrer maintaining an
        active account, compliance with referral programme rules, and
        verification that referrals are genuine and not fraudulent.
      </p>
    ),
  },
  {
    id: "incorrect-purchases",
    title: "Incorrect Purchases",
    icon: MdErrorOutline,
    body: (
      <p>
        Users are responsible for reviewing the relevant service, pricing,
        subscription period, and product information before completing
        payment. Refunds may not be provided solely because a user changed
        their mind, no longer wishes to use the platform, did not participate
        in available activities, failed to attend a scheduled class, failed
        to cancel a subscription before renewal where automatic renewal
        applies, or did not win a reward or competition.
      </p>
    ),
  },
  {
    id: "fraudulent-transactions",
    title: "Fraudulent Transactions",
    icon: MdSecurity,
    body: (
      <p>
        If you believe your payment method was used without your
        authorisation, contact your bank or card provider immediately. You
        should also notify GenusLab Technologies so that we can investigate
        the transaction and take appropriate steps concerning the relevant
        account.
      </p>
    ),
  },
  {
    id: "refund-processing-time",
    title: "Refund Processing Time",
    icon: MdSchedule,
    body: (
      <p>
        Where a refund is approved, processing times may depend on the
        payment provider, bank, card network, and payment method. GenusLab
        Technologies cannot guarantee the exact date on which refunded funds
        will appear in the customer's account after the refund has been
        submitted to the payment processor.
      </p>
    ),
  },
  {
    id: "payment-processing-fees",
    title: "Payment Processing Fees",
    icon: MdAccountBalanceWallet,
    body: (
      <p>
        Where permitted by applicable law and payment provider rules,
        transaction or processing fees already incurred may not always be
        refundable.
      </p>
    ),
  },
  {
    id: "how-to-request-a-refund",
    title: "How to Request a Refund",
    icon: MdSupportAgent,
    body: (
      <p>
        Refund requests should be submitted through our official customer
        support channels and should include full name, registered account
        details, transaction reference, date of payment, amount paid, reason
        for the refund request, and supporting evidence where applicable.
        GenusLab Technologies reserves the right to request additional
        information before approving a refund.
      </p>
    ),
  },
  {
    id: "refund-decisions",
    title: "Refund Decisions",
    icon: MdGavel,
    body: (
      <p>
        Refund requests are assessed individually. Submitting a refund
        request does not automatically guarantee approval. GenusLab
        Technologies will act reasonably and in accordance with applicable
        laws, payment processor requirements, and the circumstances of each
        transaction.
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="GenusLab Technologies · Website Policies"
      title="Refund Policy"
      dates="Effective Date: September 18, 2026 · Last Updated: September 18, 2026"
      intro="When and how refund requests are considered across GenusLab Academy, GenusLab Quiz, and every related service."
      heroImage="/images/doc.png"
      sections={sections}
    />
  );
}
