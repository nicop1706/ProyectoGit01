/* =====================================================================
   data.js — DATOS DEL SITIO  (Parte 3: JavaScript base)
   ---------------------------------------------------------------------
   Separamos los DATOS de la LÓGICA. Aquí solo hay información:
     · DESTINOS     → arreglo de objetos { id, nombre, pais, cat, precio, dias, ... }
     · CATS         → categorías que usan los filtros y chips
     · TESTIMONIOS  → opiniones del carrusel de la página de inicio
     · FAQ          → preguntas frecuentes de la página de contacto
   y unas funciones pequeñas de ayuda:
     · money(n)     → da formato de dinero:  1450 → "US$ 1,450"
     · imgUrl(d,w)  → arma la URL de la foto de un destino
     · byId(id)     → busca un destino por su id (usa Array.find)
   Conceptos JS: const, arreglos, objetos, arrow functions, template strings.
   IMPORTANTE: todas las páginas cargan este archivo PRIMERO (antes de main.js),
   porque el resto del código usa DESTINOS, money(), byId(), etc.
   ===================================================================== */