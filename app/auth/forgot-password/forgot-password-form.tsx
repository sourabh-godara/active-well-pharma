'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@/lib/validations/auth-validation'
import { forgotPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import type { ActionResponse } from '@/lib/errors/async-wrapper'

export default function ForgotPasswordForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(forgotPassword, null)
    const [emailSent, setEmailSent] = useState(false)

    useEffect(() => {
        if (!state) return

        if (state.success) {
            setEmailSent(true)
        } else if (!state.success && state.error) {
            toast.error(state.error.message)
        }
    }, [state])

    // Success state — email sent confirmation
    if (emailSent) {
        return (
            <div className="space-y-6">
                <div className="text-center space-y-4 py-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-display font-semibold text-foreground">Check Your Email</h2>
                        <p className="text-muted-foreground font-body text-sm max-w-sm mx-auto">
                            If an account with that email exists, you&apos;ll receive a password reset link shortly. Please check your inbox and spam folder.
                        </p>
                    </div>
                </div>

                <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full h-12 text-base rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <form className="space-y-5" action={formAction}>
                <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="font-body font-medium text-foreground">Email</Label>
                    <div className="relative">
                        <Input
                            id="forgot-email"
                            name="email"
                            type="email"
                            required
                            placeholder="hello@example.com"
                            className="h-12 rounded-xl font-body pl-11 relative block w-full bg-transparent"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="w-full h-12 text-base rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>

            <p className="text-center font-body text-sm text-muted-foreground mt-6">
                Remember your password?{" "}
                <Link href="/auth/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Log In
                </Link>
            </p>
        </div>
    )
}
