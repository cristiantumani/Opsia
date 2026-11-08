# 🏦 Instrucciones para Limpieza de Archivos Bancarios

## 👋 Hola Claude

Necesito tu ayuda para **limpiar y transformar archivos bancarios** al formato que requiere mi app de finanzas personales (Opsia).

---

## ⚠️ REGLA #1: TRANSACCIONES A IGNORAR

**NO incluyas** estas transacciones en el archivo final (no son gastos/ingresos reales):

### Transferencias internas entre mis cuentas:
- "To Cristian Tumani"
- "From Cristian Tumani"  
- "Transfer to/from CRISTIAN ROBERTO TUMANI KARMY"

### Retiros de cajero:
- "REINTEGRO CAJERO AUTOMATICO"
- "ATM WITHDRAWAL"

---

## 📋 FORMATO DE SALIDA REQUERIDO

Genera un archivo **XLSX** con estas columnas EXACTAS:

| date       | type    | category               | amount  | description |
|------------|---------|------------------------|---------|-------------|
| 2026-11-08 | expense | Supermercado           | 45.50   | Mercadona   |
| 2026-11-07 | income  | Sueldo                 | 2000.00 | Salary      |

**Reglas:**
- `date`: Formato YYYY-MM-DD
- `type`: "income" o "expense" (minúsculas)
- `category`: Nombre EXACTO de mis categorías (ver abajo)
- `amount`: Número positivo (sin signo menos)
- `description`: Texto original de la transacción

---

## 🏷️ MIS CATEGORÍAS (Usar nombres EXACTOS)

### 📤 Gastos (type: expense)
```
Agua
Alimentacion (ex-supermercado)
Amazon
Arriendo
Auto varios
Babysitter
Bencina
Can Caralleu
Casa
Celulares e Internet
Colegio
Cris
Cris Mes
Cris otros
Entretenimiento
Gas
Luz
Maca
Maca Mes
Maca otros
Nana
Navidad - budget
Niños
Otros
Regalos
Ropa
Salidas a comer
Salud
Seguro Salud
Subscripciones
Supermercado
Transporte
Transporte Publico
Universidadades + otros ahorro
Universidad Elisa
Universidad Julian
Viajes
Viajes - budget
```

### 📥 Ingresos (type: income)
```
Freelance
Income
Investment
Other Income
Salary
Sueldo
```

---

## 🎯 REGLAS DE MAPEO (Descripción → Categoría)

### MAPEOS ESPECÍFICOS (Alta prioridad)

**→ Colegio**
- Fundacio Sagrat Cor

**→ Arriendo**
- TRANSFERENCIA A AGN SERVICIOS INTEGRALES, SL.

**→ Niños**
- To Ines Mullerat Fisas
- Berlotex
- Decathlon
- Stikets
- Papeleria Blocs
- Papelería Clips
- Cornella H.

**→ Maca Otros**
- Cambec Online Sl
- Domestika
- ADEUDO RECIBO BSPORT S.A.S
- Estanco
- PULL AND BEAR
- Mimo Korean Cosmetics
- Wallapop
- Women'secret

**→ Cris Otros**
- LOVABLE-DOVER
- Midgetgolf Amstelpark

**→ Ropa**
- El Corte Inglés

**→ Alimentacion (ex-supermercado)**
- Joe & the Juice
- 365
- Cafeteria Can Caralleu
- Can Barça
- Chiringuito Ancla
- Good News
- Green Lab Mut
- Le Pain Quotidien
- Pasteles De Gracia
- Santa Gloria
- Setare
- Sg Via Augusta
- The Llama
- ZeroZero

**→ Supermercado**
- Frutas Dylan
- Rían Supermercats
- ROSSMANN
- Mercadona
- Caprabo
- Dia
- Condis
- Lidl
- Aldi
- Albert Heijn
- Jumbo
- Hema
- Ekoplaza
- Marqt
- Veritas
- Alcampo
- Carrefour
- Eroski

**→ Auto varios**
- L'illa
- Loogman
- Tecnocar Serveis
- Túnels Barcelona Cadí
- VINCI Autoroutes

**→ Casa**
- El Lloc De Chen
- Kruidvat
- Muy Mucho
- Ikea
- Leroy Merlin
- Bricomart
- Bauhaus

**→ Viajes**
- Ibis
- Omio

**→ Entretenimiento**
- The Waterhole
- Cine
- Cinema
- Teatro

**→ Subscripciones**
- Apple (si es Apple.com/bill)
- Spotify
- Netflix
- Adobe
- Prime
- YouTube
- Disney
- HBO
- Claude

### MAPEOS GENERALES (Aplicar si no coincide con específicos)

**→ Bencina**
- Shell, TotalEnergies, Repsol, Cepsa, BP, Galp, Aral, Eni, Avia

**→ Luz**
- Endesa, Iberdrola, Electricidad, Electrica

**→ Agua**
- Agua, Agbar, Aigues

**→ Gas**
- Gas Natural, "GAS"

**→ Celulares e Internet**
- Vodafone, Movistar, Orange, Yoigo, Telefonica

**→ Seguro Salud**
- Adeslas, Sanitas, Asisa, Mutua Madrilena

**→ Salud**
- Farmacia, Farmàcia, Pharmacy, Apotheke

**→ Amazon**
- Amazon (si no es Apple)

