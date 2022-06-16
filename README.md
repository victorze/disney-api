# Disney API

https://user-images.githubusercontent.com/22132891/137372832-f979ca69-4517-45dd-bdf5-edde41edc750.mp4

## Configurar un entorno de desarrollo

* Verificar que el servidor PostgreSQL se encuentre activo y funcionando
* Crear dos bases de datos `disneyapi` y `disneyapitest`
* Crear un archivo .env: `cp .env.example .env`
  (las variables de entorno `SENDGRID_API_KEY` y `MAIL_FROM_ADDRESS` son opcionales)
* Instalar dependencias: `npm install`
* Ejecutar el servidor: `npm run dev`
* Navegar a http://localhost:3000/api-docs
* Ejecutas los test `npm test`
