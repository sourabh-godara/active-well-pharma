"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendContactMessage } from "./actions";

const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
    const [isPending, setIsPending] = useState(false);
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsPending(true);
        try {
            const result = await sendContactMessage(data);
            if (result.success) {
                toast.success("Message sent successfully! We'll get back to you soon.");
                reset();
            } else {
                toast.error(result.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                    <Input 
                        id="firstName" 
                        placeholder="John" 
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-12" 
                        {...register("firstName")}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                    <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-12" 
                        {...register("lastName")}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-12" 
                    {...register("email")}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
                <Input 
                    id="subject" 
                    placeholder="How can we help?" 
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-12" 
                    {...register("subject")}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            <div className="space-y-3">
                <Label htmlFor="message" className="text-sm font-medium text-foreground">Message</Label>
                <textarea 
                    id="message" 
                    placeholder="Write your message here..." 
                    rows={5}
                    className="flex w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...register("message")}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-12 text-base font-semibold group rounded-full">
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </Button>
        </form>
    );
}
