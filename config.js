// ============================================
// 🔐 CONFIGURACIÓN DE APIs - EDITA AQUÍ
// ============================================
// Solo cambia los valores entre las comillas
// No cambies los nombres de las variables

// EmailJS Configuration
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'L1GjAQjK8Npc3nPnq',        // Tu Public Key de EmailJS
    SERVICE_ID: 'service_ygagmxc',          // Tu Service ID de EmailJS
    TEMPLATE_ID: 'template_6zkb959'         // Tu Template ID de EmailJS
};

// ============================================
// ¿DÓNDE ENCUENTRO MIS APIs?
// ============================================
/*
EMAILJS PUBLIC KEY:
1. Ve a: https://dashboard.emailjs.com/admin/account
2. Copia el valor de "Public Key"
3. Pégalo en: PUBLIC_KEY: 'AQUI'

SERVICE ID:
1. Ve a: https://dashboard.emailjs.com/admin/email-services
2. Abre tu servicio (Gmail, Outlook, etc.)
3. Copia el "Service ID"
4. Pégalo en: SERVICE_ID: 'AQUI'

TEMPLATE ID:
1. Ve a: https://dashboard.emailjs.com/admin/email-templates
2. Abre tu plantilla de correo
3. Copia el "Template ID"
4. Pégalo en: TEMPLATE_ID: 'AQUI'
*/

// ============================================
// NO EDITES NADA DE AQUÍ PARA ABAJO
// ============================================
if (typeof window !== 'undefined') {
    window.EMAILJS_CONFIG = EMAILJS_CONFIG;
}
