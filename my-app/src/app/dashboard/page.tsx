import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link' // Import Link for client-side navigation
import type { Database } from '@/lib/database.types' // Ajusta la ruta si es necesario

// Tip: Define un tipo para los activos seleccionados si lo vas a usar mucho
interface SelectedAsset {
  id: string;
  asset_identifier: string;
  asset_type: string | null;
  asset_name: string | null;
  notes: string | null;
  selected_at: string;
}


// Component for Sign Out Button (ya estaba bien, solo ajustando clases si es necesario)
async function SignOutButton() {
  const handleSignOut = async () => {
    'use server'
    const supabase = createServerComponentClient<Database>({ cookies })
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="px-4 py-2 bg-n8n-button hover:bg-n8n-button-hover text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
      >
        Sign Out
      </button>
    </form>
  )
}

// Componente para mostrar los activos seleccionados (ejemplo básico)
function TrackedAssetsList({ assets }: { assets: SelectedAsset[] }) {
  if (assets.length === 0) {
    return <p className="text-n8n-text-secondary mt-4">You are not currently tracking any assets.</p>
  }
  return (
    <div className="mt-6 space-y-3">
      {assets.map(asset => (
        <div key={asset.id} className="bg-n8n-surface p-4 rounded-md shadow-lg border border-n8n-border">
          <h3 className="text-lg font-semibold text-n8n-accent-hover">{asset.asset_name || asset.asset_identifier}</h3>
          {asset.asset_type && <p className="text-sm text-n8n-text-secondary">Type: {asset.asset_type}</p>}
          {asset.asset_identifier && asset.asset_name && <p className="text-xs text-n8n-text-secondary">Identifier: {asset.asset_identifier}</p>}
          {/* Aquí podrías añadir más detalles o un enlace para ver noticias/pronósticos de este activo */}
        </div>
      ))}
    </div>
  )
}


export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Obtener los activos seleccionados por el usuario
  const { data: selectedAssets, error: assetsError } = await supabase
    .from('user_selected_assets')
    .select('*')
    .eq('user_id', session.user.id)
    .order('selected_at', { ascending: false })

  if (assetsError) {
    console.error('Error fetching selected assets:', assetsError.message)
    // Podrías mostrar un mensaje de error en la UI si es necesario
  }

  // No es necesario obtener el perfil de usuario aquí si solo necesitas el email, ya está en session.user.email
  // const { data: userProfile, error: userError } = await supabase
  //   .from('users') // Esta tabla 'users' es de Supabase Auth, no una tabla de perfiles 'public.users' a menos que la hayas creado así.
  //   .select('email') // El email ya está en session.user.email. Si tienes una tabla 'profiles' con más datos, úsala.
  //   .eq('id', session.user.id)
  //   .single()

  // if (userError && userError.code !== 'PGRST116') {
  //   console.error('Error fetching user profile:', userError.message)
  // }

  return (
    <div className="min-h-screen bg-n8n-dark text-n8n-text-primary font-sans p-4 md:p-8">
      {/* Ejemplo de un fondo con gradiente sutil o imagen si se desea, o mantener color sólido */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-n8n-dark via-gray-900 to-n8n-surface opacity-50 -z-10"></div> */}

      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-n8n-border">
        <h1 className="text-3xl font-bold text-n8n-accent mb-4 sm:mb-0">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-n8n-text-secondary hidden sm:block">
            {session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>

      <section className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-n8n-text-primary mb-3 sm:mb-0">Tracked Financial Assets</h2>
          <Link
            href="/select-assets"
            className="px-5 py-2.5 bg-n8n-accent hover:bg-n8n-accent-hover text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add / Manage Assets
          </Link>
        </div>

        {/* Contenedor con posible efecto acrílico/blur si se desea para la lista de activos */}
        <div className="bg-n8n-surface/70 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-xl border border-n8n-border">
          {selectedAssets && selectedAssets.length > 0 ? (
            <TrackedAssetsList assets={selectedAssets as SelectedAsset[]} />
          ) : (
            <div className="text-center py-8">
              <p className="text-n8n-text-secondary mb-4">
                You are not tracking any assets yet.
              </p>
              <Link
                href="/select-assets"
                className="px-6 py-3 bg-n8n-accent hover:bg-n8n-accent-hover text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out inline-block"
              >
                Select Assets to Track
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sección para mostrar noticias/pronósticos (Placeholder) */}
      <section>
        <h2 className="text-2xl font-semibold text-n8n-text-primary mb-4">Market News & AI Insights</h2>
        <div className="bg-n8n-surface/70 backdrop-blur-md p-6 rounded-lg shadow-xl border border-n8n-border">
          <p className="text-center text-n8n-text-secondary">
            News feed and AI-driven financial forecasts will appear here soon.
          </p>
          {/* Aquí iría el componente que llama al agente de IA de n8n o muestra datos */}
           <div className="mt-6 text-center">
             <Link
                href="/ia-analysis"
                className="px-6 py-3 bg-n8n-button hover:bg-n8n-button-hover text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out inline-block"
              >
                Go to AI Analysis Page
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
