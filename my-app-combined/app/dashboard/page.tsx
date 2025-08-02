import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link' // Import Link for client-side navigation
import type { Database } from '@/lib/database.types' // Ajusta la ruta si es necesario
import { Home } from 'lucide-react'
import DashboardWrapper from '@/components/dashboard-wrapper'
import DashboardContent from '@/components/dashboard-content'

// Tip: Define un tipo para los activos seleccionados si lo vas a usar mucho
interface SelectedAsset {
  id: string;
  asset_identifier: string;
  asset_type: string | null;
  asset_name: string | null;
  notes: string | null;
  selected_at: string;
}







export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ clear?: string }>
}) {
  const params = await searchParams
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Handle clear parameter
  if (params.clear === 'true') {
    const { error } = await supabase
      .from('user_selected_assets')
      .delete()
      .eq('user_id', session.user.id)
    
    if (error) {
      console.error('Error clearing data:', error)
    } else {
      console.log('Test data cleared successfully')
    }
    
    redirect('/dashboard')
  }

  // Obtener los activos seleccionados por el usuario
  const { data: selectedAssets, error: assetsError } = await supabase
    .from('user_selected_assets')
    .select('*')
    .eq('user_id', session.user.id)
    .not('asset_identifier', 'is', null)
    .order('selected_at', { ascending: false })

  if (assetsError) {
    console.error('Error fetching selected assets:', assetsError.message)
    // Podrías mostrar un mensaje de error en la UI si es necesario
  }

  // Debug: Log para ver qué activos se están obteniendo
  console.log('User ID:', session.user.id)
  console.log('Selected Assets:', selectedAssets)

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
    <DashboardWrapper 
      selectedAssets={selectedAssets ? selectedAssets.map((asset: SelectedAsset) => asset.asset_identifier) : []}
    >
      <DashboardContent
        selectedAssets={selectedAssets || []}
        session={session}
      />
    </DashboardWrapper>
  );
}
