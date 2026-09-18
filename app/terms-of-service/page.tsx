"use client";

import PolicyLayout, { PolicySection } from "@/components/legal/PolicyLayout";
import {
  MdInfoOutline,
  MdPersonOutline,
  MdVerifiedUser,
  MdCreditCard,
  MdReceiptLong,
  MdQuiz,
  MdEmojiEvents,
  MdWarningAmber,
  MdVideocam,
  MdLeaderboard,
  MdGroupAdd,
  MdSchool,
  MdEventAvailable,
  MdWorkspacePremium,
  MdGavel,
  MdShield,
  MdCopyright,
  MdUpload,
  MdCloudQueue,
  MdBugReport,
  MdBlock,
  MdBalance,
  MdExtension,
  MdHistory,
  MdPublic,
  MdMailOutline,
} from "react-icons/md";

const sections: PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: MdInfoOutline,
    body: (
      <p>
        These Terms and Conditions govern your access to and use of GenusLab
        Technologies websites, applications, services, GenusLab Academy,
        GenusLab Quiz, competitions, subscriptions, referral programmes,
        promotions, digital products, and related services. By registering,
        subscribing, accessing, or using any GenusLab Technologies service,
        you agree to comply with these Terms and Conditions.
      </p>
    ),
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    icon: MdPersonOutline,
    body: (
      <>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Provide accurate registration information.</li>
          <li>Keep account information up to date.</li>
          <li>Protect login credentials.</li>
          <li>Prevent unauthorised access.</li>
          <li>Immediately report suspected account compromise.</li>
        </ul>
        <p>
          Users must not impersonate another individual or create accounts
          using fraudulent information.
        </p>
      </>
    ),
  },
  {
    id: "account-eligibility",
    title: "Account Eligibility",
    icon: MdVerifiedUser,
    body: (
      <p>
        Users must meet any applicable age, legal, regulatory, payment, and
        geographic eligibility requirements associated with a particular
        service. GenusLab Technologies may request additional verification
        before allowing access to certain services, payments, rewards, or
        competitions.
      </p>
    ),
  },
  {
    id: "subscriptions-and-payments",
    title: "Subscriptions and Payments",
    icon: MdCreditCard,
    body: (
      <>
        <p>
          Some GenusLab services may require a paid subscription.
          Subscription prices will be displayed before payment. Subscriptions
          may provide access to premium quiz features, Academy resources,
          competitions, learning materials, premium account functions,
          referral programmes, reward opportunities, and other digital
          services. Specific benefits may change as the platform evolves.
        </p>
        <p>
          Subscription access applies for the period communicated at the
          time of purchase. Where automatic renewal is introduced or used,
          users will be informed in accordance with applicable requirements.
          Payments may be processed through third-party providers, and users
          authorise the relevant processor to complete transactions using
          the information they provide.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    icon: MdReceiptLong,
    body: (
      <>
        <p>
          Because digital access may begin immediately after payment,
          subscription payments are generally non-refundable once access has
          been successfully activated and used. GenusLab Technologies may
          consider a refund request where:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>A user was charged more than once for the same transaction.</li>
          <li>
            Payment was successfully deducted but the purchased service was
            not activated.
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
        <p>
          If you are charged multiple times for the same transaction, or a
          payment appears unsuccessful despite being deducted, contact our
          customer support team with your full name, registered account
          details, transaction reference, payment date, amount charged, and
          proof of payment. GenusLab Technologies may work with its payment
          processing partners to investigate the transaction.
        </p>
        <p>
          Refunds may not normally be available for a course or learning
          service once access to materials has been granted, a class has
          been attended, the programme has commenced, or a certificate has
          been issued — unless GenusLab Technologies cancels the paid course
          or service entirely with no reasonable alternative provided.
        </p>
        <p>
          Subscription payments do not constitute payment for guaranteed
          winnings. Cash rewards, prizes, leaderboard rewards, referral
          rewards, and studio competition rewards are subject to eligibility
          criteria and competition rules — failure to win a competition or
          reward does not qualify a user for a refund. Refunds are also not
          provided solely because a user changed their mind, no longer
          wishes to use the platform, did not participate in available
          activities, or did not cancel a subscription before renewal where
          automatic renewal applies.
        </p>
        <p>
          Where a refund is approved, processing times depend on the payment
          provider, bank, card network, and payment method, and transaction
          or processing fees already incurred may not always be refundable.
          Refund requests are assessed individually and submitting a request
          does not automatically guarantee approval.
        </p>
      </>
    ),
  },
  {
    id: "genuslab-quiz",
    title: "GenusLab Quiz",
    icon: MdQuiz,
    body: (
      <p>
        GenusLab Quiz may provide users with opportunities to answer
        questions, earn points, compete on leaderboards, participate in
        episodes, and qualify for rewards. Competition rules may include
        eligibility requirements, time limits, ranking rules, scoring rules,
        reward amounts, competition periods, verification requirements, and
        disqualification rules. Users must follow the rules communicated for
        each competition.
      </p>
    ),
  },
  {
    id: "rewards",
    title: "Daily, Weekly and Monthly Rewards",
    icon: MdEmojiEvents,
    body: (
      <>
        <p>
          Where GenusLab offers cash or promotional rewards, eligibility may
          depend on user performance and compliance with applicable
          competition rules. Examples may include episode rewards, daily
          rewards, weekly rewards, monthly rewards, studio competition
          prizes, referral rewards, promotional rewards, and airtime
          rewards.
        </p>
        <p>
          The availability and value of rewards may be changed for future
          competitions or promotions. Any change will not affect rewards
          already validly earned and confirmed unless fraud, technical
          error, rule violation, or another legitimate reason requires
          review.
        </p>
      </>
    ),
  },
  {
    id: "no-guaranteed-earnings",
    title: "No Guaranteed Earnings",
    icon: MdWarningAmber,
    body: (
      <p>
        GenusLab Technologies does not guarantee that any user will earn
        money or win a prize. Participation in the platform does not create
        a guaranteed source of income. Results may depend on user knowledge,
        quiz performance, speed, ranking, participation, eligibility, and
        compliance with applicable rules.
      </p>
    ),
  },
  {
    id: "studio-quiz-competition",
    title: "Studio Quiz Competition",
    icon: MdVideocam,
    body: (
      <p>
        Where monthly winners or other qualifying users are invited to
        participate in a studio competition, qualification does not
        automatically guarantee that the participant will win the final
        prize. Additional competition rules may apply, including identity
        verification, qualification checks, attendance requirements, time
        limits, studio rules, and reasonable media or recording requirements
        where applicable.
      </p>
    ),
  },
  {
    id: "leaderboards",
    title: "Leaderboards",
    icon: MdLeaderboard,
    body: (
      <p>
        Leaderboard results may be calculated based on criteria communicated
        for the applicable competition. GenusLab Technologies may
        investigate unusual results, system errors, fraudulent activity,
        duplicated accounts, automated participation, or manipulation before
        confirming winners. A displayed leaderboard may remain provisional
        until verification has been completed.
      </p>
    ),
  },
  {
    id: "referral-programme",
    title: "Referral Programme",
    icon: MdGroupAdd,
    body: (
      <p>
        Eligible users may receive referral rewards for introducing new
        qualifying users to GenusLab. Programme rules may specify reward
        amounts, qualifying transactions, active subscription requirements,
        renewal requirements, inactivity rules, withdrawal requirements, and
        fraud prevention conditions. Rewards may be cancelled where referral
        activity involves fake accounts, self-referrals using multiple
        accounts, automated accounts, payment fraud, misleading promotions,
        or manipulation of referral systems.
      </p>
    ),
  },
  {
    id: "genuslab-academy",
    title: "GenusLab Academy",
    icon: MdSchool,
    body: (
      <p>
        GenusLab Academy provides educational programmes and practical
        digital skills training. Courses may include live classes, recorded
        materials, projects, assignments, assessments, tutor support,
        learning resources, and certificates. Course structure, instructors,
        schedules, and content may be changed where reasonably necessary.
      </p>
    ),
  },
  {
    id: "attendance",
    title: "Attendance and Participation",
    icon: MdEventAvailable,
    body: (
      <p>
        Students are responsible for attending scheduled classes, completing
        assignments, participating appropriately, meeting course
        requirements, and maintaining respectful behaviour. GenusLab
        Technologies cannot guarantee that completing a course will result
        in employment, income, promotion, or any specific professional
        outcome.
      </p>
    ),
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: MdWorkspacePremium,
    body: (
      <p>
        Certificates may be awarded where users successfully meet the
        applicable course requirements. GenusLab Technologies may refuse or
        revoke a certificate where it was obtained through fraud,
        impersonation, academic misconduct, falsified information, or system
        manipulation.
      </p>
    ),
  },
  {
    id: "user-conduct",
    title: "User Conduct",
    icon: MdGavel,
    body: (
      <>
        <p>
          Users must not engage in any of the following while using GenusLab
          services:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Commit fraud.</li>
          <li>Harass other users.</li>
          <li>Spread malicious software.</li>
          <li>Manipulate competition results.</li>
          <li>Abuse referral systems.</li>
          <li>Create multiple accounts for improper advantage.</li>
          <li>Attempt unauthorised access.</li>
          <li>Interfere with platform infrastructure.</li>
          <li>Use bots or automated tools where prohibited.</li>
          <li>Copy proprietary materials without permission.</li>
          <li>Engage in illegal activity.</li>
        </ul>
      </>
    ),
  },
  {
    id: "fraud-and-abuse",
    title: "Fraud and Abuse",
    icon: MdShield,
    body: (
      <p>
        GenusLab Technologies may investigate suspicious activity. Where
        fraud, abuse, manipulation, or violation of competition rules is
        reasonably suspected, GenusLab may temporarily restrict an account,
        suspend rewards, require verification, cancel fraudulent rewards,
        disqualify a participant, or suspend or terminate an account. Any
        such action should be based on reasonable grounds and applicable
        rules.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: MdCopyright,
    body: (
      <p>
        All intellectual property associated with GenusLab Technologies may
        include branding, logos, software, application interfaces, website
        content, course materials, quiz questions, graphics, videos,
        designs, source code, training materials, and business content. Such
        materials may be owned by GenusLab Technologies or licensed to it.
        Users may not copy, reproduce, distribute, sell, modify, or
        commercially exploit protected content without appropriate
        permission.
      </p>
    ),
  },
  {
    id: "user-content",
    title: "User Content",
    icon: MdUpload,
    body: (
      <p>
        Where users submit content to the platform, including profile
        information, comments, assignments, projects, photographs, or other
        materials, users remain responsible for ensuring they have the right
        to submit that content. Users must not upload unlawful, infringing,
        abusive, or harmful content.
      </p>
    ),
  },
  {
    id: "service-availability",
    title: "Service Availability",
    icon: MdCloudQueue,
    body: (
      <p>
        GenusLab Technologies aims to provide reliable access to its
        platforms. Temporary interruptions may occur because of maintenance,
        Internet outages, server failures, third-party service failures,
        security updates, infrastructure upgrades, or circumstances outside
        reasonable control. GenusLab Technologies does not guarantee
        uninterrupted availability at all times.
      </p>
    ),
  },
  {
    id: "technical-errors",
    title: "Technical Errors in Competitions",
    icon: MdBugReport,
    body: (
      <p>
        Where a technical error materially affects a competition, GenusLab
        Technologies may take reasonable corrective action, including
        recalculating results, correcting scoring errors, re-running an
        affected activity, cancelling invalid results, or providing another
        reasonable remedy.
      </p>
    ),
  },
  {
    id: "suspension-termination",
    title: "Suspension and Termination",
    icon: MdBlock,
    body: (
      <p>
        GenusLab Technologies may suspend or terminate accounts where users
        materially violate these Terms, including for fraud, security
        threats, illegal activities, repeated abuse, serious competition
        manipulation, unauthorised system access, non-payment, or misuse of
        GenusLab intellectual property.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: MdBalance,
    body: (
      <p>
        To the maximum extent permitted by applicable law, GenusLab
        Technologies will not be responsible for indirect or consequential
        losses resulting from circumstances reasonably outside its control.
        Nothing in these Terms is intended to exclude rights or liabilities
        that cannot legally be excluded.
      </p>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    icon: MdExtension,
    body: (
      <p>
        Our platforms may integrate with third-party services, including
        payment processors, video conferencing platforms, cloud providers,
        communication platforms, and social media platforms. Third-party
        services are governed by their own terms and policies.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to Services and Terms",
    icon: MdHistory,
    body: (
      <p>
        GenusLab Technologies may improve, modify, replace, or discontinue
        certain platform features over time. Where a material change affects
        an active paid service, GenusLab Technologies will take reasonable
        steps to communicate relevant changes. These Terms may also be
        updated periodically and published on the GenusLab Technologies
        website.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: MdPublic,
    body: (
      <p>
        These Terms will be governed by the laws applicable to the legal
        entity operating GenusLab Technologies, subject to any mandatory
        consumer protection or other laws that apply to the user.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: MdMailOutline,
    body: (
      <p>
        Questions, complaints, payment enquiries, refund requests, or
        support requests should be submitted through the official contact
        information displayed on the GenusLab Technologies website.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      eyebrow="GenusLab Technologies · Website Policies"
      title="Terms & Conditions"
      dates="Effective Date: September 18, 2026 · Last Updated: September 18, 2026"
      intro="The rules that govern GenusLab Academy, GenusLab Quiz, subscriptions, referrals, and every competition in between."
      heroImage="/images/doc.png"
      sections={sections}
    />
  );
}
