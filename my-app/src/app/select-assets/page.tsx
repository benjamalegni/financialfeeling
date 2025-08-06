'use client'

import { useState, FormEvent, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types' // Ajusta la ruta si es necesario

// Tipos simulados para la búsqueda de activos. Reemplazar con una API real si es posible.
interface MockAsset {
  id: string // Ej: "AAPL", "BTC-USD", "US_TREASURY_10Y"
  name: string // Ej: "Apple Inc.", "Bitcoin", "US 10 Year Treasury"
  type: string // Ej: "Stock", "Crypto", "Bond", "Index", "Market"
}

// Lista mock de activos. En un caso real, esto vendría de una API de búsqueda.
const mockAssetDatabase: MockAsset[] = [
  { id: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
  { id: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
  { id: 'GOOGL', name: 'Alphabet Inc. (Google)', type: 'Stock' },
  { id: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
  { id: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
  { id: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
  { id: 'BTC-USD', name: 'Bitcoin', type: 'Crypto' },
  { id: 'ETH-USD', name: 'Ethereum', type: 'Crypto' },
  { id: 'SOL-USD', name: 'Solana', type: 'Crypto' },
  { id: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF/Index' },
  { id: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq-100)', type: 'ETF/Index' },
  { id: 'US_TREASURY_10Y', name: 'US 10-Year Treasury Yield', type: 'Market Indicator' },
  { id: 'VIX', name: 'CBOE Volatility Index', type: 'Market Indicator' },
  { id: 'EURUSD=X', name: 'EUR/USD Forex', type: 'Forex' },
  { id: 'GOLD', name: 'Gold Spot Price', type: 'Commodity' },
  { id: 'OIL', name: 'Crude Oil (WTI)', type: 'Commodity' },
  { id: 'US_EMPLOYMENT_MARKET', name: 'US Employment Market', type: 'Market' },
  { id: 'NASDAQ_COMPOSITE', name: 'Nasdaq Composite Index', type: 'Index' },
  { id: 'DOW_JONES_INDUSTRIAL', name: 'Dow Jones Industrial Average', type: 'Index' },
];

export default function SelectAssetsPage() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<MockAsset[]>([])
  const [selectedAssets, setSelectedAssets] = useState<Map<string, MockAsset>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
      } else {
        router.push('/login') // Redirigir si no hay sesión
      }
    }
    getUser()
  }, [supabase, router])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      return
    }
    const filtered = mockAssetDatabase.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setSearchResults(filtered.slice(0, 10)) // Limitar a 10 resultados por simplicidad
  }, [searchTerm])

  const toggleAssetSelection = (asset: MockAsset) => {
    setSelectedAssets(prev => {
      const newSelection = new Map(prev)
      if (newSelection.has(asset.id)) {
        newSelection.delete(asset.id)
      } else {
        newSelection.set(asset.id, asset)
      }
      return newSelection
    })
  }

  const handleSaveSelection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId) {
      setError('User not authenticated.')
      return
    }
    if (selectedAssets.size === 0) {
      setError('Please select at least one asset.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    const assetsToSave = Array.from(selectedAssets.values()).map(asset => ({
      user_id: userId,
      asset_identifier: asset.id,
      asset_type: asset.type,
      asset_name: asset.name,
    }))

    // En una implementación real, podrías querer hacer upsert o manejar duplicados de otra forma.
    // Por ahora, borraremos las anteriores y guardaremos las nuevas para este usuario.
    // O mejor, usamos la restricción UNIQUE (user_id, asset_identifier) y ON CONFLICT DO NOTHING o DO UPDATE.
    // El script SQL ya tiene la restricción UNIQUE.

    // Primero, obtener los activos ya guardados por el usuario para evitar duplicados o para hacer un diff.
    // O simplemente confiar en la restricción UNIQUE y manejar el error o usar ON CONFLICT.

    // Simplificado: Intentar insertar y dejar que la DB maneje conflictos si ya existen.
    // Para un mejor UX, se podría informar al usuario cuáles ya estaban seleccionados.
    const { data, error: insertError } = await supabase
      .from('user_selected_assets')
      .upsert(assetsToSave, { onConflict: 'user_id,asset_identifier', ignoreDuplicates: false }) // ignoreDuplicates: false para que actualice si hay conflicto
      .select()


    if (insertError) {
      console.error('Error saving selected assets:', insertError)
      setError(`Failed to save selection: ${insertError.message}`)
    } else {
      setSuccessMessage(`Selection saved! ${data?.length || 0} assets are now being tracked.`)
      setSelectedAssets(new Map()) // Limpiar selección actual tras guardar
      setSearchTerm('')
      // Opcionalmente, redirigir al dashboard o mostrar un resumen
      // router.push('/dashboard')
    }
    setIsLoading(false)
  }

  if (!userId && !isLoading) { // Prevenir renderizado si no hay userId y no se está cargando el user
      return (
        <div className="min-h-screen bg-n8n-dark text-n8n-text-primary flex justify-center items-center">
            <p>Loading user session...</p>
        </div>
      )
  }


  return (
    <div className="min-h-screen bg-n8n-dark text-n8n-text-primary font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-n8n-surface p-6 md:p-8 rounded-lg shadow-xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-n8n-accent hover:text-n8n-accent-hover transition-colors"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-n8n-accent mb-6 text-center">Select Assets for Tracking</h1>

        <form onSubmit={handleSaveSelection} className="space-y-6">
          <div>
            <label htmlFor="searchAssets" className="block text-sm font-medium text-n8n-text-secondary mb-1">
              Search for Assets (Stocks, Crypto, Indices, etc.)
            </label>
            <input
              id="searchAssets"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., AAPL, Bitcoin, Nasdaq Composite"
              className="mt-1 block w-full px-3 py-2 bg-n8n-dark border border-n8n-border rounded-md shadow-sm placeholder-n8n-text-secondary focus:outline-none focus:ring-n8n-accent focus:border-n8n-accent sm:text-sm text-n8n-text-primary"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto bg-n8n-dark p-3 rounded-md border border-n8n-border">
              <ul className="space-y-2">
                {searchResults.map((asset) => (
                  <li
                    key={asset.id}
                    onClick={() => toggleAssetSelection(asset)}
                    className={`p-2 rounded-md cursor-pointer flex justify-between items-center transition-colors
                                            ${selectedAssets.has(asset.id) ? 'bg-n8n-accent text-white' : 'hover:bg-n8n-button-hover'}`}
                  >
                    <span>{asset.name} ({asset.id}) - <span className="text-xs opacity-70">{asset.type}</span></span>
                    {selectedAssets.has(asset.id) && <span className="text-xs">(Selected)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchTerm && searchResults.length === 0 && (
            <p className="text-n8n-text-secondary text-sm text-center">No assets found for &quot;{searchTerm}&quot;.</p>
          )}

          {selectedAssets.size > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-n8n-accent-hover mb-2">Selected Assets:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(selectedAssets.values()).map(asset => (
                  <span key={asset.id} className="bg-n8n-button text-white px-2 py-1 rounded-full text-sm flex items-center">
                    {asset.name}
                    <button
                      type="button"
                      onClick={() => toggleAssetSelection(asset)}
                      className="ml-2 text-n8n-error hover:text-red-400"
                      aria-label={`Remove ${asset.name}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-n8n-error/20 border border-n8n-error text-n8n-error px-4 py-3 rounded-md" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-n8n-success/20 border border-n8n-success text-n8n-success px-4 py-3 rounded-md" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || selectedAssets.size === 0}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-accent hover:bg-n8n-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-n8n-surface focus:ring-n8n-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : `Save ${selectedAssets.size} Selected Asset(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
