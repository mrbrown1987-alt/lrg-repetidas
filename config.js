/*
 * Configuración del envío de emails ("Solicitar precios").
 *
 * FormSubmit: no necesita cuenta ni key. El email va en el action del
 * formulario oculto (visible en el código fuente, no en la interfaz).
 *
 * La primera vez que se envía, FormSubmit manda un correo de confirmación
 * a kuharesma@gmail.com; hay que pulsar el enlace para activarlo. Después
 * llegan todas las solicitudes.
 */
window.LRG_CONFIG = {
  formsubmitEmail: 'kuharesma@gmail.com',
  formspreeEndpoint: ''
};
