import Link from 'next/link'
import { Home } from 'lucide-react'
import SharedSidebar from '@/components/shared-sidebar'

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Home Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-white text-xl font-bold">FF</div>
          <Link
            href="/"
            className="text-white transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Shared Sidebar */}
      <SharedSidebar />

      {/* Main Content */}
      <div className="ml-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 hidden sm:block">
                  example@email.com
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Example Page
            </h1>
            <p className="text-gray-400 mb-8">This page demonstrates the shared sidebar component</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Shared Sidebar Example</h2>
              <p className="text-gray-400 mb-6">
                This page uses the same SharedSidebar component as the dashboard and main page.
                You can see that the sidebar looks exactly the same across all pages.
              </p>
              <div className="text-center">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 