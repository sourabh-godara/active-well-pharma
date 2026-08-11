import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Package, CheckCircle, Truck, Clock, AlertCircle } from 'lucide-react'

interface TrackOrderPageProps {
  params: Promise<{ token: string }>
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { token } = await params
  
  if (!token) {
    notFound()
  }

  const adminClient = createAdminClient()
  
  const { data: order, error } = await adminClient
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        products (
          name,
          image_url
        )
            ),
            shipping_address,
            addresses (*)
          `)
          .eq('guest_tracking_token', token)
          .single()
      
        if (error || !order) {
          notFound()
        }
      
        // Determine status steps
        const steps = [
          { id: 'created', name: 'Order Placed', icon: Clock },
          { id: 'confirmed', name: 'Confirmed', icon: CheckCircle },
          { id: 'shipped', name: 'Shipped', icon: Truck },
          { id: 'delivered', name: 'Delivered', icon: Package },
        ]
      
        let currentStepIndex = steps.findIndex(s => s.id === order.status)
        // If cancelled/failed/refunded, handle specially
        const isErrorState = ['cancelled', 'failed', 'refunded'].includes(order.status)
        
        if (isErrorState) {
          currentStepIndex = -1
        } else if (currentStepIndex === -1 && order.status === 'paid') {
          currentStepIndex = 1 // paid implies confirmed basically
        }
      
        const addr = order.shipping_address || order.addresses
      
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order #{order.id.split('-')[0]}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                {order.user_id === null && (
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Guest Order
                    </span>
                  </div>
                )}
              </div>
      
              {/* Status Tracker */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
                
                {isErrorState ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">This order was {order.status}.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -mt-px h-0.5 w-full bg-gray-200" aria-hidden="true" />
                    <div className="relative flex justify-between">
                      {steps.map((step, stepIdx) => {
                        const isCompleted = stepIdx <= currentStepIndex
                        const isCurrent = stepIdx === currentStepIndex
                        
                        return (
                          <div key={step.name} className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                              isCompleted ? 'bg-green-600' : 'bg-gray-200'
                            }`}>
                              <step.icon className={`h-4 w-4 ${isCompleted ? 'text-white' : 'text-gray-500'}`} aria-hidden="true" />
                            </div>
                            <p className={`mt-2 text-xs font-medium ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                              {step.name}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
      
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Order Details */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
                  <ul className="divide-y divide-gray-200">
                    {order.order_items?.map((item: any, i: number) => (
                      <li key={i} className="flex py-4">
                        <div className="ml-3 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-900">
                              <h3>{item.products?.name}</h3>
                              <p className="ml-4">₹{item.price_at_purchase}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="text-gray-900">₹{order.total_amount - (order.shipping_amount || 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className="text-gray-900">₹{order.shipping_amount}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-base font-medium text-gray-900">₹{order.total_amount}</dd>
                    </div>
                  </dl>
                </div>
      
                {/* Delivery & Contact */}
                <div className="space-y-8">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
                    {addr ? (
                      <address className="not-italic text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{addr.name}</p>
                        <p>{addr.address_line}</p>
                        <p>{addr.locality}, {addr.city}</p>
                        <p>{addr.state} - {addr.pincode}</p>
                        <p className="mt-2">Phone: {addr.phone}</p>
                      </address>
                    ) : (
                      <p className="text-sm text-gray-500">Address details unavailable.</p>
                    )}
                  </div>
      
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Name: {order.guest_name || addr?.name || 'Customer'}</p>
                      <p>Email: {order.guest_email || 'Not provided'}</p>
                      <p>Phone: {order.guest_phone || addr?.phone}</p>
                    </div>
                  </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium text-green-600 hover:text-green-500">
            Continue Shopping &rarr;
          </Link>
        </div>

      </div>
    </div>
  )
}
