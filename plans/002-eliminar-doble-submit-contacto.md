# Plan 002: Eliminar el doble handler de submit en contacto — SUPERSEDED

> ⚠️ **Este plan fue absorbido por el Plan 001**
> (`001-rutear-numeros-whatsapp.md`, Step 3). **No lo ejecutes por separado.**

## Por qué se fusionó

El doble submit del form de contacto (un handler en `script.js` + uno inline en
`contacto.html`, que abrían dos ventanas de WhatsApp a dos números) es parte del
mismo wiring de WhatsApp que el Plan 001 reorganiza. Una vez que se definió la
política de ruteo (alta intención → recepción), tenía sentido que un único plan se
encargue de: setear el número correcto en el handler que se queda **y** borrar el
duplicado de `script.js`. Tratarlos por separado obligaba a coordinar ediciones sobre
el mismo formulario.

Ver **Plan 001, Step 3** para la eliminación del handler duplicado, y **Step 2** para
el ruteo del form de contacto a recepción.

Estado en el índice: **SUPERSEDED por 001**.
