'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types' // Asegúrate que esta ruta sea correcta

// Definición del tipo Plan (debe coincidir con tu tabla 'plans')
export interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string | null
  features: string[] // Asumiendo que 'features' es un JSON array de strings
  stripe_price_id: string | null
  active: boolean
  description: string | null
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create Supabase client with fallback for build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey)

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true) // Solo obtener planes activos
        .order('price', { ascending: true }) // Ordenar por precio

      if (error) {
        console.error('Error fetching plans:', error)
        setError('Could not fetch pricing plans. Please try again later.')
      } else {
        // Asegurarse de que 'features' sea un array. Si es un string JSON, parsearlo.
        const formattedPlans = data.map(plan => ({
          ...plan,
          features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [],
        }))
        setPlans(formattedPlans)
      }
      setIsLoading(false)
    }

    fetchPlans()
  }, [supabase])

  const handleSubscribe = async (plan: Plan) => {
    if (!plan.stripe_price_id) {
      alert('Este plan no está configurado para suscripción online.')
      return
    }
    // TODO: Implementar la lógica para redirigir al Checkout de Stripe
    // Esto implicará llamar a un endpoint en nuestro backend que cree la sesión de Stripe.
    alert(`Redirigiendo a Stripe para el plan: ${plan.name} con ID: ${plan.stripe_price_id}`)
    // TODO: Implementar la lógica para redirigir al Checkout de Stripe
    // Esto implicará llamar a un endpoint en nuestro backend que cree la sesión de Stripe.
    // alert(`Redirigiendo a Stripe para el plan: ${plan.name} con ID: ${plan.stripe_price_id}`)
    console.log('Attempting to subscribe to plan:', plan.stripe_price_id)
    setIsLoading(true) // Indicar carga durante la llamada a la API
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: plan.stripe_price_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create checkout session. Status: ${response.status}`);
      }

      const sessionData = await response.json();

      if (sessionData.sessionUrl) {
        // Redirigir al usuario a la página de checkout de Stripe
        window.location.href = sessionData.sessionUrl;
      } else if (sessionData.sessionId) {
        // Si solo se devuelve sessionId, necesitarías Stripe.js para redirigir
        // Esto es un fallback, idealmente sessionUrl siempre debería estar presente
        alert('Checkout session created. Please implement Stripe.js redirection or ensure sessionUrl is returned.');
        console.log('Checkout Session ID:', sessionData.sessionId);
      } else {
        throw new Error('Invalid session data received from server.');
      }

    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Could not initiate subscription. Please try again.');
      setIsLoading(false); // Detener la carga en caso de error
    }
    // No establecer setIsLoading(false) aquí si la redirección es exitosa, ya que la página cambiará.
  }

  if (isLoading && plans.length === 0) { // Mostrar loading solo si los planes aún no se han cargado
    return (
      <div className="min-h-screen bg-n8n-dark text-n8n-text-primary flex justify-center items-center">
        <p className="text-xl">Loading pricing plans...</p>
        {/* Podrías añadir un spinner aquí */}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-n8n-dark text-n8n-text-primary flex flex-col justify-center items-center p-8">
        <div className="bg-n8n-error/20 border border-n8n-error text-n8n-error px-6 py-4 rounded-md text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-n8n-dark text-n8n-text-primary font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-n8n-accent mb-10 text-center">
          Choose Your Plan
        </h1>

        {plans.length === 0 && !isLoading && (
          <p className="text-center text-n8n-text-secondary">No active plans available at the moment.</p>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-n8n-surface rounded-lg shadow-xl p-6 flex flex-col"
            >
              <h2 className="text-2xl font-semibold text-n8n-accent-hover mb-3">{plan.name}</h2>
              {plan.description && (
                <p className="text-sm text-n8n-text-secondary mb-4">{plan.description}</p>
              )}
              <div className="mb-5">
                <span className="text-4xl font-extrabold text-white">
                  ${plan.price.toFixed(2)}
                </span>
                <span className="text-n8n-text-secondary ml-1">
                  {plan.interval ? `/ ${plan.interval}` : ''}
                </span>
              </div>
              <ul className="space-y-2 mb-6 text-n8n-text-primary flex-grow">
                {plan.features && plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-n8n-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={!plan.stripe_price_id} // Deshabilitar si no hay stripe_price_id (ej. plan gratuito no gestionado por Stripe checkout)
                className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                            ${!plan.stripe_price_id ? 'bg-n8n-button-hover cursor-not-allowed' : 'bg-n8n-accent hover:bg-n8n-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-n8n-surface focus:ring-n8n-accent'}
                            disabled:opacity-70`}
              >
                {plan.stripe_price_id ? (plan.price === 0 ? 'Get Started' : 'Subscribe') : 'Details'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
