import { Truck, ShieldCheck, RefreshCw } from 'lucide-react'

const badges = [
    { icon: Truck, label: 'Free Delivery' },
    { icon: ShieldCheck, label: 'Genuine Product' },
    { icon: RefreshCw, label: 'Easy Returns' },
]

export function TrustBadges() {
    return (
        <div className="grid grid-cols-3 gap-3 mt-2">
            {badges.map(({ icon: Icon, label }) => (
                <div
                    key={label}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted px-2 py-4 text-center"
                >
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    <span className="font-body text-[11px] font-medium text-muted-foreground leading-tight">
                        {label}
                    </span>
                </div>
            ))}
        </div>
    )
}
