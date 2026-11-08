# Opsia MCP Server

MCP (Model Context Protocol) server para automatizar la importación de transacciones bancarias a Opsia desde Claude Chat.

## 🎯 Funcionalidad

Permite a Claude Chat interactuar directamente con tu base de datos de Opsia en Supabase para:

- ✅ Obtener categorías del usuario
- ✅ Insertar transacciones en batch
- ✅ Verificar duplicados antes de importar
- ✅ Consultar transacciones existentes
- ✅ Obtener estadísticas mensuales

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
cd opsia-mcp
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa:

```bash
cp .env.example .env
```

Edita `.env`:

```env
SUPABASE_URL=https://hvgerlrogmvplntgpoae.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui
OPSIA_USER_ID=ccecdc6c-952e-4331-b111-d163fff2d257
```

**⚠️ IMPORTANTE:** El `SUPABASE_SERVICE_KEY` lo obtienes en:
- Supabase Dashboard → Settings → API → Project API keys → `service_role` key

### 3. Compilar TypeScript

```bash
npm run build
```

## 🚀 Uso con Claude Chat

### Configurar en Claude Desktop App

Edita tu archivo de configuración de Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Agrega:

```json
{
  "mcpServers": {
    "opsia": {
      "command": "node",
      "args": ["/ruta/absoluta/a/opsia-mcp/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://hvgerlrogmvplntgpoae.supabase.co",
        "SUPABASE_SERVICE_KEY": "tu_service_role_key",
        "OPSIA_USER_ID": "ccecdc6c-952e-4331-b111-d163fff2d257"
      }
    }
  }
}
```

### Reiniciar Claude Desktop

Cierra y vuelve a abrir Claude Desktop para que cargue el MCP server.

## 📋 Herramientas Disponibles

### 1. `get_categories`

Obtiene todas las categorías del usuario.

```
Claude: ¿Qué categorías tengo en Opsia?
→ Llama a get_categories()
```

### 2. `insert_transactions`

Inserta transacciones en batch.

```json
{
  "transactions": [
    {
      "date": "2026-11-08",
      "type": "expense",
      "category": "Supermercado",
      "amount": 45.50,
      "description": "Mercadona"
    }
  ]
}
```

### 3. `check_duplicates`

Verifica si las transacciones ya existen.

```json
{
  "transactions": [...]
}
```

Retorna: `{ duplicates: 5, unique: 95, duplicate_details: [...] }`

### 4. `get_transactions`

Consulta transacciones existentes.

```json
{
  "startDate": "2026-11-01",
  "endDate": "2026-11-30",
  "limit": 100
}
```

### 5. `get_month_stats`

Obtiene estadísticas del mes.

```json
{
  "year": 2026,
  "month": 11
}
```

Retorna: ingresos, gastos, ahorros, top categorías.

## 🎬 Flujo de Uso Completo

**En Claude Chat:**

```
Usuario: Aquí están mis extractos bancarios de noviembre
[Adjunta archivos XLS + CSV]

Claude:
1. Procesa archivos según reglas de limpieza
2. get_categories() → Valida categorías
3. check_duplicates() → Verifica si ya existen
4. insert_transactions() → Inserta solo los únicos
5. get_month_stats() → Muestra resumen

✅ Importadas 787 transacciones a Opsia
📊 Gastos del mes: €3,456.78
💰 Ingresos: €4,200.00
💾 Ver en Opsia: https://opsia.app
```

## 🔧 Desarrollo

### Modo desarrollo (con hot reload)

```bash
npm run dev
```

### Tests

```bash
# TODO: Agregar tests
npm test
```

## 🐛 Debugging

Ver logs del MCP server en Claude Desktop:

**macOS:** `~/Library/Logs/Claude/mcp*.log`
**Windows:** `%APPDATA%\Claude\logs\mcp*.log`

## ⚠️ Seguridad

- **NUNCA** compartas tu `SUPABASE_SERVICE_KEY`
- **NUNCA** commits el archivo `.env`
- El service key tiene acceso completo a tu base de datos
- Solo úsalo en entornos seguros

## 📝 Licencia

MIT

## 👨‍💻 Autor

Cristian Tumani - Opsia Finance App
