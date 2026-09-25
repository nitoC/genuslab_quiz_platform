"use client";

import PolicyLayout, { PolicySection } from "@/components/legal/PolicyLayout";
import {
  MdInfoOutline,
  MdPersonOutline,
  MdVerifiedUser,
  MdGroup,
  MdWorkspacePremium,
  MdCreditCard,
  MdPayment,
  MdReceiptLong,
  MdQuiz,
  MdFactCheck,
  MdLeaderboard,
  MdEmojiEvents,
  MdHowToReg,
  MdRepeat,
  MdWarningAmber,
  MdSchool,
  MdVerified,
  MdGavel,
  MdShield,
  MdCopyright,
  MdUpload,
  MdPrivacyTip,
  MdMailOutline,
  MdExtension,
  MdCloudQueue,
  MdHistory,
  MdBlock,
  MdCancel,
  MdReportProblem,
  MdBalance,
  MdGppMaybe,
  MdSystemUpdateAlt,
  MdPublic,
  MdForum,
  MdCallSplit,
  MdDescription,
} from "react-icons/md";

const sections: PolicySection[] = [
  {
    id: "introduction",
    title: "About Genuslab Academy",
    icon: MdInfoOutline,
    body: (
      <>
        <p>
          These Terms and Conditions ("Terms") govern your access to and use of
          the Genuslab Academy website, mobile application, quiz platform,
          digital learning services, referral programme, competitions, rewards,
          subscriptions, and related services provided by Genuslab Technologies
          ("Genuslab", "we", "us", or "our").
        </p>
        <p>
          By creating an account, accessing the platform, purchasing a
          subscription, participating in quizzes or competitions, using referral
          features, or otherwise using Genuslab Academy, you agree to be bound
          by these Terms. If you do not agree with these Terms, you should not
          create an account or use the platform.
        </p>
        <p>
          Genuslab Academy is a digital learning and knowledge platform operated
          by Genuslab Technologies. The platform may provide services including
          educational quizzes and knowledge challenges; live and scheduled quiz
          competitions; technology and digital-skills training; online classes;
          practical projects and assignments; certificates where applicable;
          premium subscriptions; leaderboards; referral programmes; promotional
          campaigns; airtime, cash, or other rewards; educational content;
          community activities; and other technology-related products and
          services introduced by Genuslab from time to time. Features may be
          added, modified, suspended, or discontinued as the platform develops.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    icon: MdVerifiedUser,
    body: (
      <p>
        You must provide accurate and truthful information when creating an
        account. Where age restrictions apply to particular competitions,
        payment services, courses, or other features, users must satisfy the
        applicable eligibility requirements. Users who are minors may be
        required to obtain permission from a parent or legal guardian before
        using certain paid or competitive features. We reserve the right to
        request reasonable information necessary to verify a user's identity,
        age, eligibility, payment information, or entitlement to receive a
        reward.
      </p>
    ),
  },
  {
    id: "account-registration",
    title: "Account Registration",
    icon: MdPersonOutline,
    body: (
      <>
        <p>
          To use certain features, you may be required to create an account and
          provide information such as your full name, email address, telephone
          number, date of birth, gender, password, referral code, how you heard
          about Genuslab, and other information reasonably required to provide
          our services.
        </p>
        <p>
          You agree that all information you provide will be accurate, complete,
          and current. You are responsible for maintaining the confidentiality
          and security of your login credentials and must notify Genuslab
          promptly if you believe your account has been compromised or accessed
          without authorization.
        </p>
      </>
    ),
  },
  {
    id: "one-account-per-user",
    title: "One Account Per User",
    icon: MdGroup,
    body: (
      <p>
        Unless expressly permitted by Genuslab, each individual should maintain
        only one personal account. Creating multiple accounts for the purpose of
        obtaining additional rewards, manipulating leaderboards, generating
        artificial referrals, entering competitions multiple times, bypassing
        restrictions, or otherwise gaining an unfair advantage may result in
        disqualification, suspension, cancellation of rewards, or termination of
        the relevant accounts.
      </p>
    ),
  },
  {
    id: "premium-membership",
    title: "Premium Membership",
    icon: MdWorkspacePremium,
    body: (
      <p>
        Certain features of Genuslab Academy may only be available to Premium
        Members. Premium benefits may include access to competitive quizzes,
        rewards, premium educational content, online classes, referral rewards,
        advanced platform features, and other benefits displayed on the
        platform. The benefits attached to a subscription may change over time.
        Current subscription pricing and included benefits will be displayed on
        the relevant payment or subscription page.
      </p>
    ),
  },
  {
    id: "subscription-fees",
    title: "Subscription Fees",
    icon: MdCreditCard,
    body: (
      <p>
        Where Genuslab Academy offers a recurring subscription, users authorize
        the applicable payment provider to process the relevant subscription
        payment in accordance with the payment method selected. The current
        subscription price will be shown before payment is completed. Unless
        stated otherwise, subscription payments grant access for the
        subscription period displayed at the time of purchase. Users are
        responsible for ensuring that their payment information is valid.
        Failure to renew a subscription may result in the loss or suspension of
        Premium Member benefits.
      </p>
    ),
  },
  {
    id: "payment-processing",
    title: "Payment Processing",
    icon: MdPayment,
    body: (
      <p>
        Payments may be processed through third-party payment providers such as
        Flutterwave or other approved processors. Genuslab does not necessarily
        store complete payment-card information. Payment transactions may also
        be subject to the payment processor's own terms, privacy policies,
        security procedures, and processing requirements. Users are responsible
        for any fees imposed by their bank, payment provider, mobile network, or
        financial institution.
      </p>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    icon: MdReceiptLong,
    body: (
      <p>
        Subscription fees and other payments will be handled in accordance with
        the Genuslab Refund Policy. Where a refund is legally required or
        approved by Genuslab, the refund may be processed through the original
        payment method or another reasonable method determined by Genuslab.
        Participation in a quiz or competition does not guarantee that a user
        will receive a reward.
      </p>
    ),
  },
  {
    id: "quizzes-and-competitions",
    title: "Quizzes and Competitions",
    icon: MdQuiz,
    body: (
      <p>
        Genuslab may organize daily quizzes, weekly competitions, monthly
        competitions, live quizzes, Fast Fingers competitions, knowledge
        challenges, promotional contests, and other competitions. Each
        competition may have additional rules displayed before or during the
        competition. By participating, users agree to comply with both these
        Terms and any competition-specific rules.
      </p>
    ),
  },
  {
    id: "quiz-results",
    title: "Quiz Results",
    icon: MdFactCheck,
    body: (
      <p>
        Quiz results may be determined using factors such as the number of
        correct answers, total score, response speed, completion time,
        eligibility status, subscription status, compliance with competition
        rules, and other criteria disclosed for a particular competition. Where
        technology is used to determine results, reasonable technical records
        from the platform may be used to verify participation and rankings.
      </p>
    ),
  },
  {
    id: "leaderboards",
    title: "Leaderboards",
    icon: MdLeaderboard,
    body: (
      <p>
        Genuslab may publish usernames, profile names, scores, rankings,
        achievements, or similar information on public or community
        leaderboards. Users acknowledge that competitive participation may
        involve the publication of such information. Genuslab may correct
        leaderboard errors, duplicate accounts, scoring issues, fraudulent
        activity, or technical inaccuracies.
      </p>
    ),
  },
  {
    id: "rewards-and-prizes",
    title: "Rewards and Prizes",
    icon: MdEmojiEvents,
    body: (
      <p>
        Rewards may include cash, airtime, subscription benefits, educational
        opportunities, certificates, promotional prizes, merchandise, or other
        incentives. The availability, amount, eligibility requirements, and
        payment method for each reward may vary. A displayed reward does not
        create an unconditional entitlement until all eligibility requirements
        have been verified.
      </p>
    ),
  },
  {
    id: "reward-verification",
    title: "Reward Verification",
    icon: MdHowToReg,
    body: (
      <p>
        Before issuing a substantial reward, Genuslab may reasonably verify the
        user's identity, account ownership, subscription status, referral
        authenticity, quiz participation, compliance with competition rules, and
        payment or withdrawal details. Where fraud, manipulation, duplicate
        accounts, automated participation, or other abuse is suspected, payment
        may be delayed while the matter is reviewed.
      </p>
    ),
  },
  {
    id: "referral-programme",
    title: "Referral Programme",
    icon: MdGroup,
    body: (
      <p>
        Genuslab may provide users with unique referral links or codes. Referral
        rewards are only payable for qualifying referrals under the applicable
        referral rules. A qualifying referral may require the referred person to
        register using the correct referral link or code, become a Premium
        Member, successfully complete payment, maintain an eligible account, and
        meet any other conditions disclosed by Genuslab. Self-referrals, fake
        accounts, duplicate accounts, bot-generated registrations, or
        manipulated referrals are prohibited.
      </p>
    ),
  },
  {
    id: "recurring-referral-rewards",
    title: "Recurring Referral Rewards",
    icon: MdRepeat,
    body: (
      <p>
        Where Genuslab offers recurring referral rewards, the applicable amount
        and eligibility conditions will be displayed on the platform. Recurring
        rewards may depend on both the referrer and referred user remaining
        eligible. If the referrer becomes inactive for the period specified in
        the referral programme rules, recurring referral benefits may be
        suspended or forfeited. Referral programme terms may be modified for
        future referrals where commercially or operationally necessary.
      </p>
    ),
  },
  {
    id: "no-guaranteed-earnings",
    title: "No Guaranteed Earnings",
    icon: MdWarningAmber,
    body: (
      <p>
        Genuslab does not guarantee that users will earn money through the
        platform. Any earnings depend on factors such as eligibility, quiz
        performance, referrals, competition results, active subscription status,
        promotional conditions, and compliance with platform rules. The platform
        should not be interpreted as an investment product, savings product,
        employment arrangement, or guaranteed income opportunity.
      </p>
    ),
  },
  {
    id: "genuslab-academy-courses",
    title: "Genuslab Academy Courses",
    icon: MdSchool,
    body: (
      <p>
        Educational services may include live online classes, recorded learning
        materials, assignments, practical projects, assessments, mentorship,
        certificates, and other educational activities. Class times, tutors,
        curricula, delivery methods, and course availability may change where
        reasonably necessary.
      </p>
    ),
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: MdVerified,
    body: (
      <p>
        Certificates may be issued to users who successfully complete applicable
        course requirements. Requirements may include attendance, completion of
        assignments, successful assessments, satisfactory participation,
        completion of projects, and payment of applicable fees. Genuslab does
        not represent that every certificate is equivalent to an academic
        degree, government-issued qualification, or professional licence unless
        expressly stated.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    icon: MdGavel,
    body: (
      <p>
        Users must not cheat in quizzes or competitions; use bots, scripts,
        automation, or unauthorized software; manipulate scores or leaderboards;
        create fraudulent accounts; impersonate another person; misuse referral
        systems; attempt unauthorized access to the platform; interfere with
        servers or platform infrastructure; reverse-engineer protected platform
        systems where prohibited by law; upload malicious software; harass other
        users; submit unlawful, threatening, abusive, defamatory, or fraudulent
        content; exploit platform vulnerabilities; or use Genuslab for unlawful
        purposes.
      </p>
    ),
  },
  {
    id: "fraud-and-abuse",
    title: "Fraud and Abuse",
    icon: MdShield,
    body: (
      <p>
        Where there is reasonable evidence of fraud or manipulation, Genuslab
        may investigate the account, temporarily suspend access, remove
        fraudulent referrals, adjust incorrect leaderboard scores, withhold
        improperly obtained rewards, terminate the account, or report suspected
        criminal activity to appropriate authorities where required.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: MdCopyright,
    body: (
      <p>
        All Genuslab intellectual property remains the property of Genuslab
        Technologies or its applicable licensors. This may include logos,
        trademarks, branding, website design, application interfaces,
        educational materials, quiz questions, videos, graphics, software,
        databases, source code, written materials, course structures, and
        proprietary technology. Users may not reproduce, sell, distribute,
        modify, commercially exploit, or republish protected Genuslab content
        without written authorization.
      </p>
    ),
  },
  {
    id: "user-content",
    title: "User Content",
    icon: MdUpload,
    body: (
      <p>
        Where users upload profile photographs, comments, answers, assignments,
        reviews, or other materials, users retain ownership of their original
        content subject to applicable law. By submitting content to the
        platform, users grant Genuslab a reasonable licence to store, process,
        display, and use the content insofar as necessary to operate and provide
        the service. Users must not upload content that infringes third-party
        intellectual-property, privacy, or other legal rights.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: MdPrivacyTip,
    body: (
      <p>
        Personal information will be handled in accordance with the Genuslab
        Privacy Policy and applicable data-protection laws. By using the
        platform, users acknowledge that certain personal information may be
        processed for purposes including account management, identity
        verification, payments, subscriptions, fraud prevention, customer
        support, competitions, rewards, referrals, learning services, analytics,
        and platform security.
      </p>
    ),
  },
  {
    id: "communications",
    title: "Communications",
    icon: MdMailOutline,
    body: (
      <p>
        By creating an account, users may receive service-related communications
        concerning account activity, payments, subscriptions, quiz
        notifications, rewards, security, classes, service updates, and customer
        support. Marketing communications will be handled in accordance with
        applicable law and the user's communication preferences.
      </p>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    icon: MdExtension,
    body: (
      <p>
        Genuslab may integrate services provided by third parties, including
        payment processors, cloud-service providers, video-conferencing
        providers, email providers, analytics providers, authentication
        providers, and social-media platforms. Genuslab is not responsible for
        independent services operated by third parties beyond the extent
        required by applicable law.
      </p>
    ),
  },
  {
    id: "platform-availability",
    title: "Platform Availability",
    icon: MdCloudQueue,
    body: (
      <p>
        We aim to maintain reliable platform availability, but uninterrupted
        service cannot be guaranteed. Access may occasionally be affected by
        maintenance, server outages, internet failures, software updates, cyber
        incidents, payment-provider outages, telecommunications failures, or
        circumstances outside our reasonable control. Where a technical issue
        materially affects a competition or transaction, Genuslab may
        investigate and take reasonable corrective action.
      </p>
    ),
  },
  {
    id: "changes-to-the-platform",
    title: "Changes to the Platform",
    icon: MdSystemUpdateAlt,
    body: (
      <p>
        Genuslab may modify platform features as the service evolves. This can
        include changes to quizzes, course offerings, subscription benefits,
        leaderboards, referral programmes, rewards, interfaces, and technical
        functionality. Material changes affecting existing paid services should
        be communicated where reasonably appropriate.
      </p>
    ),
  },
  {
    id: "suspension-and-termination",
    title: "Suspension and Termination",
    icon: MdBlock,
    body: (
      <p>
        Genuslab may suspend or terminate an account where a user breaches these
        Terms, engages in fraud, abuses the referral system, manipulates
        quizzes, attempts unauthorized access, threatens platform security,
        repeatedly violates community standards, or uses the service unlawfully.
        Where appropriate, Genuslab may provide notice or an opportunity to
        clarify the situation.
      </p>
    ),
  },
  {
    id: "account-closure",
    title: "User Account Closure",
    icon: MdCancel,
    body: (
      <p>
        Users may request the closure of their account by contacting Genuslab
        through the designated customer-support channels. Certain records may be
        retained where required for legal obligations, accounting, fraud
        prevention, payment disputes, regulatory compliance, or legitimate
        business purposes permitted by law.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    icon: MdReportProblem,
    body: (
      <p>
        Genuslab Academy is designed for educational, entertainment,
        skills-development, and competitive purposes. While we aim to provide
        accurate and useful educational content, we do not guarantee that every
        piece of content will always be error-free or suitable for every
        professional, academic, or commercial purpose. Users remain responsible
        for decisions they make based on information learned through the
        platform.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: MdBalance,
    body: (
      <p>
        To the maximum extent permitted by applicable law, Genuslab will not be
        liable for indirect, incidental, consequential, or special losses
        arising from use of the platform. Nothing in these Terms excludes or
        limits liability that cannot legally be excluded under applicable law.
      </p>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    icon: MdGppMaybe,
    body: (
      <p>
        To the extent permitted by law, users agree to be responsible for losses
        or claims resulting from their unlawful use of the platform,
        infringement of third-party rights, fraudulent activities, or material
        breach of these Terms.
      </p>
    ),
  },
  {
    id: "changes-to-these-terms",
    title: "Changes to These Terms",
    icon: MdHistory,
    body: (
      <p>
        We may update these Terms periodically to reflect new services, changes
        in law, regulatory requirements, platform developments, security
        requirements, or operational changes. The updated effective date will be
        displayed at the top of this document. Where changes are material,
        reasonable notice may be provided through the platform or other
        available communication channels.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: MdPublic,
    body: (
      <p>
        These Terms shall be governed by the applicable laws of the Federal
        Republic of Nigeria, subject to any mandatory consumer or other legal
        rights that may apply to users in another jurisdiction.
      </p>
    ),
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
    icon: MdForum,
    body: (
      <p>
        Users should first contact Genuslab customer support regarding any
        dispute so that the matter can be reviewed and, where possible, resolved
        informally. If the dispute cannot be resolved informally, it may be
        handled through an appropriate court, mediation, arbitration, or other
        dispute-resolution process as permitted by applicable Nigerian law.
      </p>
    ),
  },
  {
    id: "severability",
    title: "Severability",
    icon: MdCallSplit,
    body: (
      <p>
        If any provision of these Terms is found to be invalid or unenforceable,
        the remaining provisions will continue in effect to the extent permitted
        by law.
      </p>
    ),
  },
  {
    id: "entire-agreement",
    title: "Entire Agreement",
    icon: MdDescription,
    body: (
      <p>
        These Terms, together with the Privacy Policy, Refund Policy,
        competition rules, subscription terms, and any other policies expressly
        incorporated into them, constitute the agreement governing use of
        Genuslab Academy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: MdMailOutline,
    body: (
      <p>
        For questions, complaints, payment issues, account issues, or enquiries
        regarding these Terms, contact Genuslab Technologies, Genuslab Academy,
        Abuja, Nigeria. Website:{" "}
        <a href="https://genuslabacademy.com" className="font-medium text-blue">
          genuslabacademy.com
        </a>{" "}
        · Email:{" "}
        <a
          href="mailto:support@genuslabtechnologies.com"
          className="font-medium text-blue"
        >
          support@genuslabtechnologies.com
        </a>
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      eyebrow="Genuslab Technologies · Website Policies"
      title="Terms & Conditions"
      dates="Last Updated: September 23, 2026"
      intro="The rules that govern Genuslab Academy, Genuslab Quiz, subscriptions, referrals, and every competition in between."
      heroImage="/images/doc.png"
      sections={sections}
    />
  );
}
