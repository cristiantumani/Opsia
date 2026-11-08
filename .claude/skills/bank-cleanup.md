# Bank Cleanup Skill

Limpia y transforma archivos bancarios (XLS del banco español y CSV de Revolut) al formato XLSX requerido por Opsia para importar transacciones.

## Uso

Invoca este skill cuando el usuario suba archivos bancarios que necesiten ser convertidos al formato de Opsia.

```bash
/bank-cleanup
```

## Descripción

Este skill procesa archivos bancarios y genera dos archivos XLSX:
1. **REVISAR_categorias.xlsx** - Para revisión manual del usuario
2. **opsia_final.xlsx** - Listo para importar a Opsia

---

# INSTRUCCIONES PARA CLAUDE

## ⚠️ TRANSACCIONES A IGNORAR (NO INCLUIR)

**IGNORAR completamente** estas transacciones (no son gastos ni ingresos reales):

### Transferencias internas entre cuentas del usuario:
- Descripción contiene: "To Cristian Tumani"
- Descripción contiene: "From Cristian Tumani"
- Descripción contiene: "Transfer to/from CRISTIAN ROBERTO TUMANI KARMY"

### Retiros de cajero:
- Descripción contiene: "REINTEGRO CAJERO AUTOMATICO"
- Descripción contiene: "ATM WITHDRAWAL"

**Estas NO deben aparecer en el archivo final.**

## FORMATO REQUERIDO POR OPSIA

Opsia acepta archivos **XLSX** con estas columnas EXACTAS:

```
date       | type    | category        | amount  | description
-----------+---------+-----------------+---------+------------------------
YYYY-MM-DD | expense | Nombre Exacto   | 123.45  | Descripción original
YYYY-MM-DD | income  | Nombre Exacto   | 500.00  | Descripción original
```

**Reglas:**
- `date`: Formato `YYYY-MM-DD` (ej: 2026-11-08)
- `type`: Solo "income" o "expense" (minúsculas)
- `category`: Debe coincidir EXACTAMENTE con una de las categorías del usuario
- `amount`: Número positivo (sin signo negativo)
- `description`: Texto opcional

## CATEGORÍAS DEL USUARIO (USAR NOMBRES EXACTOS)

### 📤 GASTOS (expense):
Agua, Alimentacion (ex-supermercado), Amazon, Arriendo, Auto varios, Babysitter, Bencina, Can Caralleu, Casa, Celulares e Internet, Colegio, Cris, Cris Mes, Cris otros, Entretenimiento, Gas, Luz, Maca, Maca Mes, Maca otros, Nana, Navidad - budget, Niños, Otros, Regalos, Ropa, Salidas a comer, Salud, Seguro Salud, Subscripciones, Supermercado, Transporte, Transporte Publico, Universidadades + otros ahorro, Universidad Elisa, Universidad Julian, Viajes, Viajes - budget

### 📥 INGRESOS (income):
Freelance, Income, Investment, Other Income, Salary, Sueldo

## REGLAS DE MAPEO AUTOMÁTICO

### 🎯 MAPEOS ESPECÍFICOS (Prioridad Alta)

**Colegio:**
- Fundacio Sagrat Cor

**Arriendo:**
- TRANSFERENCIA A AGN SERVICIOS INTEGRALES, SL.

**Niños:**
- To Ines Mullerat Fisas, Berlotex, Decathlon, Stikets, Papeleria Blocs, Papelería Clips, Cornella H.

**Maca Otros:**
- Cambec Online Sl, Domestika, ADEUDO RECIBO BSPORT S.A.S, Estanco, COMPRA TARJ. 5402XXXXXXXX0020 12.09 PULL AND BEAR SPAIN-ARTEIXO, Mimo Korean Cosmetics, Wallapop, Women'secret

**Cris Otros:**
- COMPRA TARJ. 5402XXXXXXXX0029 LOVABLE-DOVER, Midgetgolf Amstelpark

**Ropa:**
- El Corte Inglés

**Alimentacion (ex-supermercado):**
- Joe & the Juice, 365, Cafeteria Can Caralleu, Can Barça, Chiringuito Ancla, Good News, Green Lab Mut, Le Pain Quotidien, Pasteles De Gracia, Santa Gloria, Setare, Sg Via Augusta, The Llama, ZeroZero

**Supermercado:**
- Frutas Dylan, Rían Supermercats, ROSSMANN, Mercadona, Caprabo, Dia, Condis, Lidl, Aldi, Albert Heijn, Jumbo, Hema, Ekoplaza, Marqt, Veritas, Alcampo, Carrefour, Eroski

