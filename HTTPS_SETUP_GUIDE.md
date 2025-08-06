# 🔒 Configuración HTTPS para financialfeeling.com

## 🎯 Pasos para Activar HTTPS

### **Paso 1: Configurar DNS Correctamente**

Primero asegúrate de que el DNS esté configurado en Namecheap:

**Registros A necesarios:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Registro CNAME:**
```
www → benjamalegni.github.io
```

### **Paso 2: Configurar Dominio Personalizado en GitHub**

1. Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages
2. En **Custom domain** escribe: `financialfeeling.com`
3. **IMPORTANTE**: Marca la casilla **Enforce HTTPS**
4. Haz clic en **Save**

### **Paso 3: Verificar Configuración**

#### **Comandos de verificación:**
```bash
# Verificar que el dominio resuelve a GitHub Pages
curl -I https://financialfeeling.com

# Verificar que www también funciona
curl -I https://www.financialfeeling.com

# Verificar redirección HTTP a HTTPS
curl -I http://financialfeeling.com
```

### **Paso 4: Tiempos de Activación**

- **DNS**: 24-48 horas para propagación completa
- **GitHub Pages**: 10-30 minutos después de configurar el dominio
- **HTTPS/SSL**: **Hasta 24 horas** para activarse automáticamente

## 🔍 Verificación de HTTPS

### **URLs que deberían funcionar con HTTPS:**

✅ **Después de 24 horas:**
- `https://financialfeeling.com/`
- `https://www.financialfeeling.com/`
- `https://financialfeeling.com/login`
- `https://financialfeeling.com/dashboard`

### **Redirecciones automáticas:**
- `http://financialfeeling.com/` → `https://financialfeeling.com/`
- `http://www.financialfeeling.com/` → `https://www.financialfeeling.com/`

## 🆘 Troubleshooting HTTPS

### **Si HTTPS no funciona después de 24 horas:**

#### **1. Verificar configuración en GitHub:**
- Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages
- Confirma que **Enforce HTTPS** esté marcado
- Verifica que no haya errores en la configuración

#### **2. Verificar DNS:**
```bash
# Verificar que el dominio apunta a GitHub Pages
ping financialfeeling.com

# Verificar registros DNS
nslookup financialfeeling.com
```

#### **3. Forzar HTTPS en el código:**

Si necesitas forzar HTTPS, puedes agregar esto a tu aplicación:

```javascript
// En tu aplicación Next.js
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

### **4. Verificar certificado SSL:**

```bash
# Verificar certificado SSL
openssl s_client -connect financialfeeling.com:443 -servername financialfeeling.com
```

## 🔧 Configuración Adicional

### **Para forzar HTTPS en toda la aplicación:**

#### **En `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones
  
  // Forzar HTTPS en producción
  ...(process.env.NODE_ENV === 'production' ? {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains'
            },
          ],
        },
      ]
    },
  } : {}),
}

export default nextConfig
```

### **En `lib/config.ts`:**
```typescript
// Asegurar que todas las URLs usen HTTPS en producción
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'financialfeeling.com' || 
   window.location.hostname === 'www.financialfeeling.com');

const protocol = isProduction ? 'https:' : window.location.protocol;
```

## ✅ Checklist HTTPS

- [ ] DNS configurado correctamente en Namecheap
- [ ] Dominio personalizado configurado en GitHub
- [ ] **Enforce HTTPS** marcado en GitHub
- [ ] Esperar 24-48 horas para propagación
- [ ] Verificar que `https://financialfeeling.com/` funciona
- [ ] Verificar redirección automática de HTTP a HTTPS
- [ ] Probar todas las páginas con HTTPS

## 📞 Soporte

Si HTTPS no funciona después de 48 horas:

1. **GitHub Pages**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain
2. **Namecheap Support**: https://support.namecheap.com/
3. **Verificar estado**: https://www.ssllabs.com/ssltest/analyze.html?d=financialfeeling.com

---
**Fecha**: 6 de Agosto, 2025  
**Estado**: ⏳ **PENDIENTE - Configurar DNS y esperar HTTPS**  
**Próximo paso**: Configurar DNS en Namecheap y esperar 24-48 horas 