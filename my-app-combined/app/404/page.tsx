export default function NotFound404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-gray-400">The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-400 hover:text-blue-300 underline">Go back home</a>
      </div>
    </div>
  )
} 