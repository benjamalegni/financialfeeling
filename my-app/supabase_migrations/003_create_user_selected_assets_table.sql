-- Crear la tabla user_selected_assets
CREATE TABLE IF NOT EXISTS public.user_selected_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_identifier TEXT NOT NULL, -- Ej: "AAPL", "BTC-USD", "US_Employment_Market", "NASDAQ_COMPOSITE"
    asset_type TEXT, -- Ej: "stock", "crypto", "index", "market_indicator", "forex_pair"
    asset_name TEXT, -- Nombre descriptivo opcional, ej: "Apple Inc.", "Bitcoin", "Índice Compuesto Nasdaq"
    notes TEXT, -- Notas personales del usuario sobre este activo (opcional)
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    CONSTRAINT unique_user_asset UNIQUE (user_id, asset_identifier) -- Un usuario no puede tener el mismo activo duplicado
);

COMMENT ON TABLE public.user_selected_assets IS 'Almacena los activos financieros que un usuario ha seleccionado para seguimiento.';
COMMENT ON COLUMN public.user_selected_assets.asset_identifier IS 'Identificador único del activo (símbolo, ticker, código).';
COMMENT ON COLUMN public.user_selected_assets.asset_type IS 'Tipo de activo para categorización (opcional).';
COMMENT ON COLUMN public.user_selected_assets.asset_name IS 'Nombre legible del activo (opcional, podría obtenerse de una API).';
COMMENT ON COLUMN public.user_selected_assets.notes IS 'Notas o comentarios del usuario sobre el activo seleccionado.';


-- Trigger para actualizar automáticamente el campo updated_at
-- Usamos la misma función trigger_set_timestamp() que se creó en la migración 001.
-- Si no existe (por si las migraciones se corren en diferente orden o la 001 falló/no se corrió), la recreamos.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
        CREATE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $func$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
    END IF;
END
$$;

CREATE TRIGGER set_timestamp_user_selected_assets
BEFORE UPDATE ON public.user_selected_assets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_selected_assets_user_id ON public.user_selected_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_selected_assets_asset_identifier ON public.user_selected_assets(asset_identifier);

-- Habilitar RLS y definir políticas (ejemplos, adaptar según necesidad)
ALTER TABLE public.user_selected_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual user to manage their own selected assets"
ON public.user_selected_assets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fin del script de migración 003
