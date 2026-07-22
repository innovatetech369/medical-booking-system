# 🔒 Política de Seguridad - Sistema de Reservas Médicas

## 1. Protecciones Implementadas

### ✅ Content Security Policy (CSP)
- Restringe scripts a dominios confiables
- Protege contra ataques XSS (Cross-Site Scripting)
- Solo permite recursos de `self` y CDNs verificados

### ✅ Validación de Entrada
- Sanitización de todos los campos de entrada
- Validación de formato de email (regex)
- Validación de formato de teléfono (regex)
- Longitud máxima y mínima de campos

### ✅ Protección contra XSS
- Escapado de HTML en datos mostrados
- No se ejecuta código del usuario
- Prevención de inyección de scripts

### ✅ Headers de Seguridad HTTP
- `X-Frame-Options: DENY` - Protege contra Clickjacking
- `X-Content-Type-Options: nosniff` - Protege contra MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Protección XSS del navegador
- `Referrer-Policy: strict-origin-when-cross-origin` - Control de referrer
- `Strict-Transport-Security` - Fuerza HTTPS
- `Permissions-Policy` - Restringe permisos del navegador

### ✅ Almacenamiento Seguro
- LocalStorage para datos de sesión (no sensibles)
- No se guardan contraseñas ni datos privados
- Datos encriptados al enviar a EmailJS

### ✅ HTTPS Obligatorio
- GitHub Pages usa HTTPS en todos los dominios
- Certificados SSL/TLS válidos

## 2. Buenas Prácticas Implementadas

### 📋 Validación de Datos
```javascript
- Email: Regex de validación
- Teléfono: Regex de validación + longitud mínima
- Nombre: Longitud entre 2-100 caracteres
- Todos los campos sanitizados de caracteres peligrosos
```

### 🛡️ Prevención de Ataques Comunes

| Ataque | Prevención |
|--------|-----------|
| XSS | CSP + Sanitización + Escapado |
| Inyección de HTML | sanitizeInput() + escapeHtml() |
| CSRF | No aplicable (sin backend state) |
| Clickjacking | X-Frame-Options: DENY |
| MIME Sniffing | X-Content-Type-Options: nosniff |

## 3. Datos que se Almacenan

### En LocalStorage (No Sensible)
- ✅ Reservas confirmadas
- ✅ Horarios ocupados
- ✅ Datos públicos de citas

### NO se almacena
- ❌ Contraseñas
- ❌ Tokens de sesión
- ❌ Datos privados del usuario

## 4. Seguridad en EmailJS

### Credenciales Protegidas
- Public Key: Visibilidad pública (por diseño de EmailJS)
- Private Key: NO incluida en el código
- Service ID: Verificado en cada envío
- Template ID: Específico y validado

### Validación en Envío
- Todos los parámetros validados antes de enviar
- Sanitización de datos antes de envío
- Manejo robusto de errores

## 5. Recomendaciones Adicionales

### Para Usuarios
- ✅ No comparta datos sensibles en "Notas especiales"
- ✅ Use una contraseña fuerte en su email
- ✅ Verifique que el sitio use HTTPS (🔒 en la barra)

### Para Administradores
- ✅ Cambiar credenciales de EmailJS regularmente
- ✅ Monitorear logs de acceso
- ✅ Actualizar dependencias regularmente
- ✅ Realizar auditorías de seguridad periódicas

## 6. Cumplimiento de Estándares

- ✅ OWASP Top 10 (Protecciones principales)
- ✅ Best Practices de JavaScript
- ✅ HTML5 Security
- ✅ Privacy by Design

## 7. Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:
1. **NO** la publiques públicamente
2. Envía email a: `angelochisas1@gmail.com`
3. Incluye descripción detallada
4. Espera respuesta dentro de 48 horas

---

**Última actualización:** 2026-07-22
**Versión:** 1.0 - Security Hardening
