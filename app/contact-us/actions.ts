"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContactMessage(data: ContactData) {
    try {
        const { error } = await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>", 
            to: "info@activewellpharma.com",
            subject: `New Contact Request: ${data.subject}`,
            replyTo: data.email,
            text: `You have received a new contact request.

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error sending message:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