**Auto varios:**
- L'illa, Loogman, Tecnocar Serveis, Túnels Barcelona Cadí, VINCI Autoroutes

**Casa:**
- El Lloc De Chen, Kruidvat, Muy Mucho, Ikea, Leroy Merlin, Bricomart, Bauhaus

**Viajes:**
- Ibis, Omio

**Entretenimiento:**
- The Waterhole, Cine, Cinema, Teatro

**Subscripciones:**
- Apple, Spotify, Netflix, Apple.com, Adobe, Prime, YouTube, Disney, HBO, Claude

### 🔧 MAPEOS GENERALES (Aplicar después de los específicos)

**Bencina:** Shell, TotalEnergies, Repsol, Cepsa, BP, Galp, Aral, Eni, Avia

**Luz:** Endesa, Iberdrola, Electricidad, Electrica

**Agua:** Agua, Agbar, Aigues

**Gas:** Gas Natural, "GAS"

**Celulares e Internet:** Vodafone, Movistar, Orange, Yoigo, Telefonica

**Seguro Salud:** Adeslas, Sanitas, Asisa, Mutua Madrilena

**Salud:** Farmacia, Farmàcia, Pharmacy, Apotheke

**Amazon:** Amazon

**Transporte Publico:** Metro, Bus, Renfe, FGC, TMB, T Mobilitat, Ferrocarril, Tren

**Transporte:** Uber, Cabify, Taxi, Parking, Aparcament, Bicing

**Salidas a comer:** Restaurant, Cafe, Bar, Pizza, Burger, McDonald's, KFC, Subway, Starbucks, Uber Eats, Glovo, Just Eat, Deliveroo, Coffee

**Can Caralleu:** Fundacio Can Caralleu Esport

**Ingresos:**
- "SALARY", "SUELDO", "NOMINA", "PAYMENT FROM", "NIUM" → Sueldo
- "FREELANCE", "HONORARIOS" → Freelance
- "TOPUP", "RECARGA" → Income
- "DEVOLUCION", "REFUND" → Other Income

**Default:** Si no coincide con nada → **Otros**

## TIPOS DE ARCHIVOS

### 1. Banco Español (.xls)
- Primeras 7 filas: metadatos (ignorar)
- Fila 8: Headers (F. Operativa, Concepto, F. Valor, Importe, Saldo, Referencia 1, Referencia 2)
- Fila 9+: Transacciones
- F. Operativa → date (convertir DD/MM/YYYY a YYYY-MM-DD)
- Concepto → description
- Importe → amount (negativo = gasto, positivo = ingreso)

### 2. Revolut (.csv)
- Columnas: Type, Product, Started Date, Completed Date, Description, Amount, Fee, Currency, State, Balance
- Completed Date → date
- Description → description
- Amount → amount
- **Solo State == "COMPLETED"**

## PROCESO

1. Recibir archivo(s)
2. Leer y limpiar datos
3. **FILTRAR transacciones ignoradas** (transferencias internas + cajeros)
4. Mapear categorías (específicos primero, luego generales)
5. Generar 2 archivos XLSX
6. Mostrar estadísticas

## OUTPUT

### 1. REVISAR_categorias.xlsx
Columnas: Fecha, Tipo, Descripción, Categoría Actual, ✏️ Nueva Categoría (vacía), Monto €, Notas
- Ordenado por: Categoría Actual, luego Monto (desc)
- 3 hojas: "Revisar Todas", "Solo OTROS", "Resumen por Categoría"

### 2. opsia_final.xlsx
Columnas: date, type, category, amount, description
- Solo transacciones válidas (no ignoradas)

## EJEMPLO DE REPORTE

```
✅ Procesamiento completado:

📊 ESTADÍSTICAS:
   - Archivo 1 (Banco español): 211 transacciones
   - Archivo 2 (Revolut): 701 transacciones
   - ❌ Ignoradas: 125
   - ✅ Procesadas: 787

📈 POR CATEGORÍA:
   - Supermercado: 123 (15.6%)
   - Otros: 246 (31.3%) ⚠️ REVISAR

📁 ARCHIVOS:
   1. REVISAR_categorias.xlsx
   2. opsia_final.xlsx
```

## NOTAS CRÍTICAS

- **SIEMPRE** usar nombres EXACTOS de categorías (case-sensitive)
- **NUNCA** crear categorías nuevas sin preguntar
- **PRIORIDAD:** Mapeos específicos > Generales > Otros
- Montos siempre positivos
- Fechas siempre YYYY-MM-DD
- Guardar archivos en el directorio del proyecto o scratchpad
