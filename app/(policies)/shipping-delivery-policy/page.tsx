import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Shipping & Delivery Policy | ActiveWell Pharma",
    description:
        "Shipping & Delivery Policy of ActiveWell Pharma Private Limited.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function ShippingDeliveryPolicyPage() {
    return (
        <article className="bg-white">
            <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-0">

                {/* ------------------------------------------------ */}
                {/* Header */}
                {/* ------------------------------------------------ */}

                <header className="mb-14 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Shipping &amp; Delivery Policy
                    </h1>

                    <p className="mt-4 text-sm font-medium uppercase tracking-wide text-gray-500">
                        Last Updated: August 06, 2026
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
                            This Shipping &amp; Delivery Policy explains how{" "}
                            <strong className="font-semibold text-gray-900">
                                ActiveWell Pharma Private Limited
                            </strong>{" "}
                            processes, ships, and delivers orders placed through our website{" "}
                            <a
                                href="https://www.activewellpharma.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                https://www.activewellpharma.com
                            </a>
                            .
                        </p>

                        <p>
                            Please read this policy carefully before placing an order. By
                            purchasing from our website, you acknowledge and agree to the
                            shipping and delivery practices described below.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 1. Order Processing Time */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="order-processing"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            1. Order Processing Time
                        </h2>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>
                                Orders are dispatched within{" "}
                                <strong>1–3 business days</strong> (excluding Sundays and public
                                holidays).
                            </li>

                            <li>
                                Orders placed <strong>after 4:00 PM</strong> are processed on
                                the following business day.
                            </li>

                            <li>
                                You will receive an order confirmation email or SMS immediately
                                after successful payment.
                            </li>

                            <li>
                                A separate dispatch notification containing your shipment
                                details and tracking information will be sent once your order
                                has been shipped.
                            </li>
                        </ul>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 2. Shipping Coverage */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="shipping-coverage"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            2. Shipping Coverage
                        </h2>

                        <p>
                            We currently ship across <strong>India</strong>, subject to
                            courier serviceability at your delivery pin code.
                        </p>

                        <p>
                            <strong>Cash on Delivery (COD)</strong> availability also depends
                            on whether the destination pin code is serviceable by our courier
                            partners.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 3. Delivery Timelines */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="delivery-timelines"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            3. Delivery Timelines
                        </h2>

                        <p>
                            The following delivery timelines are estimated from the{" "}
                            <strong>date of dispatch</strong>, not the date the order is
                            placed.
                        </p>

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

                        <p>
                            These timelines are estimates only and may vary due to courier
                            delays, weather conditions, regional disruptions, or other
                            unforeseen circumstances beyond our reasonable control.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 4. Shipping Charges */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="shipping-charges"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            4. Shipping Charges
                        </h2>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Order Value
                                        </th>

                                        <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-900">
                                            Shipping Charge
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-5">
                                            Above ₹500
                                        </td>

                                        <td className="px-6 py-5 font-medium text-green-700">
                                            Free
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            Below ₹500
                                        </td>

                                        <td className="px-6 py-5">
                                            ₹49–₹79
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-5">
                                            Cash on Delivery (COD)
                                        </td>

                                        <td className="px-6 py-5">
                                            + ₹30 COD handling charge
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p>
                            Shipping charges, where applicable, are displayed during checkout
                            before you complete your purchase.
                        </p>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 5. Order Tracking */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="order-tracking"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            5. Order Tracking
                        </h2>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>
                                A tracking number or tracking link will be shared via email
                                and/or SMS within <strong>24 hours</strong> of dispatch.
                            </li>

                            <li>
                                You can monitor the status of your shipment anytime through
                                the <strong>"Track Order"</strong> section available on our
                                website.
                            </li>

                            <li>
                                Tracking updates are provided by our courier partners and may
                                take a few hours to appear after dispatch.
                            </li>
                        </ul>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 6. Delivery Attempts */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="delivery-attempts"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            6. Delivery Attempts
                        </h2>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>
                                Our courier partners make a maximum of{" "}
                                <strong>2 delivery attempts</strong>.
                            </li>

                            <li>
                                If delivery fails because of an incorrect address,
                                recipient unavailability, refusal to accept the shipment,
                                or any similar reason, the order will be returned to us.
                            </li>

                            <li>
                                If you wish to have the returned shipment dispatched again,
                                a <strong>₹100 re-shipping charge</strong> will apply.
                            </li>

                            <li>
                                Please ensure that your shipping address, contact number,
                                and delivery details are accurate before placing your order
                                to avoid unnecessary delays or additional charges.
                            </li>
                        </ul>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 7. Delays Beyond Our Control */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="force-majeure"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            7. Delays Beyond Our Control
                        </h2>

                        <p>
                            While we make every reasonable effort to ensure timely delivery,
                            certain events may cause delays that are beyond our reasonable
                            control.
                        </p>

                        <p>
                            ActiveWell Pharma Private Limited shall not be responsible for
                            delays resulting from circumstances including, but not limited
                            to:
                        </p>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>Natural disasters or extreme weather conditions</li>

                            <li>Strikes, labour disputes, or transportation disruptions</li>

                            <li>Courier service interruptions or operational delays</li>

                            <li>
                                Government restrictions, public emergencies, or regulatory
                                actions
                            </li>

                            <li>
                                Any other force majeure event beyond our reasonable control
                            </li>
                        </ul>

                        <p>
                            In such circumstances, delivery timelines should be treated as
                            estimates only. We appreciate your patience and understanding
                            while we work with our logistics partners to complete delivery
                            as quickly as reasonably possible.
                        </p>
                    </section>
                    {/* ------------------------------------------------ */}
                    {/* 8. Damaged, Wrong, or Missing Items */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="damaged-or-missing-items"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            8. Damaged, Wrong, or Missing Items
                        </h2>

                        <p>
                            If your order arrives damaged, contains the wrong product, or is
                            incomplete, please refer to our{" "}
                            <a
                                href="/refund-cancellation-policy"
                                className="font-medium text-blue-600 transition-colors hover:underline"
                            >
                                Refund &amp; Cancellation Policy
                            </a>{" "}
                            for complete instructions on reporting the issue and requesting a
                            replacement or refund.
                        </p>

                        <p>
                            Damaged, incorrect, or missing-item claims must be reported within{" "}
                            <strong>48 hours of delivery</strong>.
                        </p>

                        <p>
                            To help us investigate and resolve your request promptly, please
                            include:
                        </p>

                        <ul className="list-disc space-y-3 pl-6 marker:text-gray-500">
                            <li>Your Order ID.</li>

                            <li>
                                Clear photographs of the received package and the affected
                                product.
                            </li>

                            <li>
                                Unboxing photos or videos, wherever available, to assist with
                                verification.
                            </li>

                            <li>
                                A brief description of the issue encountered.
                            </li>
                        </ul>

                        <p>
                            Requests submitted after the reporting window may not be eligible
                            for replacement or refund.
                        </p>
                    </section>

                    {/* ------------------------------------------------ */}
                    {/* 9. Contact Us */}
                    {/* ------------------------------------------------ */}

                    <section
                        id="contact"
                        className="space-y-8 border-t border-gray-200 pt-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            9. Contact Us
                        </h2>

                        <p>
                            If you have any questions regarding shipping or delivery, please
                            contact us:
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