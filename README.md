# 🏥 Sistema de Reservas Médicas - Agendar Citas

Un sistema profesional de gestión de citas médicas para clínicas y centros de salud multipunto.

## ✨ Características

✅ **Reservas médicas en línea**
- Seleccionar centro médico (sede)
- Elegir especialista médico
- Seleccionar fecha y hora disponible
- Formulario con datos del paciente
- Confirmación automática + WhatsApp

✅ **Calendario interactivo**
- Navegar meses fácilmente
- Bloquear fechas pasadas
- Ver horarios disponibles por especialidad

✅ **Múltiples centros y especialidades**
- Centro Médico
- Centro Médico Av Plaza
- Centro Médico Howarts
- Oftalmología
- Neurología
- Odontología
- Pediatría

✅ **Panel de administración**
- Ver todas las reservas
- Filtrar por estado y servicio
- Marcar completadas o cancelar
- Estadísticas en tiempo real
- Exportar a CSV

✅ **Confirmación por WhatsApp**
- Botón integrado para confirmar por WhatsApp
- Mensaje automático con todos los detalles
- Comunicación directa con el centro

✅ **Almacenamiento local**
- Datos guardados en localStorage
- Sin servidor requerido
- Privado y seguro (conforme a privacidad)

✅ **Diseño responsivo**
- Funciona en mobile, tablet, desktop
- Interfaz profesional y moderna
- UX clara e intuitiva para pacientes

---

## 📁 Estructura

```
sistema-reservas/
├── index.html          # Página de reservas para clientes
├── admin.html          # Panel administrativo
├── style.css           # Estilos compartidos
├── script.js           # Lógica de reservas
├── admin.js            # Lógica del admin
└── README.md           # Este archivo
```

---

## 🚀 Cómo usar

### Paciente: Agendar una cita
1. Abre `index.html`
2. Selecciona tu centro médico preferido
3. Elige la especialidad requerida
4. Selecciona fecha y hora disponible
5. Completa tus datos personales
6. Confirma por botón directo o por WhatsApp
7. ¡Recibe confirmación con código de reserva!

### Admin: Gestionar citas
1. Abre `admin.html`
2. Ve todas las citas en una tabla
3. Filtra por estado o especialidad
4. Marca completadas o cancela citas
5. Exporta datos de citas a CSV

---

## 💾 Almacenamiento

Los datos se guardan automáticamente en **localStorage** del navegador:

- **reservations**: Array de todas las reservas
- **reservedTimes**: Horarios ocupados por fecha

**Para borrar todo:**
```javascript
localStorage.clear();
```

---

## 🎨 Personalización

### Cambiar centros médicos
Edita `index.html`, línea ~40:
```html
<select id="center" required onchange="updateBooking()">
    <option value="">Selecciona un centro</option>
    <option value="Tu Centro Médico" data-price="80">Tu Centro Médico</option>
    <option value="Centro Sede 2" data-price="80">Centro Sede 2</option>
</select>
```

### Cambiar especialidades
Edita `index.html`, línea ~50:
```html
<select id="specialist" required onchange="updateBooking()">
    <option value="">Selecciona especialista</option>
    <option value="Tu Especialidad" data-price="85">Tu Especialidad</option>
    <option value="Otra Especialidad" data-price="90">Otra Especialidad</option>
</select>
```

### Cambiar número de WhatsApp
Edita `script.js`, línea ~346:
```javascript
const phoneNumber = '56912345678'; // Reemplaza con tu número real
```

### Cambiar colores
Edita `style.css`, líneas ~1-10:
```css
:root {
    --primary-color: #4CAF50;      /* Verde */
    --secondary-color: #2196F3;    /* Azul */
    --accent-color: #FF6B6B;       /* Rojo */
}
```

### Cambiar horarios
Edita `script.js`, función `generateTimeSlots()`:
```javascript
for (let hour = 9; hour < 18; hour++) {  // 9 AM a 6 PM
    // ...
}
```

---

## 📊 Estadísticas en Admin

- **Reservas Totales**: Número total de reservas
- **Pendientes**: Reservas confirmadas sin completar
- **Completadas**: Reservas finalizadas
- **Ingresos**: Total de dinero por servicios

---

## 📥 Exportar datos

En el panel admin, haz click en **"📥 Exportar CSV"** para descargar:
- Código de reserva
- Nombre y contacto del cliente
- Servicio y fecha/hora
- Precio y estado
- Notas especiales

---

## 🔒 Seguridad

- Datos almacenados localmente (sin servidor)
- Sin transmisión de datos personales
- Formulario valida antes de enviar
- Código limpio y documentado

---

## 🚀 Próximas mejoras

- [ ] Backend Node.js + SQLite
- [ ] Envío real de emails
- [ ] Sistema de login admin
- [ ] Recordatorios automáticos
- [ ] Integración con Google Calendar
- [ ] SMS de confirmación
- [ ] Múltiples empleados/horarios
- [ ] Reportes avanzados

---

## 📝 Licencia

Proyecto de portafolio. Libre de usar y modificar.

---

## 👤 Desarrollador

Sistema de reservas médicas desarrollado con HTML5, CSS3 y JavaScript vanilla.

📧 Email: angelochisas1@gmail.com
🌐 Portfolio: En construcción en Freelancer.cl
💼 Especialidad: Desarrollo Web Full Stack

---

## 📞 Soporte

Problemas o sugerencias:
- Email: angelochisas1@gmail.com
- Plataforma: Freelancer.cl

---

**Última actualización**: 2026-07-21
**Versión**: 2.0 (Sistema Médico)
**Características**: Centros múltiples, Especialidades, WhatsApp, Admin Panel
