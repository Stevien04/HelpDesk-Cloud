/**
 * Cuentas de demostración para los accesos rápidos (evaluación académica).
 *
 * Son cuentas reales de Firebase Authentication: al pulsar un acceso rápido la
 * aplicación inicia sesión con ellas, de modo que todos los roles leen y
 * escriben los mismos datos en Firestore.
 *
 * La contraseña es pública a propósito: estas cuentas solo sirven para la demo.
 * No reutilizarla en ninguna cuenta real.
 *
 * La primera vez que se pulsa un acceso rápido, la cuenta se crea sola con rol
 * 'usuario' (las reglas de Firestore impiden registrarse con otro rol). El rol
 * de las cuentas de técnico y administrador se cambia una única vez desde la
 * consola de Firebase: colección `usuarios`, campo `rol`.
 */
export const DEMO_PASSWORD = 'Demo-HelpDesk-7Qm4x9';

export const DEMO_ACCOUNTS = {
  usuario: { email: 'demo.usuario@example.com', nombre: 'Usuario Demo' },
  tecnico: { email: 'demo.tecnico@example.com', nombre: 'Técnico Demo' },
  admin: { email: 'demo.admin@example.com', nombre: 'Administrador Demo' }
};
