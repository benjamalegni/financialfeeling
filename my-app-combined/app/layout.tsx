import type { Metadata } from 'next'
import './globals.css'
import { forceHTTPS } from '@/lib/config'
import CanonicalHost from '@/components/CanonicalHost'

export const metadata: Metadata = {
  title: 'Financial Feeling',
  description: 'AI-powered financial analysis and trading insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Forzar HTTPS en producción
  if (typeof window !== 'undefined') {
    forceHTTPS()
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <link rel="dns-prefetch" href="https://s3.tradingview.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                  if (isLocal) return;
                  var targetHost = 'www.financialfeeling.com';
                  var needProto = location.protocol !== 'https:';
                  var needHost = location.hostname !== targetHost;
                  if (needProto || needHost) {
                    var url = new URL(location.href);
                    url.protocol = 'https:';
                    url.hostname = targetHost;
                    location.replace(url.toString());
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CanonicalHost />
        <div className="flex-1 relative z-10">
          {children}
        </div>
        <footer className="relative z-20 border-t border-gray-700 bg-gray-900 text-gray-200 shadow-[0_-1px_0_0_rgba(255,255,255,0.05)]">
          <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm">
            Need help? Contact{' '}
            <a href="mailto:lukabenjaminmalegni@gmail.com" className="text-blue-300 hover:text-blue-200 underline">
              lukabenjaminmalegni@gmail.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
