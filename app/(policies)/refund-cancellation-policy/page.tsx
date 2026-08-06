import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | ActiveWell Pharma",
    description:
        "Refund & Cancellation Policy of ActiveWell Pharma Private Limited.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function RefundCancellationPolicyPage() {
    return (
        <article className="bg-white">
            <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-0">

                {/* Header */}

                <header className="mb-14 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Refund &amp; Cancellation Policy
                    </h1>

                    <p className="mt-4 text-sm font-medium uppercase tracking-wide text-gray-500">
                        Last Updated: August 05, 2026
                    </p>
                </header>

                <div className="space-y-10 text-[16px] leading-8 text-gray-700">

                    {/* Introduction */}

                    <section className="space-y-6">
                        <p>
                            At{" "}
                            <strong className="font-semibold text-gray-900">
                                ActiveWell Pharma Private Limited
                            </strong>
                            , customer satisfaction matters to us.
                        </p>

                        <p>
                            This policy explains when and how you can return a product,
                            cancel an order, and receive a refund.
                        </p>
                    </section>

                    {/* ------------------------------------- */}
                    {/* 1. Return Eligibility */}
                    {/* ------------------------------------- */}

                    <section
                        id="return-eligibility"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            1. Return Eligibility
                        </h2>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Situation
                                        </th>

                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Window
                                        </th>

                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Resolution
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-5">
                                            Damaged or defective product
                                        </td>

                                        <td className="px-6 py-5">
                                            Report within 48 hours of delivery, with unboxing photos
                                        </td>

                                        <td className="px-6 py-5">
                                            Full refund or replacement
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            Wrong product delivered
                                        </td>

                                        <td className="px-6 py-5">
                                            Report within 48 hours of delivery
                                        </td>

                                        <td className="px-6 py-5">
                                            Full refund + return shipping covered
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            Change of mind (unopened product)
                                        </td>

                                        <td className="px-6 py-5">
                                            Return within 7 days of delivery, in original condition
                                        </td>

                                        <td className="px-6 py-5">
                                            Refund minus return shipping
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                    {/* ------------------------------------- */}
                    {/* 2. Non-Returnable Items */}
                    {/* ------------------------------------- */}

                    <section
                        id="non-returnable-items"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            2. Non-Returnable Items
                        </h2>

                        <p>
                            For hygiene and safety reasons, the following products cannot be
                            returned:
                        </p>

                        <ul className="list-disc space-y-2 pl-6 marker:text-gray-500">
                            <li>Products with an opened or broken seal</li>

                            <li>Products damaged due to customer misuse</li>

                            <li>Free samples and promotional/gift items</li>
                        </ul>
                    </section>

                    {/* ------------------------------------- */}
                    {/* 3. How to Request a Return */}
                    {/* ------------------------------------- */}

                    <section
                        id="return-process"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            3. How to Request a Return
                        </h2>

                        <ol className="list-decimal space-y-5 pl-6 marker:font-semibold marker:text-gray-700">
                            <li>
                                Email{" "}
                                <a
                                    href="mailto:info@activewellpharma.com"
                                    className="font-medium text-blue-600 transition-colors hover:underline"
                                >
                                    info@activewellpharma.com
                                </a>{" "}
                                or call{" "}
                                <a
                                    href="tel:+918988166661"
                                    className="font-medium text-blue-600 transition-colors hover:underline"
                                >
                                    +91-8988166661
                                </a>{" "}
                                within the applicable return window.
                            </li>

                            <li>
                                Share your Order ID, photos of the product, and the reason for
                                your return request.
                            </li>

                            <li>
                                Our team will verify your request within{" "}
                                <strong>24–48 hours</strong>.
                            </li>

                            <li>
                                If approved, ship the product to:
                                <address className="mt-4 not-italic rounded-lg border border-gray-200 bg-gray-50 p-5 leading-7">
                                    <strong className="font-semibold text-gray-900">
                                        ActiveWell Pharma
                                    </strong>

                                    <br />

                                    Saili Kullian, Near Kabir Mandir

                                    <br />

                                    Pathankot, Punjab, India, 145001
                                </address>
                            </li>

                            <li>
                                Once received, we conduct a quality check within{" "}
                                <strong>2–3 business days</strong> before processing your
                                refund.
                            </li>
                        </ol>
                    </section>
                    {/* ------------------------------------- */}
                    {/* 4. Refund Timelines */}
                    {/* ------------------------------------- */}

                    <section
                        id="refund-timelines"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            4. Refund Timelines
                        </h2>

                        <p>
                            Refunds are issued <strong>only to the original payment method</strong>
                            {" "}— we do not offer cash refunds.
                        </p>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Payment Method
                                        </th>

                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Refund Timeline
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-5">
                                            Credit / Debit Card
                                        </td>

                                        <td className="px-6 py-5">
                                            5–10 business days (credited to the original card)
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            UPI / Net Banking / Wallet
                                        </td>

                                        <td className="px-6 py-5">
                                            5–7 business days
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            Cash on Delivery (COD)
                                        </td>

                                        <td className="px-6 py-5">
                                            7–10 business days (via NEFT to your bank account)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ------------------------------------- */}
                    {/* 5. Order Cancellations */}
                    {/* ------------------------------------- */}

                    <section
                        id="order-cancellations"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            5. Order Cancellations
                        </h2>

                        <ul className="list-disc space-y-5 pl-6 marker:text-gray-500">
                            <li>
                                <strong className="font-semibold text-gray-900">
                                    Before dispatch:
                                </strong>{" "}
                                Orders can be cancelled free of charge for a full refund.
                            </li>

                            <li>
                                <strong className="font-semibold text-gray-900">
                                    After dispatch:
                                </strong>{" "}
                                You may refuse delivery of the shipment. Once the product is
                                returned to us and inspected, a refund will be processed with
                                applicable return shipping charges deducted.
                            </li>
                        </ul>
                    </section>

                    {/* ------------------------------------- */}
                    {/* 6. Failed or Disputed Payments */}
                    {/* ------------------------------------- */}

                    <section
                        id="failed-payments"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            6. Failed or Disputed Payments
                        </h2>

                        <p>
                            If a payment was deducted from your account but your order was not
                            confirmed, please contact us within{" "}
                            <strong>48 hours</strong> with your transaction reference or UTR
                            number.
                        </p>

                        <p>
                            You can reach us at{" "}
                            <a
                                href="mailto:info@activewellpharma.com"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                info@activewellpharma.com
                            </a>
                            .
                        </p>

                        <p>
                            Most bank-side failed payment reversals happen automatically
                            within <strong>3–7 business days</strong>, even if you do not
                            contact us.
                        </p>
                    </section>

                    {/* ------------------------------------- */}
                    {/* 7. Contact Us */}
                    {/* ------------------------------------- */}

                    <section
                        id="contact"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            7. Contact Us
                        </h2>

                        <p>
                            For any questions regarding returns, cancellations, or refunds,
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

                            <span className="font-medium text-gray-900">Email:</span>{" "}
                            <a
                                href="mailto:info@activewellpharma.com"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                info@activewellpharma.com
                            </a>

                            <br />

                            <span className="font-medium text-gray-900">Phone:</span>{" "}
                            <a
                                href="tel:+918988166661"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                +91-8988166661
                            </a>
                        </address>
                    </section>

                    {/* ------------------------------------- */}
                    {/* Footer */}
                    {/* ------------------------------------- */}

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