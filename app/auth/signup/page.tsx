
import { signup } from '../actions'
import SignupForm from './signup-form'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>
                <SignupForm />
            </div>
        </div>
    )
}