**→ Transporte Publico**
- Metro, Bus, Renfe, FGC, TMB, T Mobilitat, Ferrocarril, Tren

**→ Transporte**
- Uber, Cabify, Taxi, Parking, Aparcament, Bicing

**→ Salidas a comer**
- Restaurant, Cafe, Bar, Pizza, Burger, McDonald's, KFC, Subway, Starbucks, Uber Eats, Glovo, Just Eat, Deliveroo, Coffee

**→ Can Caralleu**
- Fundacio Can Caralleu Esport

**→ Sueldo** (ingreso)
- SALARY, SUELDO, NOMINA, PAYMENT FROM, NIUM

**→ Freelance** (ingreso)
- FREELANCE, HONORARIOS

**→ Income** (ingreso)
- TOPUP, RECARGA

**→ Other Income** (ingreso)
- DEVOLUCION, REFUND

**→ Otros** (default)
- Si no coincide con nada de arriba

---

## 📁 TIPOS DE ARCHIVOS QUE SUBIRÉ

### Tipo 1: Banco Español (.xls)
- Primeras 7 filas son metadatos → **ignorar**
- Fila 8: Headers (F. Operativa, Concepto, Importe, etc.)
- Fila 9+: Datos de transacciones

**Mapeo:**
- `F. Operativa` (DD/MM/YYYY) → `date` (YYYY-MM-DD)
- `Concepto` → `description`
- `Importe` → Negativo = expense, Positivo = income
- `Importe` → `amount` (valor absoluto)

### Tipo 2: Revolut (.csv)
- Columnas: Type, Completed Date, Description, Amount, State, etc.

**Mapeo:**
- `Completed Date` → `date` (YYYY-MM-DD)
- `Description` → `description`
- `Amount` → Negativo = expense, Positivo = income
- `Amount` → `amount` (valor absoluto)
- **FILTRAR:** Solo `State == "COMPLETED"`

---

## ✅ PROCESO QUE DEBES SEGUIR

1. **Leer** los archivos que te subo
2. **Identificar** el formato (XLS español o CSV Revolut)
3. **Limpiar** datos:
   - Saltar filas de metadatos (XLS)
   - Filtrar solo State=COMPLETED (CSV)
4. **FILTRAR** transacciones ignoradas:
   - ❌ Transferencias a/de Cristian Tumani
   - ❌ Reintegros cajero
5. **Mapear** categorías:
   - Primero mapeos específicos
   - Luego mapeos generales
   - Default → "Otros"
6. **Generar 2 archivos XLSX:**
   - `REVISAR_categorias.xlsx`
   - `opsia_final.xlsx`

---

## 📦 OUTPUT QUE ESPERO

### Archivo 1: REVISAR_categorias.xlsx
**3 hojas:**

**Hoja 1: "Revisar Todas"**
| Fecha      | Tipo    | Descripción | Categoría Actual | ✏️ Nueva Categoría | Monto € | Notas |
|------------|---------|-------------|------------------|--------------------|---------|-------|
| 2026-11-08 | expense | Mercadona   | Supermercado     |                    | 45.50   |       |

**Hoja 2: "Solo OTROS"**
- Solo las transacciones que quedaron en categoría "Otros"

**Hoja 3: "Resumen por Categoría"**
| Tipo    | Categoría    | Cantidad | Total € |
|---------|--------------|----------|---------|
| expense | Supermercado | 123      | 1,234.5 |

### Archivo 2: opsia_final.xlsx
**1 hoja: "Transactions"**
| date       | type    | category     | amount | description |
|------------|---------|--------------|--------|-------------|
| 2026-11-08 | expense | Supermercado | 45.50  | Mercadona   |

---

## 📊 REPORTE QUE DEBES MOSTRAR

```
✅ Procesamiento completado

📊 ESTADÍSTICAS:
   - Archivo 1 (Banco español): 211 transacciones
   - Archivo 2 (Revolut): 701 transacciones
   - ❌ Ignoradas (internas + cajeros): 125
   - ✅ Procesadas: 787 transacciones

📈 DISTRIBUCIÓN POR CATEGORÍA:
   - Supermercado: 123 (15.6%)
   - Alimentacion (ex-supermercado): 89 (11.3%)
   - Can Caralleu: 35 (4.4%)
   - Niños: 32 (4.1%)
   - Otros: 246 (31.3%) ⚠️ REVISAR

📁 ARCHIVOS GENERADOS:
   1. REVISAR_categorias.xlsx - Para revisión manual
   2. opsia_final.xlsx - Listo para importar

💡 SIGUIENTE PASO:
   Descarga REVISAR_categorias.xlsx, revisa las transacciones
   en "Otros" y avísame si quieres cambiar alguna categoría.
```

---

## ⚠️ REGLAS CRÍTICAS

- **SIEMPRE** usar nombres EXACTOS de categorías (case-sensitive)
- **NUNCA** crear categorías nuevas
- **PRIORIDAD:** Específicos > Generales > Otros
- **Montos:** Siempre positivos (el `type` indica si es gasto/ingreso)
- **Fechas:** Siempre YYYY-MM-DD
- **Ignorar:** Cristian Tumani transfers + cajeros

---

## 🚀 EMPECEMOS

**Estoy listo. Sube tus archivos bancarios (.xls y/o .csv) y los procesaré automáticamente siguiendo estas reglas.** 📂
