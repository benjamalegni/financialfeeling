// Script para probar la función getRoute en diferentes entornos
// Simula el comportamiento del cliente (navegador)

// Simular diferentes entornos
const environments = [
  {
    name: 'Desarrollo Local',
    window: {
      location: {
        hostname: 'localhost',
        pathname: '/'
      }
    }
  },
  {
    name: 'GitHub Pages (benjamalegni.github.io)',
    window: {
      location: {
        hostname: 'benjamalegni.github.io',
        pathname: '/financialfeeling/'
      }
    }
  },
  {
    name: 'GitHub Pages (path detectado)',
    window: {
      location: {
        hostname: 'example.com',
        pathname: '/financialfeeling/login'
      }
    }
  }
];

// Función getRoute modificada para testing
function getRoute(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Simular la detección del entorno
  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname === 'benjamalegni.github.io' || 
     window.location.pathname.startsWith('/financialfeeling'));
  
  if (isGitHubPages) {
    return `/${cleanPath}`;
  }
  
  return `/financialfeeling/${cleanPath}`;
}

// Probar cada entorno
console.log('🧪 PROBANDO FUNCIÓN GETROUTE EN DIFERENTES ENTORNOS\n');

environments.forEach(env => {
  console.log(`📋 ${env.name}:`);
  
  // Simular el entorno
  global.window = env.window;
  
  // Probar diferentes rutas
  const testRoutes = ['/login', '/signup', '/dashboard', '/'];
  
  testRoutes.forEach(route => {
    const result = getRoute(route);
    console.log(`   getRoute('${route}') → ${result}`);
  });
  
  console.log('');
});

// Limpiar
delete global.window; 