'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { resetPasswordSchema } from '@/lib/validations/auth-validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { resetPassword } from '@/app/auth/actions'

const supabase = createClient()

export default function ResetPasswordForm(): React.ReactElement {
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setPending(true)

        const formData = new FormData(e.currentTarget)
        const raw = {
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        const result = resetPasswordSchema.safeParse(raw)
        if (!result.success) {
            toast.error(result.error.issues[0]?.message ?? 'Invalid input')
            setPending(false)
            return
        }

        const response = await resetPassword(null, formData)
        
        if (!response.success) {
            toast.error(response.error.message)
            setPending(false)
            return
        }

        setResetSuccess(true)
    }

    // Success state
    if (resetSuccess) {
        return (
            <div className="space-y-6">
                <div className="text-center space-y-4 py-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-display font-semibold text-foreground">Password Updated!</h2>
                        <p className="text-muted-foreground font-body text-sm max-w-sm mx-auto">
                            Your password has been reset successfully. You can now log in with your new password.
                        </p>
                    </div>
                </div>

                <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full h-12 text-base rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                >
                    Log In with New Password
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="new-password" className="font-body font-medium text-foreground">New Password</Label>
                    <div className="relative">
                        <Input
                            id="new-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="h-12 rounded-xl font-body pr-12 relative block w-full bg-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">Must be at least 6 characters</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-body font-medium text-foreground">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="h-12 rounded-xl font-body pr-12 relative block w-full bg-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={pending}
                    size="lg"
                    className="w-full h-12 text-base rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {pending ? 'Resetting...' : 'Reset Password'}
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
