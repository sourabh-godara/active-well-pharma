import { Leaf } from "lucide-react";
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPasswordPage(): React.ReactElement {
    return (
        <div className="min-h-screen flex bg-background">
            {/* Left - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-primary/30 animate-pulse"
                            style={{
                                width: `${60 + i * 30}px`,
                                height: `${60 + i * 30}px`,
                                top: `${10 + i * 15}%`,
                                left: `${5 + i * 16}%`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>
                <div className="relative z-10 text-center px-12 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-card">
                        <Leaf className="w-5 h-5 text-primary" />
                        <span className="font-body font-semibold text-primary">ActiveWell Pharma</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-foreground leading-tight">
                        Reset Your <span className="text-gradient-fresh">Password</span>
                    </h2>
                    <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
                        Don&apos;t worry — it happens to the best of us. We&apos;ll help you get back on track.
                    </p>
                </div>
            </div>

            {/* Right - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                            <Leaf className="w-6 h-6 text-primary" />
                            <span className="font-body font-bold text-xl text-primary">ActiveWell</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-foreground">Forgot Password</h1>
                        <p className="text-muted-foreground font-body">Enter your email and we&apos;ll send you a reset link</p>
                    </div>

                    <ForgotPasswordForm />

                </div>
            </div>
        </div>
    )
}
