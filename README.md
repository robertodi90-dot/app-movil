# app-movil

Versión inicial simple para una app móvil de registros (insumos imprenta), priorizando facilidad de mantenimiento.

## Stack recomendado (simple)

- **Expo + React Native + TypeScript** para arrancar rápido.
- **Estado local con hooks** (`useState`, `useMemo`) sin arquitectura compleja.
- **Datos locales en JSON** para la primera versión, sin backend.
- **Importación de Excel** con script Node (`xlsx`) que convierte `.xlsx` a `.json`.

## Estructura actual

```txt
app-movil/
  App.tsx
  package.json
  tsconfig.json
  .gitignore
  src/
    data/
      registros.json
    types/
      registro.ts
    utils/
      search.ts
    services/
      registros.ts
  scripts/
    import-excel.mjs
```

## Qué hace la app hoy

- Lista registros cargados desde `src/data/registros.json`.
- Permite buscar por nombre, categoría o ubicación.
- Permite seleccionar un registro para ver una **vista de detalle simple**.
- Muestra estado visible cuando:
  - no hay resultados en la búsqueda,
  - no existen datos cargados.

## Flujo simple para cargar datos desde Excel

1. Coloca un archivo `datos.xlsx` (por ejemplo en `./tmp`).
2. Ejecuta:
   - `node scripts/import-excel.mjs ./tmp/datos.xlsx`
3. El script exporta los datos a `src/data/registros.json`.
4. Reinicia Expo para reflejar los cambios.

Campos sugeridos en Excel:

- `id`
- `nombre`
- `categoria`
- `stock`
- `ubicacion`

Si falta `id`, se genera automáticamente (`row-1`, `row-2`, ...).

## Archivos principales (orden recomendado para entender el proyecto)

1. `App.tsx` (pantalla principal con lista, búsqueda y detalle).
2. `src/types/registro.ts` (tipo de dato).
3. `src/utils/search.ts` (filtro de búsqueda).
4. `src/services/registros.ts` (carga de datos locales).
5. `src/data/registros.json` (datos de ejemplo).
6. `scripts/import-excel.mjs` (importador Excel -> JSON).

## Puesta en marcha

```bash
npm install
npm run start
```
