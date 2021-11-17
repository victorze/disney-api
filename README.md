# Disney API

https://user-images.githubusercontent.com/22132891/137372832-f979ca69-4517-45dd-bdf5-edde41edc750.mp4

# Instalación

```bash
git clone https://github.com/victorze/disney-api.git
cd disney-api
npm install
```

# Configuración

Cree dos bases de datos en PostgreSQL, una para la aplicación y otra para ejecutar los tests.
El nombre de la base de datos de pruebas será el nombre de la base de datos principal + `test`.
Por ejemplo, si la base de datos de la aplicación se llama `disneyapi`, la base de datos para
ejecutar los tests se llamará `disneyapitest`

Puede utilizar docker para crear las bases de datos en PostgreSQL.

```
docker run -d -e POSTGRES_USER=disneyapi -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=disneyapi -p 5432:5432 --name disneyapi postgres:13
```

Conectese con un cliente a PostgreSQL y cree la base de datos para los tests: `disneyapitest`

Haga una copia del archivo `.env.example`. A continuación, ingrese los valores de configuración en el archivo `.env`

```
cp .env.example .env
```

Las variables de entorno `SENDGRID_API_KEY` y `MAIL_FROM_ADDRESS` son opcionales.

# Uso

Ejecutar los tests

```
npm run test
```

Ejecutar la aplicación

```
npm start
```

Finalmente, navegar a http://localhost:3000/api-docs
