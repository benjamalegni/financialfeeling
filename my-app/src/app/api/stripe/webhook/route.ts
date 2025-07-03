import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js' // Usar createClient directamente para webhooks

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10', // Asegúrate que coincida con la de create-checkout-session
  typescript: true,
})

// Clave secreta del endpoint de webhook de Stripe (¡MUY IMPORTANTE!)
// Deberás obtenerla desde tu Dashboard de Stripe al configurar el endpoint del webhook.
// Guárdala en tus variables de entorno.
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// Inicializar el cliente de Supabase para operaciones de backend
// Estas variables deben estar en el entorno donde se ejecuta esta función (ej. Vercel, Supabase Edge Functions)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '' // ¡Usa la service_role key aquí!

if (!supabaseServiceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set. Webhook handler cannot operate securely.');
}
// Es importante usar la service_role key para operaciones de backend que modifican datos
// y necesitan saltarse las políticas RLS. Asegúrate de que esta variable esté disponible
// en el entorno de despliegue de esta función.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)


export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('Webhook error: Missing Stripe signature.')
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  if (!stripeWebhookSecret) {
    console.error('Webhook error: Stripe Webhook Secret is not configured.')
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  // Manejar el evento
  // Referencia de tipos de evento: https://stripe.com/docs/api/events/types
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': // También maneja cancelaciones, fin de pruebas, etc.
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        // Este evento es crucial. Aquí es donde normalmente crearías/actualizarías
        // la suscripción en tu base de datos por primera vez.
        await handleCheckoutSessionCompleted(session)
        break

      // case 'invoice.payment_succeeded':
      //   const invoice = event.data.object as Stripe.Invoice;
      //   // Usado para cuando una suscripción se renueva exitosamente.
      //   // Podrías actualizar current_period_start y current_period_end aquí si es necesario,
      //   // aunque customer.subscription.updated también suele cubrir esto.
      //   if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
      //       const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
      //       const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      //       await handleSubscriptionChange(stripeSubscription);
      //   }
      //   break;

      // case 'invoice.payment_failed':
      //   // El pago de una factura de suscripción falló.
      //   // customer.subscription.updated con status 'past_due' o 'unpaid' también se dispara.
      //   // Puedes manejar notificaciones al usuario aquí.
      //   break;

      default:
        console.log(`Unhandled Stripe webhook event type: ${event.type}`)
    }
  } catch (error: any) {
      console.error(`Error handling webhook event ${event.type}:`, error.message)
      // Devolver un error 500 podría hacer que Stripe reintente el webhook si es apropiado.
      // Si el error es debido a un problema de nuestra lógica que no se resolverá con un reintento,
      // podríamos considerar devolver un 200 para evitar reintentos infinitos para ese evento específico.
      // Por ahora, devolvemos 500 para indicar un problema en nuestro lado.
      return NextResponse.json({ error: 'Webhook handler failed. Please check logs.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}


async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { id: stripe_subscription_id, customer, status, current_period_start, current_period_end, cancel_at_period_end, canceled_at, ended_at, trial_start, trial_end } = subscription
  const stripe_customer_id = typeof customer === 'string' ? customer : customer.id

  // Obtener el user_id de tus metadatos o de tu tabla de clientes/perfiles
  // Esto asume que guardaste userId en los metadatos del cliente de Stripe o tienes una tabla que mapea stripe_customer_id a user_id.
  // Si está en los metadatos del cliente de Stripe:
  const stripeCustomer = await stripe.customers.retrieve(stripe_customer_id) as Stripe.Customer;
  const userId = stripeCustomer.metadata?.userId;

  if (!userId) {
      console.error(`Webhook Error: No userId found in Stripe customer metadata for customer ${stripe_customer_id}. Cannot update subscription.`);
      // Podrías decidir lanzar un error aquí o simplemente loguearlo.
      // Si no puedes asociar la suscripción a un usuario, no puedes actualizar tu DB.
      return;
  }

  // Obtener el plan_id de tu tabla 'plans' usando el price ID de la suscripción
  // Stripe Subscription object tiene items.data[0].price.id
  const priceId = subscription.items.data[0]?.price.id
  let planId = null

  if (priceId) {
    const { data: planData, error: planError } = await supabaseAdmin
      .from('plans')
      .select('id')
      .eq('stripe_price_id', priceId)
      .single()

    if (planError) {
      console.error(`Webhook Error: Could not find plan with stripe_price_id ${priceId}:`, planError.message)
      // Decide cómo manejar esto. ¿Continuar sin plan_id? ¿Error?
    } else {
      planId = planData.id
    }
  } else {
      console.warn(`Webhook Warning: Subscription ${stripe_subscription_id} has no price ID. Cannot determine plan_id.`);
  }


  const subscriptionDataForDb = {
    user_id: userId,
    plan_id: planId, // Puede ser null si no se encontró o no hay priceId
    stripe_subscription_id,
    stripe_customer_id,
    status,
    current_period_start: new Date(current_period_start * 1000).toISOString(),
    current_period_end: new Date(current_period_end * 1000).toISOString(),
    cancel_at_period_end: cancel_at_period_end || false,
    canceled_at: canceled_at ? new Date(canceled_at * 1000).toISOString() : null,
    ended_at: ended_at ? new Date(ended_at * 1000).toISOString() : null,
    trial_start: trial_start ? new Date(trial_start * 1000).toISOString() : null,
    trial_end: trial_end ? new Date(trial_end * 1000).toISOString() : null,
  }

  // Upsert en la tabla de suscripciones
  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert(subscriptionDataForDb, { onConflict: 'stripe_subscription_id' })

  if (upsertError) {
    console.error(`Webhook Error: Failed to upsert subscription ${stripe_subscription_id} for user ${userId}:`, upsertError.message)
    throw new Error(`Failed to upsert subscription: ${upsertError.message}`);
  } else {
    console.log(`Subscription ${status} for ${stripe_subscription_id} (user ${userId}) processed successfully.`)
    // Aquí también podrías actualizar el rol del usuario si tienes una columna de rol
    // basada en el estado de la suscripción y el plan.
  }
}


async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const stripe_subscription_id = session.subscription
    const stripe_customer_id = session.customer
    const userId = session.metadata?.userId

    if (!userId) {
        console.error('Webhook Error: checkout.session.completed missing userId in metadata. Session ID:', session.id)
        return; // No se puede procesar sin userId
    }

    if (!stripe_subscription_id || typeof stripe_subscription_id !== 'string') {
        console.error('Webhook Error: checkout.session.completed missing or invalid subscription ID. Session ID:', session.id)
        // Esto puede ocurrir para pagos únicos, pero este manejador es para suscripciones.
        return;
    }

    if (!stripe_customer_id || typeof stripe_customer_id !== 'string') {
        console.error('Webhook Error: checkout.session.completed missing or invalid customer ID. Session ID:', session.id)
        return;
    }

    // Recuperar los detalles completos de la suscripción desde Stripe, ya que la sesión no los tiene todos.
    const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id as string)

    // Ahora tenemos el objeto de suscripción completo, podemos usar la misma lógica que handleSubscriptionChange.
    // Esto asegura que todos los campos relevantes (como plan_id, period_end, etc.) se establezcan correctamente.
    await handleSubscriptionChange(subscription);

    // Opcional: Si no guardaste el stripe_customer_id cuando se creó en create-checkout-session,
    // este es un buen lugar para asegurarte de que esté asociado a tu usuario en una tabla de perfiles.
    // Ejemplo:
    // const { error: profileError } = await supabaseAdmin
    //   .from('user_profiles') // Asumiendo que tienes una tabla user_profiles
    //   .upsert({ user_id: userId, stripe_customer_id: stripe_customer_id }, { onConflict: 'user_id' });
    // if (profileError) {
    //   console.error(`Webhook Error: Failed to update profile with stripe_customer_id ${stripe_customer_id} for user ${userId}:`, profileError.message);
    // }

    console.log(`Checkout session ${session.id} completed for user ${userId}, subscription ${stripe_subscription_id}.`)
}


