-- Adaptar la tabla plans para múltiples pasarelas
ALTER TABLE public.plans
ADD COLUMN gateway TEXT NOT NULL DEFAULT 'stripe';

-- Renombrar stripe_price_id a gateway_plan_id
-- Primero, eliminamos la restricción UNIQUE existente en stripe_price_id si existe
-- El nombre de la restricción puede variar, necesitas verificarlo en tu DDL o dashboard de Supabase.
-- Comúnmente es plans_stripe_price_id_key. Si es diferente, ajusta el script.
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'plans_stripe_price_id_key' AND conrelid = 'public.plans'::regclass) THEN
      ALTER TABLE public.plans DROP CONSTRAINT plans_stripe_price_id_key;
   END IF;
END $$;

ALTER TABLE public.plans
RENAME COLUMN stripe_price_id TO gateway_plan_id;

-- Añadir una nueva restricción UNIQUE para la combinación de gateway y gateway_plan_id (si gateway_plan_id no es NULL)
-- No podemos tener una restricción UNIQUE directa que ignore NULLs de esta manera en todos los PostgreSQL.
-- Una forma es crear un índice único condicional.
CREATE UNIQUE INDEX IF NOT EXISTS unique_gateway_plan_id_not_null
ON public.plans (gateway, gateway_plan_id)
WHERE gateway_plan_id IS NOT NULL;

-- Comentar la columna gateway
COMMENT ON COLUMN public.plans.gateway IS 'Pasarela de pago (ej: stripe, mercadopago)';
COMMENT ON COLUMN public.plans.gateway_plan_id IS 'ID del plan/precio en la pasarela de pago correspondiente';


-- Adaptar la tabla subscriptions para múltiples pasarelas
ALTER TABLE public.subscriptions
ADD COLUMN gateway TEXT NOT NULL DEFAULT 'stripe';

-- Renombrar stripe_subscription_id a gateway_subscription_id
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_stripe_subscription_id_key' AND conrelid = 'public.subscriptions'::regclass) THEN
      ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_stripe_subscription_id_key;
   END IF;
END $$;
ALTER TABLE public.subscriptions
RENAME COLUMN stripe_subscription_id TO gateway_subscription_id;

-- Renombrar stripe_customer_id a gateway_customer_id
-- No se espera una restricción UNIQUE directa solo en stripe_customer_id, pero si la hubiera, habría que dropearla.
ALTER TABLE public.subscriptions
RENAME COLUMN stripe_customer_id TO gateway_customer_id;

-- Añadir una nueva restricción UNIQUE para la combinación de gateway y gateway_subscription_id (si gateway_subscription_id no es NULL)
CREATE UNIQUE INDEX IF NOT EXISTS unique_gateway_subscription_id_not_null
ON public.subscriptions (gateway, gateway_subscription_id)
WHERE gateway_subscription_id IS NOT NULL;

-- Considerar una restricción para asegurar que un usuario no tenga múltiples gateway_customer_id para la misma pasarela.
-- Esto podría ser más complejo si un usuario puede tener múltiples suscripciones con la misma pasarela pero diferentes customer IDs (poco común).
-- Por ahora, nos enfocamos en la unicidad de la suscripción.
-- Podríamos añadir un índice único en (user_id, gateway) a una tabla de 'user_payment_profiles' si la creamos.

-- Comentar las nuevas columnas
COMMENT ON COLUMN public.subscriptions.gateway IS 'Pasarela de pago (ej: stripe, mercadopago)';
COMMENT ON COLUMN public.subscriptions.gateway_subscription_id IS 'ID de la suscripción en la pasarela de pago correspondiente';
COMMENT ON COLUMN public.subscriptions.gateway_customer_id IS 'ID del cliente en la pasarela de pago correspondiente';

-- Actualizar los triggers para que sigan funcionando (no necesitan cambios ya que solo actualizan updated_at)
-- No es necesario recrear los triggers set_timestamp_plans y set_timestamp_subscriptions.

-- Nota:
-- Después de ejecutar este script, los datos existentes en las columnas renombradas se conservarán.
-- Las nuevas columnas 'gateway' tendrán el valor por defecto 'stripe'.
-- Deberás actualizar manualmente los registros de planes existentes para reflejar la pasarela correcta si ya tienes datos de Mercado Pago
-- o si algunos planes de Stripe ya estaban destinados a ser solo de Stripe.
-- Los nuevos índices UNIQUE condicionales aseguran la integridad de los datos para los IDs de pasarela.
-- Si los nombres de las restricciones UNIQUE originales eran diferentes, este script podría necesitar ajustes.
-- Puedes encontrar los nombres exactos en el panel de Supabase o inspeccionando la DDL de la tabla.
-- Por ejemplo, para encontrar el nombre de la restricción de unicidad en `stripe_price_id` en la tabla `plans`:
/*
SELECT conname
FROM pg_constraint
WHERE conrelid = 'public.plans'::regclass
  AND contype = 'u'
  AND CASE WHEN (SELECT COUNT(*) FROM unnest(conkey) elem WHERE elem = (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.plans'::regclass AND attname = 'stripe_price_id')) > 0 THEN TRUE ELSE FALSE END;
*/
-- Y similar para `subscriptions_stripe_subscription_id_key`.
-- El script intenta eliminar las restricciones con nombres comunes, pero es mejor verificar.
-- Fin del script de migración 002
