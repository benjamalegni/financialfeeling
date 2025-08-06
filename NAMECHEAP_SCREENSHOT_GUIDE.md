# 📸 Guía Visual para Configurar DNS en Namecheap

## 🎯 Paso a Paso con Capturas

### **Paso 1: Acceder al Panel de Control**
1. Ve a: https://www.namecheap.com/
2. Inicia sesión en tu cuenta
3. Ve a **Domain List**

### **Paso 2: Gestionar el Dominio**
1. Encuentra `financialfeeling.com` en tu lista de dominios
2. Haz clic en **Manage** (al lado del dominio)
3. Ve a la pestaña **Advanced DNS**

### **Paso 3: Configurar Registros DNS**

#### **Eliminar registros existentes (si los hay):**
- Busca registros A o CNAME existentes
- Haz clic en el ícono de **eliminar** (🗑️) para cada uno

#### **Agregar Registros A:**

**Registro A #1:**
```
Type: A Record
Host: @ (dejar completamente vacío)
Value: 185.199.108.153
TTL: Automatic
```

**Registro A #2:**
```
Type: A Record
Host: @ (dejar completamente vacío)
Value: 185.199.109.153
TTL: Automatic
```

**Registro A #3:**
```
Type: A Record
Host: @ (dejar completamente vacío)
Value: 185.199.110.153
TTL: Automatic
```

**Registro A #4:**
```
Type: A Record
Host: @ (dejar completamente vacío)
Value: 185.199.111.153
TTL: Automatic
```

#### **Agregar Registro CNAME:**

**Registro CNAME:**
```
Type: CNAME Record
Host: www
Value: benjamalegni.github.io
TTL: Automatic
```

### **Paso 4: Guardar Cambios**
1. Haz clic en **Save All Changes**
2. Confirma los cambios

### **Paso 5: Configurar en GitHub**
1. Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages
2. En **Custom domain** escribe: `financialfeeling.com`
3. Marca la casilla **Enforce HTTPS**
4. Haz clic en **Save**

## 🔍 Verificación

### **Comandos para verificar:**
```bash
# Verificar que el dominio resuelve correctamente
ping financialfeeling.com

# Verificar que www también funciona
ping www.financialfeeling.com
```

### **URLs para probar (después de 24-48 horas):**
- ✅ `https://financialfeeling.com/`
- ✅ `https://www.financialfeeling.com/`
- ✅ `https://financialfeeling.com/login`
- ✅ `https://financialfeeling.com/dashboard`

## ⏰ Tiempos de Propagación

- **DNS**: 24-48 horas para propagación completa
- **GitHub Pages**: 10-30 minutos después de configurar el dominio
- **SSL/HTTPS**: Hasta 24 horas para activarse automáticamente

## 🆘 Troubleshooting

### **Si no funciona después de 48 horas:**

1. **Verificar registros DNS:**
   - Regresa a Namecheap Advanced DNS
   - Confirma que todos los registros estén correctos
   - Verifica que no haya registros duplicados

2. **Verificar configuración en GitHub:**
   - Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages
   - Confirma que `financialfeeling.com` esté en Custom domain
   - Verifica que **Enforce HTTPS** esté marcado

3. **Contactar soporte:**
   - Namecheap: https://support.namecheap.com/
   - GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain

## 📞 Contacto de Soporte

- **Namecheap Support**: https://support.namecheap.com/
- **GitHub Pages Docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---
**Fecha**: 6 de Agosto, 2025  
**Estado**: 📋 **INSTRUCCIONES LISTAS**  
**Próximo paso**: Configurar DNS en Namecheap siguiendo esta guía 