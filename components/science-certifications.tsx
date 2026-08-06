import { Shield, Award, FlaskConical, CheckCircle2, Leaf } from 'lucide-react'

const CERTIFICATIONS = [
  {
    icon: FlaskConical,
    label: 'Clinically Tested',
    sublabel: 'Evidence-based formulas',
  },
  {
    icon: Award,
    label: 'GMP Certified',
    sublabel: 'Manufacturing excellence',
  },
  {
    icon: Shield,
    label: 'FSSAI Approved',
    sublabel: 'Food safety certified',
  },
  {
    icon: CheckCircle2,
    label: '3rd Party Tested',
    sublabel: 'Independent verification',
  },
  {
    icon: Leaf,
    label: '100% Plant Based',
    sublabel: 'Zero animal derivatives',
  },
] as const

export default function ScienceCertifications(): React.JSX.Element {
  return (
    <section
      className="py-14"
      style={{ background: '#215732' }}
      aria-label="Science and certifications"
    >
      <div className="container-brand px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <p className="text-center text-xs font-semibold text-white/50 tracking-[0.2em] uppercase mb-8">
          Science-Backed Trust
        </p>

        {/* Certifications row */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
          {CERTIFICATIONS.map((cert, i) => (
            <div key={cert.label} className="flex items-center gap-3">
              {/* Divider */}
              {i > 0 && (
                <div className="hidden lg:block w-px h-10 bg-white/15 mr-5" aria-hidden="true" />
              )}
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <cert.icon className="w-5 h-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none mb-0.5">{cert.label}</p>
                <p className="text-[11px] text-white/50 leading-none">{cert.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
