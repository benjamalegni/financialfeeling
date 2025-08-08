'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Send, LogOut, User, BarChart3, Zap, Search, Star, TrendingUp, DollarSign, Bitcoin, Building2, X } from 'lucide-react'
import SimpleTypewriter from '@/components/simple-typewriter'
import { getRandomText } from '@/lib/texts'
import Header from '@/components/header'
import { supabase, getDailyPicksFromDB, upsertDailyPicks } from '@/lib/supabaseClient'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
// Removed SharedSidebar import
import { getRoute } from '@/lib/utils'
import Glide from '@glidejs/glide';
import CandleChart from '@/components/CandleChart';
import BullHead3D from '@/components/BullHead3D';

// Calcular top movers del día basados en variación intradía
const candidateSymbols = [
  'AAPL','TSLA','MSFT','GOOGL','AMZN','META','NVDA','NFLX',
  'JPM','BAC','WFC','GS','JNJ','PFE','UNH','ABBV','XOM','CVX','COP','SPY'
];

async function selectTopMovers(fetchStock: (symbol: string) => Promise<{ x: string, y: [number, number, number, number] }[]>) {
  const results = await Promise.all(candidateSymbols.map(async (symbol) => {
    const data = await fetchStock(symbol);
    const last = data[data.length - 1];
    if (!last) return { symbol, data, changeAbs: -Infinity };
    const [open, _high, _low, close] = last.y;
    const change = open > 0 ? ((close - open) / open) * 100 : 0;
    return { symbol, data, changeAbs: Math.abs(change) };
  }));

  const withData = results.filter(r => r.data && r.data.length > 0);
  if (withData.length === 0) {
    const fallback = ['AAPL','NVDA','TSLA'];
    const fallbackData = await Promise.all(fallback.map(async s => ({ symbol: s, data: await fetchStock(s) })));
    return fallbackData;
  }

  const top3 = withData.sort((a, b) => b.changeAbs - a.changeAbs).slice(0, 3);
  return top3.map(({ symbol, data }) => ({ symbol, data }));
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false) // Cambiado a false para que cargue inmediatamente
  const [message, setMessage] = useState('')
  const [dynamicText, setDynamicText] = useState(getRandomText())
  const [dashboardColor, setDashboardColor] = useState('green')
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [originalAssets, setOriginalAssets] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [analysisData, setAnalysisData] = useState<any>(null)

  // Cambia la declaración de stockCharts para tipar correctamente:
  const [stockCharts, setStockCharts] = useState<{ symbol: string, data: { x: string, y: [number, number, number, number] }[] }[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // Función para obtener datos de una acción
  async function fetchStock(symbol: string) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
      if (!apiKey || apiKey === 'your_twelve_data_api_key_here') {
        console.warn('API key not configured for', symbol);
        return [];
      }
      
      const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${apiKey}&format=JSON`;
      const res = await fetch(url);
      
      if (!res.ok) {
        console.error(`Error fetching data for ${symbol}:`, res.status);
        return [];
      }
      
      const json = await res.json();
      console.log('TwelveData response for', symbol, json);
      
      if (!json.values || !Array.isArray(json.values)) {
        console.error(`No valid data for ${symbol}:`, json);
        return [];
      }
      
      // OHLC para velas
      const data = json.values
        .slice(0, 30)
        .reverse()
        .map((point: any) => ({
          x: point.datetime,
          y: [
            parseFloat(point.open) || 0,
            parseFloat(point.high) || 0,
            parseFloat(point.low) || 0,
            parseFloat(point.close) || 0,
          ],
        }))
        .filter((item: { x: string, y: number[] }) => item.y.every((val: number) => val > 0)); // Filtrar datos válidos
      
      return data;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return [];
    }
  }

  // Función para obtener todos los datos
  async function fetchAll() {
    try {
      setLoadingCharts(true);

      // Check cache in DB for today's picks
      const today = new Date();
      const pickDateISO = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const cached = await getDailyPicksFromDB(pickDateISO);
      if (cached && cached.charts && Array.isArray(cached.charts)) {
        try {
          const parsedCharts = Array.isArray(cached.charts)
            ? cached.charts
            : JSON.parse(typeof cached.charts === 'string' ? cached.charts : JSON.stringify(cached.charts));
          setStockCharts(parsedCharts);
          return;
        } catch (e) {
          console.warn('Failed to parse cached charts, recomputing...', e);
        }
      }

      // Compute and persist
      const selected = await selectTopMovers(fetchStock);
      setStockCharts(selected);

      // Persist to DB
      const symbols = selected.map(s => s.symbol);
      await upsertDailyPicks(pickDateISO, symbols, selected);
    } catch (error) {
      console.error('Error fetching all stocks:', error);
    } finally {
      setLoadingCharts(false);
    }
  }

  // Efecto para cargar los datos de las acciones
  useEffect(() => {
    fetchAll();
  }, []);

  // Efecto para cargar el usuario actual
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error loading session:', error)
        } else if (session?.user) {
          console.log('User loaded:', session.user)
          setUser(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error in loadUser:', error)
      }
    }

    loadUser()

    // Escuchar cambios en la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user)
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const howToSteps = [
    {
      id: 1,
      title: 'Add Your Portfolio',
      description:
        'Select up to 2 assets (e.g., AAPL, TSLA) to track and analyze. You can add them from the + button or the chat box.',
      color: '#3b82f6',
      background: '/backgrounds/wall-street-bull-bg.png'
    },
    {
      id: 2,
      title: 'Run AI Analysis',
      description:
        'Launch the analysis when needed to get sentiment, recommendations and confidence scores for each asset.',
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Review Insights',
      description:
        'Compare signals, check price trends, and review the confidence to make informed decisions.',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Track & Adjust',
      description:
        'Re-run analysis over time, adjust your selection, and monitor how your picks perform.',
      color: '#8b5cf6'
    }
  ]

  const router = useRouter()

  const glideRef = useRef(null);
  useEffect(() => {
    if (glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel',
        perView: 1,
        gap: 32,
        autoplay: 5000,
        hoverpause: true,
      });
      glide.mount();
      return () => glide.destroy();
    }
  }, []);

  // Comprehensive list of financial assets
  const financialAssets = [
    // Stocks - Technology
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', category: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock', category: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock', category: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock', category: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', category: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', type: 'Stock', category: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock', category: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Stock', category: 'Technology' },
    
    // Stocks - Finance
    { symbol: 'JPM', name: 'JPMorgan Chase', type: 'Stock', category: 'Finance' },
    { symbol: 'BAC', name: 'Bank of America', type: 'Stock', category: 'Finance' },
    { symbol: 'WFC', name: 'Wells Fargo', type: 'Stock', category: 'Finance' },
    { symbol: 'GS', name: 'Goldman Sachs', type: 'Stock', category: 'Finance' },
    
    // Stocks - Healthcare
    { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Stock', category: 'Healthcare' },
    { symbol: 'PFE', name: 'Pfizer Inc.', type: 'Stock', category: 'Healthcare' },
    { symbol: 'UNH', name: 'UnitedHealth Group', type: 'Stock', category: 'Healthcare' },
    { symbol: 'ABBV', name: 'AbbVie Inc.', type: 'Stock', category: 'Healthcare' },
    
    // Stocks - Energy
    { symbol: 'XOM', name: 'Exxon Mobil', type: 'Stock', category: 'Energy' },
    { symbol: 'CVX', name: 'Chevron Corporation', type: 'Stock', category: 'Energy' },
    { symbol: 'COP', name: 'ConocoPhillips', type: 'Stock', category: 'Energy' },
    
    // Cryptocurrencies
    { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', category: 'Cryptocurrency' },
    { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', category: 'Cryptocurrency' },
    { symbol: 'BNB', name: 'Binance Coin', type: 'Crypto', category: 'Cryptocurrency' },
    { symbol: 'ADA', name: 'Cardano', type: 'Crypto', category: 'Cryptocurrency' },
    { symbol: 'SOL', name: 'Solana', type: 'Crypto', category: 'Cryptocurrency' },
    { symbol: 'DOT', name: 'Polkadot', type: 'Crypto', category: 'Cryptocurrency' },
    
    // ETFs
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', category: 'Index' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', category: 'Technology' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', category: 'Index' },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', category: 'International' },
    { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', category: 'International' },
    { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'ETF', category: 'Commodity' },
    { symbol: 'SLV', name: 'iShares Silver Trust', type: 'ETF', category: 'Commodity' },
    
    // Commodities
    { symbol: 'GC', name: 'Gold Futures', type: 'Commodity', category: 'Precious Metals' },
    { symbol: 'SI', name: 'Silver Futures', type: 'Commodity', category: 'Precious Metals' },
    { symbol: 'CL', name: 'Crude Oil Futures', type: 'Commodity', category: 'Energy' },
    { symbol: 'NG', name: 'Natural Gas Futures', type: 'Commodity', category: 'Energy' },
    
    // Forex
    { symbol: 'EUR/USD', name: 'Euro/US Dollar', type: 'Forex', category: 'Currency' },
    { symbol: 'GBP/USD', name: 'British Pound/US Dollar', type: 'Forex', category: 'Currency' },
    { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', type: 'Forex', category: 'Currency' },
    { symbol: 'USD/CHF', name: 'US Dollar/Swiss Franc', type: 'Forex', category: 'Currency' },
    { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', type: 'Forex', category: 'Currency' },
  ]

  // Change text every 8 seconds when user is not logged in
  useEffect(() => {
    if (user) return // Don't change text if user is logged in

    const interval = setInterval(() => {
      setDynamicText(getRandomText())
    }, 8000)

    return () => clearInterval(interval)
  }, [user])

  // Change dashboard color randomly
  useEffect(() => {
    const colors = ['green', 'yellow', 'red']
    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setDashboardColor(randomColor)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    setUser(null)
    router.push(getRoute('/login'))
  }

  const handleSendMessage = () => {
    if (!user) {
      // Si no está autenticado, redirigir al login
      router.push(getRoute('/login'))
      return
    }
    
    if (message.trim()) {
      // Procesar múltiples assets separados por comas
      const assets = message.split(',').map(asset => asset.trim().toUpperCase()).filter(asset => asset.length > 0)
      
      if (assets.length > 0) {
        // Verificar que los assets existen en nuestra lista
        const validAssets = assets.filter(asset => 
          financialAssets.some(fa => fa.symbol === asset)
        )
        
        if (validAssets.length > 0) {
          // Agregar los assets válidos al portafolio
          const newAssets = [...selectedAssets]
          validAssets.forEach(asset => {
            if (!newAssets.includes(asset)) {
              newAssets.push(asset)
            }
          })
          setSelectedAssets(newAssets)
          
          // Mostrar mensaje de confirmación
          console.log(`Added ${validAssets.length} assets to portfolio:`, validAssets)
          
          // Limpiar el input
          setMessage('')
          
          // Guardar automáticamente los assets en el portafolio
          savePortfolioFromChat(newAssets)
          
          // Opcional: Abrir el modal de selección de assets para mostrar los cambios
          setShowAssetSelector(true)
        } else {
          console.log('No valid assets found in the message')
        }
      }
    }
  }

  // Filter assets based on search term
  const filteredAssets = financialAssets.filter(asset => {
    const searchLower = searchTerm.toLowerCase()
    return (
      asset.symbol.toLowerCase().includes(searchLower) ||
      asset.name.toLowerCase().includes(searchLower) ||
      asset.category.toLowerCase().includes(searchLower)
    )
  })

  // Autocomplete function
  const getAutocompleteSuggestions = (input: string) => {
    if (!input.trim()) return []
    
    const inputLower = input.toLowerCase()
    return financialAssets.filter(asset => 
      asset.symbol.toLowerCase().includes(inputLower) ||
      asset.name.toLowerCase().includes(inputLower)
    ).slice(0, 5) // Limit to 5 suggestions
  }

  // Handle autocomplete selection
  const handleAutocompleteSelect = (asset: any) => {
    setMessage(asset.symbol)
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
  }

  // Handle input change with autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    
    if (user && value.trim()) {
      const suggestions = getAutocompleteSuggestions(value)
      setAutocompleteSuggestions(suggestions)
      setShowAutocomplete(suggestions.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setShowAutocomplete(false)
      setAutocompleteSuggestions([])
    }
  }

  // Handle keyboard navigation for autocomplete
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showAutocomplete && selectedSuggestionIndex >= 0) {
        e.preventDefault()
        handleAutocompleteSelect(autocompleteSuggestions[selectedSuggestionIndex])
      } else {
        handleSendMessage()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (showAutocomplete) {
        setSelectedSuggestionIndex(prev => 
          prev < autocompleteSuggestions.length - 1 ? prev + 1 : prev
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showAutocomplete) {
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAutocomplete(false)
      setSelectedSuggestionIndex(-1)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleAssetSelection = (symbol: string) => {
    if (selectedAssets.includes(symbol)) {
      setSelectedAssets(selectedAssets.filter(asset => asset !== symbol))
    } else {
      // RESTRICCIÓN: Máximo 2 assets por usuario
      if (selectedAssets.length >= 2) {
        alert('Maximum 2 assets allowed per user. Please remove an asset before adding a new one.')
        return
      }
      setSelectedAssets([...selectedAssets, symbol])
    }
  }

  const savePortfolio = async () => {
    if (!user || selectedAssets.length === 0) return

    try {
      console.log('Portfolio saved successfully:', selectedAssets)
      setOriginalAssets(selectedAssets) // Actualizar los activos originales
      setShowAssetSelector(false)
      setSelectedAssets([]) // Clear selection after saving
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Error saving portfolio. Please try again.')
    }
  }

  const savePortfolioFromChat = async (assets: string[]) => {
    if (!user || assets.length === 0) return

    try {
      console.log('Portfolio saved from chat successfully:', assets)
      setOriginalAssets(assets) // Actualizar los activos originales
    } catch (error) {
      console.error('Error saving portfolio from chat:', error)
    }
  }

  const loadUserAssets = async () => {
    if (!user) return

    try {
      // Simular carga de assets del usuario
      const userAssetSymbols: string[] = []
      setSelectedAssets(userAssetSymbols)
      setOriginalAssets(userAssetSymbols) // Guardar los activos originales
      
      // Si hay assets cargados, limpiar el análisis anterior
      if (userAssetSymbols.length > 0) {
        setAnalysisData(null)
      }
    } catch (error) {
      console.error('Error loading user assets:', error)
    }
  }

  const hasPortfolioChanges = () => {
    if (originalAssets.length !== selectedAssets.length) return true
    
    const sortedOriginal = [...originalAssets].sort()
    const sortedSelected = [...selectedAssets].sort()
    
    return !sortedOriginal.every((asset, index) => asset === sortedSelected[index])
  }

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    console.log('Análisis actualizado automáticamente:', data);
  }

  const handleOpenAssetSelector = () => {
    if (!user) {
      router.push(getRoute('/login'))
      return
    }
    setShowAssetSelector(true)
    loadUserAssets() // Load existing assets when opening
  }

  const getDashboardColorClasses = () => {
    switch (dashboardColor) {
      case 'green':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
      case 'yellow':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600'
      case 'red':
        return 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    }
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Gradiente fijo oscuro violeta y azul */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-purple-900 via-indigo-900 to-black"></div>
      <div className="relative z-10">
        {/* Header */}
        <Header user={user} onSignOut={handleSignOut} />

        {/* Main Content */}
        <div className="pt-24 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2">
                {user ? (
                  `Welcome back, ${user.email}!`
                ) : (
                  <SimpleTypewriter 
                    text={dynamicText} 
                    speed={80} 
                    delay={500}
                    className="text-4xl font-black"
                  />
                )}
              </h1>
              {user && <p className="text-gray-400 mb-8">Ready to dive into your next trading opportunity?</p>}

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative bg-gray-900 rounded-lg border border-gray-700 p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <Input
                        value={message}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          user
                            ? "Type asset symbols (e.g., AAPL, TSLA, MSFT) or click + button..."
                            : "Sign in to start selecting assets with Financial Feeling"
                        }
                        className="bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0"
                        disabled={!user}
                      />
                      
                      {/* Autocomplete Dropdown */}
                      {showAutocomplete && user && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {autocompleteSuggestions.map((asset, index) => (
                            <div
                              key={asset.symbol}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors ${
                                index === selectedSuggestionIndex ? 'bg-gray-700' : ''
                              }`}
                              onClick={() => handleAutocompleteSelect(asset)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    {asset.symbol.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-white font-semibold">{asset.symbol}</div>
                                    <div className="text-gray-400 text-sm">{asset.name}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-semibold">${asset.price}</div>
                                  <div className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="icon" 
                      className="bg-blue-600 hover:bg-blue-700 shadow-md transition-colors" 
                      onClick={handleOpenAssetSelector}
                      disabled={!user}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <Dialog open={showAssetSelector} onOpenChange={setShowAssetSelector}>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white">Select Assets</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Choose up to 2 assets to analyze. You can search by symbol or name.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Search */}
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        {/* Asset Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {financialAssets
                            .filter(asset => 
                              asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              asset.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(asset => (
                              <div
                                key={asset.symbol}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedAssets.includes(asset.symbol)
                                    ? 'bg-blue-600 border-blue-500'
                                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                                }`}
                                onClick={() => handleAssetSelection(asset.symbol)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                      {asset.symbol.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-white font-semibold">{asset.symbol}</div>
                                      <div className="text-gray-400 text-sm">{asset.name}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-gray-400 text-sm">{asset.type}</div>
                                    <div className="text-gray-500 text-xs">{asset.category}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Selected Assets */}
                        {selectedAssets.length > 0 && (
                          <div className="border-t border-gray-700 pt-4">
                            <h4 className="text-white font-semibold mb-2">
                              Selected Assets ({selectedAssets.length}/2) - Click to remove
                              {selectedAssets.length >= 2 && (
                                <span className="text-yellow-400 text-sm ml-2">(Maximum reached)</span>
                              )}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedAssets.map(symbol => {
                                const asset = financialAssets.find(a => a.symbol === symbol)
                                return (
                                  <Badge 
                                    key={symbol} 
                                    className="bg-blue-600 hover:bg-red-600 cursor-pointer transition-colors flex items-center gap-1"
                                    onClick={() => handleAssetSelection(symbol)}
                                  >
                                    {symbol}
                                    <X className="h-3 w-3 hover:text-red-200" />
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Cancel Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-700">
                          <Button
                            variant="outline"
                            onClick={() => setShowAssetSelector(false)}
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-black"
                          >
                            Cancel
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="icon" 
                      className="bg-blue-600 hover:bg-blue-700 shadow-md transition-colors" 
                      onClick={handleSendMessage}
                      disabled={!user || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!user && (
                  <p className="text-gray-500 text-sm mt-2">
                    <Button
                      variant="link"
                      onClick={() => router.push(getRoute('/login'))}
                      className="text-blue-400 hover:text-blue-300 p-0"
                    >
                      Sign in
                    </Button>{" "}
                    to start collaborating with Financial Feeling
                  </p>
                )}
              </div>
            </div>

            {/* AI Analysis Results */}
            {analysisData && user && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">AI Sentiment Analysis Results</h2>
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analysisData.data?.stocks?.map((stock: any, index: number) => (
                        <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                            <Badge className={`${
                              stock.analysis.sentiment === 'positive' ? 'bg-green-600' :
                              stock.analysis.sentiment === 'negative' ? 'bg-red-600' : 'bg-yellow-600'
                            }`}>
                              {stock.analysis.sentiment}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-2">{stock.analysis.recommendation}</p>
                          <p className="text-sm text-gray-400">Confidence: {stock.analysis.confidence}%</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 1. Daily Picks Section - MOVED TO FIRST */}
            <div className="mb-12">
              <h2 className="text-6xl font-bold mb-6 text-center">Our Daily Picks</h2>                        

              {!loadingCharts && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stockCharts.map(stock => (
                    stock.data.length === 0 ? (
                      <div key={stock.symbol} className="text-red-400 bg-black/60 rounded-lg p-4 mb-4">
                        No data available for {stock.symbol}
                      </div>
                    ) : (
                      <div key={stock.symbol} className="relative">
                        <CandleChart symbol={stock.symbol} data={stock.data} />
                        <div className="absolute top-2 right-2 z-10">
                          <Button
                            onClick={() => router.push(`/dashboard?symbol=${stock.symbol}`)}
                            size="sm"
                            className="bg-transparent hover:bg-gray-700 text-white shadow-lg backdrop-blur-md"
                          >
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
              {loadingCharts && (
                <div className="mt-8 text-center text-white">Loading stock charts...</div>
              )}
            </div>

            {/* 2. Learn to Use Section - MOVED TO SECOND */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-6 text-center">Learn to Use Financial Analysis</h2>
              <Card className="bg-transparent border-transparent shadow-none">
                <CardContent className="p-8">
                  <div ref={glideRef} className="glide">
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {howToSteps.map((step, idx) => (
                          <li key={step.id} className="glide__slide text-center flex flex-col justify-center min-h-[280px]">
                            <div 
                              className="bg-black/20 backdrop-blur-md rounded-lg p-8 mx-8 border border-white/60 shadow-2xl shadow-black/50 relative overflow-hidden"
                              style={{
                                backgroundImage: step.background ? `url(${step.background})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundBlendMode: step.background ? 'overlay' : 'normal'
                              }}
                            >
                              {/* Overlay para mejorar legibilidad cuando hay background */}
                              <div className="absolute inset-0 bg-black/40"></div>
                              <div className="relative z-10">
                                <h3 className="mb-4 text-3xl font-semibold text-white" style={{ color: step.color }}>
                                  {idx + 1}. {step.title}
                                </h3>
                                <p className="text-gray-200 text-base">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glide__bullets" data-glide-el="controls[nav]">
                      {howToSteps.map((_, idx) => (
                        <button key={idx} className="glide__bullet" data-glide-dir={`=${idx}`}></button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3. 3D Bull Model Section */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-6 text-center">Get Lucky</h2>
              <BullHead3D />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}