// Notas importantes sobre este manejador de webhooks:
// 1. Seguridad del Webhook Secret: `STRIPE_WEBHOOK_SECRET` es VITAL. Sin él, cualquiera podría enviar datos falsos a tu endpoint.
//    Obtenlo de tu Stripe Dashboard cuando configures el endpoint del webhook.
//    Asegúrate de que esta variable de entorno esté disponible donde se despliega esta función.
//
// 2. Supabase Service Role Key: Para operaciones de backend como esta, que necesitan modificar datos
//    potencialmente saltándose RLS (o con permisos elevados), debes usar la `service_role` key de Supabase.
//    NO uses la `anon` key aquí. `SUPABASE_SERVICE_ROLE_KEY` debe estar en tus variables de entorno del servidor.
//
// 3. Idempotencia: Los webhooks pueden ser enviados por Stripe múltiples veces (por ejemplo, si tu endpoint no responde
//    rápidamente con un 2xx o si hay problemas de red). Tu lógica para manejar eventos debe ser idempotente,
//    lo que significa que procesar el mismo evento múltiples veces no debería causar efectos secundarios no deseados
//    (como crear múltiples suscripciones para el mismo evento). El `upsert` con `onConflict` ayuda con esto.
//
// 4. Mapeo de `stripe_customer_id` a `user_id`: Es crucial poder mapear el `stripe_customer_id` (o la suscripción)
//    de vuelta a tu `user_id` interno. La forma más común es guardar el `userId` en los metadatos del objeto Customer
//    o Subscription de Stripe cuando se crean, y luego recuperarlo aquí. El ejemplo asume `userId` en `customer.metadata.userId`.
//
// 5. Mapeo de `price_id` a `plan_id`: Para asociar la suscripción de Stripe con tu tabla `plans` interna,
//    necesitas buscar el `plan_id` basado en el `price.id` que viene en el objeto de suscripción de Stripe.
//
// 6. Manejo de Errores y Logging: El logging aquí es básico. En producción, querrás un logging más estructurado y
//    posiblemente un sistema de alertas para fallos en el procesamiento de webhooks.
//
// 7. Tipos de Eventos: Solo se manejan algunos eventos comunes. Revisa la lista de eventos de Stripe
//    (https://stripe.com/docs/api/events/types) y decide cuáles son relevantes para tu lógica de negocio.
//    Por ejemplo, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.trial_will_end`.
//
// 8. Pruebas: Usa la CLI de Stripe ( `stripe listen --forward-to localhost:3000/api/stripe/webhook` ) para probar
//    tus webhooks localmente durante el desarrollo. Stripe también te permite enviar eventos de prueba desde el Dashboard.
//
// 9. Variables de Entorno Faltantes: El código incluye comprobaciones para `stripeWebhookSecret` y `supabaseServiceRoleKey`.
//    Si no están configuradas, el webhook no funcionará correctamente o de forma segura.
//
// Este endpoint debe ser configurado en tu Dashboard de Stripe:
// Developers > Webhooks > Add endpoint.
// URL del endpoint: https://<tu-dominio-o-url-de-vercel>/api/stripe/webhook
// Eventos a escuchar: Como mínimo `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
// Considera añadir también eventos de facturas (`invoice.payment_succeeded`, `invoice.payment_failed`).
//
// Este archivo debe estar en `my-app/src/app/api/stripe/webhook/route.ts`
//
// La función `handleSubscriptionChange` se ha hecho genérica para ser usada por múltiples eventos de suscripción.
// La función `handleCheckoutSessionCompleted` es específica para cuando el checkout se completa,
// y luego llama a `handleSubscriptionChange` para la lógica de upsert de la suscripción.
//
// Recuerda que la `service_role` key de Supabase tiene permisos de administrador sobre tu base de datos,
// así que mantenla SECRETA y úsala solo en entornos de backend seguros.
// No la expongas en el lado del cliente ni en tu código fuente público.
//
// El `console.error` para `SUPABASE_SERVICE_ROLE_KEY` no configurada es importante.
// Sin esta clave, las operaciones de base de datos probablemente fallarán o no tendrán los permisos correctos.
//
// Es importante que el `stripe_customer_id` se asocie correctamente al `user_id`.
// Si creas el `stripe.customers.create` en `create-checkout-session` y guardas el `userId` en `metadata`,
// entonces en el webhook `checkout.session.completed`, el objeto `session.customer` (que es el ID del cliente)
// te permitirá recuperar ese cliente de Stripe y sus metadatos para obtener tu `userId` interno.
// El ejemplo actual lo hace en `handleSubscriptionChange` recuperando el cliente de Stripe.
//
// Si `planId` no se encuentra (porque el `stripe_price_id` en la suscripción no coincide con ninguno en tu tabla `plans`),
// la columna `plan_id` en la tabla `subscriptions` será `NULL`. Deberás decidir cómo manejar esta situación.
// Podría indicar un desajuste de configuración entre Stripe y tu base de datos.
//
// La conversión de timestamps de Stripe (que están en segundos desde la época Unix) a cadenas ISO
// se hace con `new Date(timestamp * 1000).toISOString()`.
