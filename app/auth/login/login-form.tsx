'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '../actions'
import { toast } from 'sonner'
import { useEffect } from 'react'

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
        >
            {pending ? 'Signing in...' : 'Sign in'}
        </button>
    )
}

export default function LoginForm() {
    const [state, formAction] = useActionState(login, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form className="mt-8 space-y-6" action={formAction}>
            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <label htmlFor="email-address" className="sr-only">
                        Email address
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                        placeholder="Password"
                    />
                </div>
            </div>

            <div>
                <SubmitButton />
            </div>
            <div className="text-center text-sm">
                <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Don't have an account? Sign up
                </a>
            </div>
        </form>
    )
}
