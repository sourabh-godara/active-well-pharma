import { Droplets, FlaskConical, Recycle, Award, Truck, Lock } from 'lucide-react'

const BENEFITS = [
  {
    icon: Droplets,
    title: '100% Plant-Based',
    description: 'Every ingredient is sourced from nature\'s finest superfoods — absolutely zero animal derivatives or synthetic fillers.',
    accent: '#d8f0e8',
    iconColor: '#215732',
    colSpan: 'lg:col-span-2',
    rowSpan: 'lg:row-span-1',
  },
  {
    icon: FlaskConical,
    title: 'Clinically Inspired',
    description: 'Formulas developed with evidence-based research, targeting visible results.',
    accent: '#e8f0fe',
    iconColor: '#2563eb',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-1',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly',
    description: 'Sustainable packaging designed to minimise environmental impact at every step.',
    accent: '#eaf6ee',
    iconColor: '#2EB872',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-1',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognised by leading wellness and beauty publications across India for excellence.',
    accent: '#fef5d4',
    iconColor: '#b8860b',
    colSpan: 'lg:col-span-2',
    rowSpan: 'lg:row-span-1',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Orders dispatched within 24 hours. Free delivery on orders above ₹599.',
    accent: '#fde8e2',
    iconColor: '#e8614a',
    colSpan: 'lg:col-span-2',
    rowSpan: 'lg:row-span-1',
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: '100% safe checkout. We accept UPI, cards, net banking, and EMI options.',
    accent: '#ecdff9',
    iconColor: '#7c3aed',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-1',
  },
] as const

export default function Benefits(): React.JSX.Element {
  return (
    <section
      id="about"
      className="py-24 lg:py-32 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="benefits-heading"
    >
      <div className="container-brand max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            id="benefits-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            Why Choose <span className="text-primary">ActiveWell</span>?
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-xl mx-auto leading-relaxed">
            We're on a mission to make clean, effective wellness accessible to everyone. Here's what sets us apart.
          </p>
        </div>

        {/* Benefits bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className={`group flex flex-col justify-between p-8 bg-white rounded-3xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 ease-out ${item.colSpan}`}
            >
              {/* Icon tile */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out"
                style={{ backgroundColor: item.accent }}
              >
                <item.icon
                  className="w-6 h-6"
                  style={{ color: item.iconColor }}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
