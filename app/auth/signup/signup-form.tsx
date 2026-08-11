'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { signupSchema } from '@/lib/validations/auth-validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Sparkles } from 'lucide-react'

const supabase = createClient()

export default function SignupForm() {
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)

        const formData = new FormData(e.currentTarget)
        const raw = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            fullName: formData.get('fullName') as string,
        }

        const result = signupSchema.safeParse(raw)
        if (!result.success) {
            toast.error(result.error.issues[0]?.message ?? 'Invalid input')
            setPending(false)
            return
        }

        const { error } = await supabase.auth.signUp({
            email: result.data.email,
            password: result.data.password,
            options: {
                data: { 
                    full_name: result.data.fullName,
                },
            },
        })

        if (error) {
            toast.error(error.message ?? 'Sign up failed')
            setPending(false)
            return
        }

        toast.success('Account created! Redirecting...')
        router.push('/')
    }

    return (
        <div className="space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="full-name" className="font-body font-medium text-foreground">Full Name</Label>
                    <Input id="full-name" name="fullName" type="text" required placeholder="John Doe" className="h-12 rounded-xl font-body relative block w-full bg-transparent" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="font-body font-medium text-foreground">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="hello@example.com" className="h-12 rounded-xl font-body relative block w-full bg-transparent" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="font-body font-medium text-foreground">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="h-12 rounded-xl font-body pr-12 relative block w-full bg-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button disabled={pending} size="lg" className="w-full h-12 text-base rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                    {pending ? 'Signing up...' : 'Sign Up'}
                </Button>
            </form>

            {/*     <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground font-body">or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-xl font-body bg-transparent hover:bg-muted" onClick={() => toast.info("OAuth coming soon!")}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google
                </Button>
                <Button variant="outline" className="h-12 rounded-xl font-body bg-transparent hover:bg-muted" onClick={() => toast.info("OAuth coming soon!")}>
                    <Sparkles className="w-5 h-5 mr-2 text-foreground" />
                    <span className="text-foreground">Apple</span>
                </Button>
            </div> */}

            <p className="text-center font-body text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Log In
                </Link>
            </p>
        </div>
    )
}
