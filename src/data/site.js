export const WHATSAPP = '5491131598373'; // Recepción
export const TELEFONO = '+54 9 11 3159-8373';
export const DIRECCION = 'Solis 1213, CABA';
export const EMAIL = 'administracion@clubcenterfa.com';
export const INSTAGRAM = 'clubcenterfightacademy';
export const MAPA = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Solis 1213, Ciudad Autónoma de Buenos Aires, Argentina');

export const wa = (texto = 'Hola, quería hacer una consulta') =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
