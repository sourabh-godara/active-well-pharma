import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Terms & Conditions | ActiveWell Pharma",
    description:
        "Terms & Conditions governing the use of the ActiveWell Pharma website and purchases made through it.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsAndConditionsPage() {
    return (
        <article className="bg-white">
            <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-0">

                {/* ------------------------------------------------ */}
                {/* Header */}
                {/* ------------------------------------------------ */}

                <header className="mb-14 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Terms &amp; Conditions
                    </h1>

                    <p className="mt-4 text-sm font-medium uppercase tracking-wide text-gray-500">
                        Last Updated: August 05, 2026
                    </p>
                </header>

                {/* ------------------------------------------------ */}
                {/* Content */}
                {/* ------------------------------------------------ */}

                <div className="space-y-10 text-[16px] leading-8 text-gray-700">

                    {/* ------------------------------------------------ */}
                    {/* Introduction */}
                    {/* ------------------------------------------------ */}

                    <section className="space-y-6">
                        <p>
                            Welcome to{" "}
                            <strong className="font-semibold text-gray-900">
                                ActiveWell Pharma Private Limited
                            </strong>{" "}
                            ("we," "us," "our," "ActiveWell Pharma"). These Terms &
                            Conditions ("Terms") govern your access to and use of our
                            website{" "}
                            <a
                                href="https://www.activewellpharma.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                https://www.activewellpharma.com
                            </a>{" "}
                            (the "Site") and any purchase made through it.
                        </p>

                        <p>
                            By accessing or using our Site, placing an order, or creating
                            an account, you agree to be bound by these Terms. If you do
                            not agree, please do not use the Site.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 1. About Us */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="about-us"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            1. About Us
                        </h2>

                        <p>
                            ActiveWell Pharma Private Limited is a nutraceutical company
                            manufacturing and selling health and wellness supplements,
                            including effervescent tablets, under valid FSSAI licensing.
                        </p>

                        <address className="not-italic rounded-lg border border-gray-200 bg-gray-50 p-6 leading-8">
                            <strong className="font-semibold text-gray-900">
                                Registered Address
                            </strong>

                            <br />

                            Saili Kullian, Near Kabir Mandir

                            <br />

                            Pathankot, Tehsil Distt. Pathankot

                            <br />

                            Punjab 145001, India

                            <br />
                            <br />

                            <span className="font-medium text-gray-900">
                                Email:
                            </span>{" "}
                            <a
                                href="mailto:info@activewellpharma.com"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                info@activewellpharma.com
                            </a>

                            <br />

                            <span className="font-medium text-gray-900">
                                Phone:
                            </span>{" "}
                            <a
                                href="tel:+918988166661"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                +91-8988166661
                            </a>
                        </address>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 2. Eligibility */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="eligibility"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            2. Eligibility
                        </h2>

                        <p>
                            By using our Site, you confirm that you are at least{" "}
                            <strong>18 years old</strong>, or are using the Site under the
                            supervision of a parent or legal guardian.
                        </p>

                        <p>
                            Our products are not intended for use by children unless directed
                            by a qualified healthcare professional.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 3. Products and Health Disclaimer */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="health-disclaimer"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            3. Products and Health Disclaimer
                        </h2>

                        <ul className="list-disc space-y-5 pl-6 marker:text-gray-500">
                            <li>
                                Our products are{" "}
                                <strong className="font-semibold text-gray-900">
                                    nutraceuticals / dietary supplements
                                </strong>
                                , manufactured and marketed under valid FSSAI licensing. They
                                are <strong>not intended to diagnose, treat, cure, or prevent
                                    any disease.</strong>
                            </li>

                            <li>
                                Product descriptions, images, and claims displayed on this Site
                                are provided for informational purposes only and should not be
                                interpreted as medical advice.
                            </li>

                            <li>
                                Please consult a qualified healthcare professional before using
                                any product if you are pregnant, nursing, taking medication, or
                                have a pre-existing medical condition.
                            </li>

                            <li>
                                Product packaging, ingredients, nutritional information, and
                                images displayed on the Site are provided for reference only.
                                Always read and follow the information printed on the physical
                                product label before consumption.
                            </li>
                        </ul>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                            <p className="text-sm leading-7 text-amber-900">
                                <strong>Important:</strong> Information published on this Site
                                is not a substitute for professional medical advice, diagnosis,
                                or treatment. Always seek the advice of your physician or other
                                qualified healthcare provider regarding any medical condition or
                                before starting any dietary supplement.
                            </p>
                        </div>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 4. Account Registration */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="account-registration"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            4. Account Registration
                        </h2>

                        <p>
                            You may need to create an account to place an order. By creating
                            an account, you agree to:
                        </p>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>
                                Provide accurate, current, and complete information.
                            </li>

                            <li>
                                Keep your login credentials confidential and secure.
                            </li>

                            <li>
                                Notify us immediately of any unauthorized use of your account
                                or any suspected security breach.
                            </li>
                        </ul>

                        <p>
                            We reserve the right to suspend or terminate accounts that
                            violate these Terms or are used fraudulently.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 5. Payment Terms */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="payment-terms"
                        className="space-y-10 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            5. Payment Terms
                        </h2>

                        {/* ------------------------------------- */}
                        {/* Accepted Payment Methods */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Accepted Payment Methods
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    Credit &amp; Debit Cards (Visa, Mastercard, RuPay, Amex)
                                </li>

                                <li>
                                    UPI (Google Pay, PhonePe, Paytm, BHIM)
                                </li>

                                <li>
                                    Net Banking (all major Indian banks)
                                </li>

                                <li>
                                    Wallets (Paytm, Amazon Pay)
                                </li>

                                <li>
                                    Cash on Delivery (COD) — subject to pin code availability
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Payment Security */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Payment Security
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    All transactions are processed through PCI-DSS compliant
                                    payment gateways (Razorpay / PayU / CCAvenue).
                                </li>

                                <li>
                                    Payments are protected using <strong>256-bit SSL
                                        encryption.</strong>
                                </li>

                                <li>
                                    We <strong>do not</strong> store your card number, CVV, or
                                    PIN on our servers.
                                </li>

                                <li>
                                    3D Secure / OTP authentication is mandatory for all eligible
                                    card transactions.
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Order Confirmation & Pricing */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Order Confirmation &amp; Pricing
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    Orders are confirmed only after successful payment.
                                </li>

                                <li>
                                    A confirmation email or SMS, together with the invoice, is
                                    sent immediately after order confirmation.
                                </li>

                                <li>
                                    All prices displayed on the Site are inclusive of applicable
                                    GST (12% or 18%, as applicable).
                                </li>

                                <li>
                                    We reserve the right to cancel orders due to pricing errors,
                                    stock unavailability, or suspected fraudulent activity. In
                                    such cases, a full refund will be initiated.
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Failed Payments */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Failed Payments
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    Failed payments are typically auto-reversed by your bank
                                    within <strong>3–7 business days.</strong>
                                </li>

                                <li>
                                    If an amount is deducted but your order is not confirmed,
                                    please contact us within <strong>48 hours</strong> at{" "}
                                    <a
                                        href="mailto:info@activewellpharma.com"
                                        className="font-medium text-blue-600 transition-colors hover:underline"
                                    >
                                        info@activewellpharma.com
                                    </a>
                                    .
                                </li>
                            </ul>
                        </section>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 6. Dispatch & Shipment */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="dispatch-shipment"
                        className="space-y-10 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            6. Dispatch &amp; Shipment
                        </h2>

                        {/* ------------------------------------- */}
                        {/* Processing Time */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Processing Time
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    Orders are dispatched within{" "}
                                    <strong>1–3 business days</strong> (excluding Sundays and
                                    public holidays).
                                </li>

                                <li>
                                    Orders placed after <strong>4:00 PM</strong> are processed on
                                    the following business day.
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Tracking */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Tracking
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    A tracking number is shared via email or SMS within{" "}
                                    <strong>24 hours</strong> of dispatch.
                                </li>

                                <li>
                                    You can track your shipment through the{" "}
                                    <strong>Track Order</strong> section available on our Site.
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Delivery Timelines */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Delivery Timelines
                            </h3>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full border-collapse text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                                Location
                                            </th>

                                            <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                                Estimated Delivery
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-5">
                                                Metro cities
                                            </td>

                                            <td className="px-6 py-5">
                                                2–4 business days
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-6 py-5">
                                                Tier 2 / Tier 3 cities
                                            </td>

                                            <td className="px-6 py-5">
                                                4–7 business days
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-6 py-5">
                                                Remote areas
                                            </td>

                                            <td className="px-6 py-5">
                                                7–12 business days
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Shipping Charges */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Shipping Charges
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    Free shipping on orders above <strong>₹500</strong>.
                                </li>

                                <li>
                                    Shipping charges between <strong>₹49–₹79</strong> apply to
                                    orders below ₹500.
                                </li>

                                <li>
                                    Cash on Delivery (COD) charges:{" "}
                                    <strong>₹30 per order</strong> (where applicable).
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Delivery Attempts */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Delivery Attempts
                            </h3>

                            <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                                <li>
                                    We make a maximum of <strong>2 delivery attempts</strong>.
                                </li>

                                <li>
                                    Failed deliveries due to an incorrect address or recipient
                                    unavailability will be returned to us.
                                </li>

                                <li>
                                    Re-shipping charges of <strong>₹100</strong> will apply for
                                    any additional delivery attempt.
                                </li>
                            </ul>
                        </section>

                        {/* ------------------------------------- */}
                        {/* Force Majeure */}
                        {/* ------------------------------------- */}

                        <section className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Force Majeure
                            </h3>

                            <p>
                                We are not responsible for delivery delays caused by events
                                beyond our reasonable control, including but not limited to
                                natural calamities, strikes, transportation disruptions,
                                pandemics, governmental restrictions, or any other force
                                majeure event.
                            </p>
                        </section>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 7. Returns, Refunds & Cancellations */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="returns-refunds"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            7. Returns, Refunds &amp; Cancellations
                        </h2>

                        <p>
                            Please refer to our{" "}
                            <a
                                href="/refund-cancellation-policy"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                Refund &amp; Cancellation Policy
                            </a>{" "}
                            for complete information regarding:
                        </p>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>Return eligibility</li>

                            <li>Replacement requests</li>

                            <li>Refund processing timelines</li>

                            <li>Order cancellation procedures</li>
                        </ul>

                        <p>
                            The Refund &amp; Cancellation Policy forms an integral part of
                            these Terms &amp; Conditions and should be read together with
                            this document.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 8. Intellectual Property */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="intellectual-property"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            8. Intellectual Property
                        </h2>

                        <p>
                            All content available on this Site, including but not limited to
                            text, graphics, product images, logos, icons, illustrations,
                            software, designs, trademarks, and the{" "}
                            <strong>ActiveWell Pharma</strong> brand name, is the exclusive
                            property of ActiveWell Pharma Private Limited or its licensors
                            and is protected under applicable intellectual property laws.
                        </p>

                        <p>
                            You may not reproduce, copy, modify, distribute, publish,
                            display, transmit, or commercially exploit any content from this
                            Site without our prior written permission.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 9. Prohibited Use */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="prohibited-use"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            9. Prohibited Use
                        </h2>

                        <p>
                            By accessing or using our Site, you agree that you will not:
                        </p>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>
                                Use the Site for any unlawful, fraudulent, or unauthorized
                                purpose.
                            </li>

                            <li>
                                Attempt to gain unauthorized access to our systems, servers,
                                databases, or networks.
                            </li>

                            <li>
                                Interfere with the security, integrity, or normal operation of
                                the Site, including attempts to overwhelm our infrastructure
                                (for example, DDoS-style traffic).
                            </li>

                            <li>
                                Post, upload, or transmit content that is unlawful,
                                defamatory, abusive, infringing, or otherwise harmful.
                            </li>

                            <li>
                                Resell or commercially distribute our products without prior
                                written authorization.
                            </li>
                        </ul>

                        <p>
                            We reserve the right to suspend, restrict, or permanently
                            terminate access to the Site and related services for users who
                            violate these Terms or engage in fraudulent or abusive activity.
                        </p>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 10. Limitation of Liability */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="limitation-of-liability"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            10. Limitation of Liability
                        </h2>

                        <p>
                            To the fullest extent permitted under applicable law, ActiveWell
                            Pharma Private Limited shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages arising
                            out of or relating to your access to, use of, or inability to use
                            the Site or any products purchased through it.
                        </p>

                        <p>
                            Nothing contained in these Terms shall exclude or limit any
                            liability that cannot be excluded or limited under applicable
                            Indian law, including rights available under the{" "}
                            <strong>Consumer Protection Act, 2019</strong>.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 11. Governing Law & Jurisdiction */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="governing-law"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            11. Governing Law &amp; Jurisdiction
                        </h2>

                        <p>
                            These Terms &amp; Conditions shall be governed by and construed in
                            accordance with the laws of India.
                        </p>

                        <p>
                            Any dispute arising out of or relating to these Terms, your use of
                            the Site, or any purchase made through the Site shall be subject
                            to the exclusive jurisdiction of the competent courts located at{" "}
                            <strong>Pathankot, Punjab</strong>.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 12. Changes to These Terms */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="changes-to-terms"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            12. Changes to These Terms
                        </h2>

                        <p>
                            We may revise these Terms &amp; Conditions from time to time.
                            Updated versions will be published on this page together with a
                            revised <strong>"Last Updated"</strong> date.
                        </p>

                        <p>
                            Your continued use of the Site after any such revisions
                            constitutes your acceptance of the updated Terms.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 13. Contact Us */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="contact"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            13. Contact Us
                        </h2>

                        <p>
                            If you have any questions regarding these Terms &amp; Conditions,
                            please contact us:
                        </p>

                        <address className="not-italic rounded-lg border border-gray-200 bg-gray-50 p-6 leading-8">
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

                            <span className="font-medium text-gray-900">
                                Email:
                            </span>{" "}
                            <a
                                href="mailto:info@activewellpharma.com"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                info@activewellpharma.com
                            </a>

                            <br />

                            <span className="font-medium text-gray-900">
                                Phone:
                            </span>{" "}
                            <a
                                href="tel:+918988166661"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                +91-8988166661
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