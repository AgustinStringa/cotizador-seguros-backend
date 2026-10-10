# 🚗 Cotizador de Seguros - Backend API

Backend modular y fuertemente tipado desarrollado con **NestJS** y **Drizzle ORM** sobre **MySQL 8.0.33**, sirviendo como servicio API REST para la aplicación de cotización de vehículos.

---

## 🛠️ Tecnologías y Entorno

- **Runtime:** Node.js v24.16.0 (gestionado con `fnm`)
- **Framework:** [NestJS](https://nestjs.com/) v12
- **Lenguaje:** TypeScript (Strict Mode, ECMAScript Modules `nodenext`)
- **ORM & Migraciones:** [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit`
- **Base de Datos:** MySQL 8.0.33 (`cotizador_db`)
- **Testing:** [Vitest](https://vitest.dev/)
- **Validación:** `class-validator` y `class-transformer`

---

## 🏛️ Arquitectura por Capas

El backend implementa una arquitectura desacoplada por capas:

```
src/
├── common/                         # Interceptores y filtros globales (envelope uniforme)
│   ├── dto/pagination.dto.ts
│   ├── filters/http-exception.filter.ts
│   └── interceptors/transform-response.interceptor.ts
├── config/                         # Configuración tipada de entorno
│   └── configuration.ts
├── database/                       # Conexión Drizzle y esquemas MySQL
│   ├── database.module.ts
│   ├── migrate.ts                  # Runner de migraciones
│   ├── seed.ts                     # Seeder de datos iniciales (planes)
│   ├── migrations/                 # Scripts SQL generados por drizzle-kit
│   └── schema/
│       ├── cotizaciones.schema.ts
│       ├── planes.schema.ts
│       └── index.ts
└── modules/
    ├── cotizaciones/               # Cotizaciones (cálculo y persistencia)
    │   ├── controllers/cotizaciones.controller.ts
    │   ├── dto/
    │   │   ├── calcular-cotizacion.dto.ts
    │   │   ├── crear-cotizacion.dto.ts
    │   │   └── cotizacion-response.dto.ts
    │   ├── repositories/cotizaciones.repository.ts
    │   ├── services/cotizaciones.service.ts
    │   └── cotizaciones.module.ts
    ├── marcas/                     # Catálogo de marcas y clasificación alta gama
    │   ├── marcas.controller.ts
    │   ├── marcas.module.ts
    │   └── marcas.service.ts
    └── planes/                     # Catálogo y detalle de planes en MySQL
        ├── planes.controller.ts
        ├── planes.module.ts
        └── planes.service.ts
```

---

## 📦 Formato Estandarizado de Respuesta

Todas las respuestas exitosas y de error implementan el envelope unificado:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-10-09T04:15:11.192Z",
    "path": "/api/v1/cotizaciones/calcular",
    "version": "1.0.0"
  }
}
```

---

## 🚀 Endpoints de la API REST (`/api/v1`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/cotizaciones/calcular` | Aplica reglas de negocio y devuelve el monto calculado sin persistir. |
| `POST` | `/api/v1/cotizaciones` | Calcula y persiste una nueva cotización en MySQL `cotizador_db`. |
| `GET` | `/api/v1/cotizaciones` | Lista historial paginado de cotizaciones (`?page=1&limit=10`). |
| `GET` | `/api/v1/cotizaciones/:id` | Obtiene el detalle de una cotización específica por ID. |
| `DELETE` | `/api/v1/cotizaciones/:id` | Elimina una cotización del historial. |
| `GET` | `/api/v1/marcas` | Retorna lista de marcas disponibles ordenadas alfabéticamente. |
| `GET` | `/api/v1/marcas/:nombre` | Retorna detalle de una marca por su nombre. |
| `GET` | `/api/v1/planes` | Retorna planes disponibles activos consultados desde MySQL `cotizador_db`. |
| `GET` | `/api/v1/planes/:codigo` | Retorna detalle de un plan específico (`basico`, `completo`). |

---

## ⚙️ Configuración y Puesta en Marcha

### 1. Variables de Entorno (`.env`)
Copiar el archivo de ejemplo y configurar las credenciales de MySQL:
```bash
cp .env.example .env
```

Configuración predeterminada:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=cotizador_db
```

### 2. Migraciones y Seeders (Drizzle Kit)

```powershell
# Inicializar entorno Node
fnm use 24.16.0

# Generar migraciones SQL a partir de esquemas TypeScript
npm run db:generate

# Aplicar migraciones en MySQL (estilo EF Core Migrations)
npm run db:migrate

# Cargar catálogo de planes iniciales
npm run db:seed

# Abrir Drizzle Studio (interfaz web de inspección)
npm run db:studio
```

### 3. Ejecución en Desarrollo

```powershell
# Modo watch para desarrollo
npm run start:dev

# Compilar producción
npm run build

# Iniciar producción
npm run start:prod
```

### 4. Pruebas Automatizadas

```powershell
# Pruebas unitarias con Vitest
npm test

# Pruebas unitarias en modo interactivo
npm run test:watch
```
