
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugPage() {
    const [session, setSession] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [logs, setLogs] = useState<string[]>([])
    const supabase = createClient()

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1]} - ${msg}`])

    useEffect(() => {
        const init = async () => {
            addLog('Starting initialization...')

            try {
                addLog('Fetching session...')
                const { data, error } = await supabase.auth.getSession()

                if (error) {
                    addLog(`Session Error: ${error.message}`)
                    return
                }

                setSession(data.session)
                addLog(`Session: ${data.session ? 'Found' : 'Null'}`)

                if (data.session?.user) {
                    addLog(`User ID: ${data.session.user.id}`)
                    addLog('Fetching profile...')

                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.session.user.id)
                        .single()

                    if (profileError) {
                        // If "PGRST116" (JSON object requested, multiple (or no) rows returned), it means no profile usually.
                        // But .single() expects exactly one.
                        addLog(`Profile Error: ${profileError.message} (${profileError.code})`)
                    } else {
                        setProfile(profileData)
                        addLog('Profile fetched successfully')
                    }
                }
            } catch (err: any) {
                addLog(`CRITICAL ERROR: ${err.message}`)
            }
        }

        init()
    }, [])

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-bold mb-2">Logs</h2>
                    <div className="space-y-1">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-blue-50 p-4 rounded">
                        <h2 className="font-bold mb-2">Session Data</h2>
                        <pre className="overflow-auto max-h-60">
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </div>

                    <div className="bg-green-50 p-4 rounded">
                        <h2 className="font-bold mb-2">Profile Data</h2>
                        <pre className="overflow-auto max-h-60">
                            {JSON.stringify(profile, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
