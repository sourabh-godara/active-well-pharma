import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | ActiveWell Pharma",
  description:
    "Privacy Policy of ActiveWell Pharma Private Limited describing how personal information is collected, used, stored, and protected.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-0">
        <header className="mb-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm font-medium uppercase tracking-wide text-gray-500">
            Last Updated: August 05, 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-[16px] leading-8 text-gray-700">
          {/* Introduction */}

          <section className="space-y-6">
            <p>
              This Privacy Policy explains how{" "}
              <strong className="font-semibold text-gray-900">
                ActiveWell Pharma Private Limited
              </strong>{" "}
              ("we," "us," or "our") collects, uses, stores, and protects your
              personal information when you visit or use our website{" "}
              <a
                href="https://www.activewellpharma.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                https://www.activewellpharma.com
              </a>{" "}
              (the "Services").
            </p>

            <p>
              If you do not agree with this policy, please do not use our
              Services. If you have questions, contact us at{" "}
              <a
                href="mailto:info@activewellpharma.com"
                className="font-medium text-blue-600 hover:underline"
              >
                info@activewellpharma.com
              </a>
              .
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 1. Information We Collect */}
          {/* ------------------------------------------------ */}

          <section
            id="information-we-collect"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              1. Information We Collect
            </h2>

            {/* Personal Information */}

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information You Provide
              </h3>

              <p>
                When you create an account, place an order, subscribe to our
                newsletter, or contact us, we may collect:
              </p>

              <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping address</li>
                <li>Password (stored in encrypted/hashed form)</li>
              </ul>
            </section>

            {/* Payment */}

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Payment Information
              </h3>

              <p>
                All payment processing is handled by our payment gateway
                partner, <strong>Razorpay</strong>. We do not store your card,
                UPI, or bank details on our servers.
              </p>

              <p>
                Razorpay's privacy practices are described at{" "}
                <a
                  href="https://razorpay.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  https://razorpay.com/privacy-policy/
                </a>
                .
              </p>
            </section>

            {/* Security Information */}

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Automatically Collected Information (Security)
              </h3>

              <p>
                When you visit our website, we automatically collect your{" "}
                <strong>IP address</strong>. This is used solely for:
              </p>

              <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
                <li>
                  Detecting and preventing abusive, fraudulent, or malicious
                  traffic
                </li>

                <li>
                  Rate-limiting excessive requests to protect our servers
                </li>

                <li>
                  Protecting against denial-of-service (DoS/DDoS) attacks
                </li>
              </ul>

              <p>
                IP address logs are retained only as long as necessary for these
                security purposes and are not used for advertising, profiling,
                or shared with marketing partners.
              </p>
            </section>

            {/* What We Do Not Collect */}

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                What We Do Not Collect
              </h3>

              <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
                <li>
                  We do <strong>not</strong> use social login (e.g. "Sign in
                  with Google" or Facebook)
                </li>

                <li>
                  We do <strong>not</strong> run Google Analytics, Meta Pixel,
                  or any third-party advertising/tracking pixels
                </li>

                <li>
                  We do <strong>not</strong> process sensitive personal
                  information (e.g. health records beyond what you voluntarily
                  disclose in customer support, religion, sexual orientation)
                </li>

                <li>
                  We do <strong>not</strong> collect information from
                  third-party data brokers
                </li>
              </ul>
            </section>
          </section>
          {/* ------------------------------------------------ */}
          {/* 2. How We Use Your Information */}
          {/* ------------------------------------------------ */}

          <section
            id="how-we-use-your-information"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              2. How We Use Your Information
            </h2>

            <p>We use the information we collect to:</p>

            <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
              <li>Create and manage your account</li>

              <li>
                Process, fulfill, and manage your orders, payments, returns,
                and exchanges
              </li>

              <li>
                Communicate with you about your orders, account, or support
                requests
              </li>

              <li>
                Send you marketing/promotional emails (only if you've opted in
                — you can unsubscribe anytime)
              </li>

              <li>
                Maintain the security and integrity of our website (including
                IP-based rate-limiting, as above)
              </li>

              <li>
                Comply with applicable Indian laws, including tax and
                accounting requirements
              </li>
            </ul>
          </section>

          {/* ------------------------------------------------ */}
          {/* 3. Cookies and Similar Technologies */}
          {/* ------------------------------------------------ */}

          <section
            id="cookies"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              3. Cookies and Similar Technologies
            </h2>

            <p>
              We use only <strong>strictly necessary cookies</strong> required
              for core site functionality, such as:
            </p>

            <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
              <li>Keeping you logged into your account</li>

              <li>Maintaining your shopping cart contents</li>
            </ul>

            <p>
              We do not currently use analytics or advertising cookies. If this
              changes in the future (for example, if we begin using Google
              Analytics or an ad pixel), we will update this policy and, where
              required by law, request your consent first.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 4. When and With Whom We Share Your Information */}
          {/* ------------------------------------------------ */}

          <section
            id="information-sharing"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              4. When and With Whom We Share Your Information
            </h2>

            <p>We may share your information with:</p>

            <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
              <li>
                <strong>Razorpay</strong>, to process payments
              </li>

              <li>
                <strong>Shipping/logistics partners</strong>, to deliver your
                orders
              </li>

              <li>
                <strong>Law enforcement or regulators</strong>, where required
                by applicable law
              </li>

              <li>
                A successor entity, in the event of a merger, acquisition, or
                sale of business assets
              </li>
            </ul>

            <p>
              We do <strong>not</strong> sell your personal information to third
              parties.
            </p>
          </section>
          {/* ------------------------------------------------ */}
          {/* 5. How Long We Keep Your Information */}
          {/* ------------------------------------------------ */}

          <section
            id="data-retention"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              5. How Long We Keep Your Information
            </h2>

            <p>
              We retain your personal information only as long as necessary to
              fulfill the purposes described in this policy, or as required by
              law (e.g., tax/accounting records). Security-related IP logs are
              retained for a limited period (typically 30–90 days) before being
              deleted or anonymized.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 6. How We Keep Your Information Safe */}
          {/* ------------------------------------------------ */}

          <section
            id="security"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              6. How We Keep Your Information Safe
            </h2>

            <p>
              We use reasonable technical and organizational measures to protect
              your personal information. However, no method of transmission over
              the internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 7. Children's Privacy */}
          {/* ------------------------------------------------ */}

          <section
            id="children-privacy"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              7. Children's Privacy
            </h2>

            <p>
              Our Services are not directed at children under 18. We do not
              knowingly collect personal information from anyone under 18. If we
              learn we have inadvertently done so, we will delete that
              information promptly.
            </p>

            <p>
              If you believe a child has provided us with personal data, please
              contact us at{" "}
              <a
                href="mailto:info@activewellpharma.com"
                className="font-medium text-blue-600 transition-colors hover:underline"
              >
                info@activewellpharma.com
              </a>
              .
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 8. Your Privacy Rights */}
          {/* ------------------------------------------------ */}

          <section
            id="privacy-rights"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              8. Your Privacy Rights
            </h2>

            <p>
              Depending on applicable law, you may have the right to:
            </p>

            <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
              <li>
                Access the personal information we hold about you
              </li>

              <li>
                Correct inaccurate information
              </li>

              <li>
                Request deletion of your information
              </li>

              <li>
                Withdraw consent (e.g., unsubscribe from marketing emails)
              </li>
            </ul>

            <p>
              To exercise these rights, email us at{" "}
              <a
                href="mailto:info@activewellpharma.com"
                className="font-medium text-blue-600 transition-colors hover:underline"
              >
                info@activewellpharma.com
              </a>
              .
            </p>
          </section>
          {/* ------------------------------------------------ */}
          {/* 9. Do-Not-Track Signals */}
          {/* ------------------------------------------------ */}

          <section
            id="do-not-track"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              9. Do-Not-Track Signals
            </h2>

            <p>
              We do not currently respond to browser Do-Not-Track (DNT) signals,
              as no uniform industry standard for DNT exists yet.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 10. Updates to This Policy */}
          {/* ------------------------------------------------ */}

          <section
            id="policy-updates"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              10. Updates to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be indicated by an updated{" "}
              <strong>"Last updated"</strong> date at the top of this page.
            </p>
          </section>

          {/* ------------------------------------------------ */}
          {/* 11. Contact Us */}
          {/* ------------------------------------------------ */}

          <section
            id="contact"
            className="space-y-8 border-t border-gray-200 pt-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              11. Contact Us
            </h2>

            <address className="not-italic leading-8 text-gray-700">
              <strong className="font-semibold text-gray-900">
                ActiveWell Pharma Private Limited
              </strong>

              <br />

              Saili Kullian, Near Kabir Mandir

              <br />

              Pathankot, Tehsil Distt. Pathankot

              <br />

              Punjab 145001, India

              <br />
              <br />

              <span className="font-medium text-gray-900">Email:</span>{" "}
              <a
                href="mailto:info@activewellpharma.com"
                className="font-medium text-blue-600 transition-colors hover:underline"
              >
                info@activewellpharma.com
              </a>
            </address>
          </section>

          {/* ------------------------------------------------ */}
          {/* Footer */}
          {/* ------------------------------------------------ */}

          <footer className="border-t border-gray-200 pt-10 text-center text-sm text-gray-500">
            <p>
              © 2026 ActiveWell Pharma Private Limited. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}