-- Crear la tabla de planes (plans)
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stripe_price_id TEXT UNIQUE, -- ID del precio en Stripe, puede ser nulo si el plan no está en Stripe (ej. plan gratuito gestionado localmente)
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'usd',
    interval TEXT, -- ej: 'month', 'year', NULL para planes gratuitos o de pago único no recurrente
    description TEXT,
    features JSONB, -- ej: '["Feature 1", "Feature 2"]'
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON COLUMN plans.stripe_price_id IS 'ID del precio correspondiente en Stripe';
COMMENT ON COLUMN plans.interval IS 'Frecuencia de facturación: month, year. NULL si no es recurrente.';
COMMENT ON COLUMN plans.features IS 'Lista de características incluidas en el plan.';

-- Crear la tabla de suscripciones (subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    stripe_subscription_id TEXT UNIQUE, -- ID de la suscripción en Stripe, puede ser nulo para planes gratuitos
    stripe_customer_id TEXT NOT NULL, -- Todos los usuarios con suscripción (incluso gratuita si se gestiona pago futuro) deberían tener un customer_id
    status TEXT NOT NULL, -- ej: 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE subscriptions IS 'Almacena las suscripciones de los usuarios a los planes.';
COMMENT ON COLUMN subscriptions.user_id IS 'Referencia al usuario en auth.users.';
COMMENT ON COLUMN subscriptions.plan_id IS 'Referencia al plan suscrito en la tabla plans.';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'ID de la suscripción en Stripe. Nulo si es un plan gratuito no gestionado por Stripe.';
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'ID del cliente en Stripe.';
COMMENT ON COLUMN subscriptions.status IS 'Estado actual de la suscripción (ej: active, trialing, canceled).';
COMMENT ON COLUMN subscriptions.current_period_start IS 'Inicio del período de facturación actual.';
COMMENT ON COLUMN subscriptions.current_period_end IS 'Fin del período de facturación actual.';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Indica si la suscripción se cancelará al final del período actual.';

-- Crear índices para mejorar el rendimiento de las consultas comunes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(active);

-- (Opcional) Habilitar RLS (Row Level Security) si aún no está habilitado para estas tablas
-- Se recomienda configurar políticas RLS específicas después de la creación de las tablas.
-- ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Ejemplo de cómo insertar un plan gratuito y uno premium (esto se haría desde la app o seed data, no aquí directamente en migración productiva sinó como setup inicial)
/*
INSERT INTO plans (name, price, currency, interval, features, active, stripe_price_id) VALUES
('Gratuito', 0.00, 'usd', NULL, '["Análisis IA Básico (limitado)", "Seguimiento de hasta 3 activos"]', TRUE, NULL),
('Premium Mensual', 10.00, 'usd', 'month', '["Análisis IA Completo", "Seguimiento ilimitado de activos", "Historial de pronósticos extendido"]', TRUE, 'price_xxxxxxxxxxxxxx');
*/

-- Nota sobre stripe_price_id y stripe_subscription_id:
-- Para planes gratuitos que no se gestionan a través de Stripe, stripe_price_id y stripe_subscription_id pueden ser NULL.
-- Si un usuario se suscribe a un plan gratuito y luego actualiza a uno de pago, se creará/actualizará el stripe_customer_id y stripe_subscription_id.
-- stripe_customer_id es importante mantenerlo incluso para usuarios gratuitos si se planea que puedan actualizar a planes de pago,
-- ya que Stripe lo usa para vincular suscripciones y métodos de pago a un cliente.
-- Considerar si todos los usuarios (incluso los gratuitos) deben tener un stripe_customer_id creado al registrarse.
-- Esto simplifica la actualización a un plan de pago. Si no, se crearía al iniciar el primer checkout de pago.

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a las tablas
CREATE TRIGGER set_timestamp_plans
BEFORE UPDATE ON plans
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Añadir una columna para el rol del usuario, que podría estar vinculada a su plan/suscripción
-- Esto es un ejemplo y podría gestionarse de otras maneras.
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS app_role TEXT DEFAULT 'free_user';
-- Podrías tener una función que actualice este rol basado en la suscripción activa.

-- Considerar políticas RLS para proteger los datos de los usuarios
-- Ejemplo de política para la tabla de suscripciones:
-- Permitir a los usuarios ver solo sus propias suscripciones.
/*
CREATE POLICY "Allow individual user access to their subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow user to insert their own subscription"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Para la tabla de planes, generalmente todos los usuarios autenticados podrían leer los planes activos.
CREATE POLICY "Allow authenticated users to read active plans"
ON public.plans
FOR SELECT
USING (active = TRUE AND auth.role() = 'authenticated');
*/
-- Las políticas RLS exactas dependerán de tus necesidades específicas de seguridad y acceso.
-- Es crucial definir estas políticas cuidadosamente.
-- Por ahora, las políticas están comentadas. Deberás habilitarlas y configurarlas según sea necesario.
-- Recuerda que para que RLS funcione, debe estar habilitado en la tabla:
-- ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- También, asegúrate de que el usuario/rol que usa Next.js para acceder a Supabase tenga los permisos necesarios (SELECT, INSERT, UPDATE, DELETE) sobre estas tablas.
-- Por defecto, el rol `anon` (anónimo) y `authenticated` tienen ciertos permisos.
-- Puedes ajustar esto en el Dashboard de Supabase > Roles.
-- Para las operaciones de escritura (INSERT, UPDATE) que involucren datos de Stripe, estas generalmente se harán desde funciones seguras del servidor (Edge Functions)
-- que interactúan con la API de Stripe y luego actualizan tu base de datos, en lugar de directamente desde el cliente.
-- Las lecturas de planes y el estado de suscripción del usuario actual sí pueden hacerse desde el cliente con RLS adecuado.
-- Fin del script
