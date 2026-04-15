import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import xlsx from "xlsx";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Uso: node scripts/import-excel.mjs <ruta-al-archivo.xlsx>");
  process.exit(1);
}

const resolvedInput = path.resolve(inputPath);
if (!fs.existsSync(resolvedInput)) {
  console.error(`No existe el archivo: ${resolvedInput}`);
  process.exit(1);
}

const workbook = xlsx.readFile(resolvedInput);
const sheetName = "EXISTENCIAS_EEA";
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.error(`No existe la hoja: ${sheetName}`);
  process.exit(1);
}

// Convierte texto o números de Excel a número real.
// Si viene vacío, devuelve 0 para que no falle el JSON.
const toNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined) {
    return 0;
  }

  const cleaned = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  if (cleaned === "") {
    return 0;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Convierte "existencia" cuidando miles y decimales.
// Ejemplo: "2,000" => 2000, "12,5" => 12.5
const toExistenciaNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined) {
    return 0;
  }

  const raw = String(value).trim().replace(/\s+/g, "");
  if (raw === "") {
    return 0;
  }

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");

  // Caso ambiguo con un solo separador y 3 dígitos al final.
  // Lo tomamos como separador de miles para existencia.
  if (hasComma !== hasDot) {
    const sep = hasComma ? "," : ".";
    const parts = raw.split(sep);
    if (
      parts.length === 2 &&
      /^\d+$/.test(parts[0]) &&
      /^\d{3}$/.test(parts[1])
    ) {
      const integerLike = Number(parts.join(""));
      return Number.isFinite(integerLike) ? integerLike : 0;
    }
  }

  return toNumber(raw);
};

const rows = xlsx.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
  raw: false
});

const mapped = rows
  .map((row) => {
    const codigo = String(row[0] ?? "").trim();
    const descripcion = String(row[1] ?? "").trim();
    const existencia = toExistenciaNumber(row[2]);
    const tipo = String(row[4] ?? "").trim();
    const textura = String(row[5] ?? "").trim();
    const gramaje = toNumber(row[6]);
    const medida = String(row[7] ?? "").trim();
    const precio = toNumber(row[8]);

    // Si toda la fila está vacía, esta fila no se usa.
    const isEmptyRow = [
      codigo,
      descripcion,
      row[2],
      tipo,
      textura,
      row[6],
      medida,
      row[8]
    ].every((cell) => String(cell ?? "").trim() === "");

    if (isEmptyRow) {
      return null;
    }

    // Si viene una fila de encabezados, se ignora.
    const isHeaderRow =
      codigo.toLowerCase() === "codigo" &&
      descripcion.toLowerCase() === "descripcion";

    if (isHeaderRow) {
      return null;
    }

    // Nombre simple para mostrar en la app.
    const nombreVisible = `${tipo} ${textura} ${gramaje}g ${medida}`.trim();

    return {
      codigo,
      descripcion,
      existencia,
      tipo,
      textura,
      gramaje,
      medida,
      precio,
      nombreVisible
    };
  })
  .filter(Boolean);

const outputPath = path.resolve("src/data/registros.json");
fs.writeFileSync(outputPath, `${JSON.stringify(mapped, null, 2)}\n`, "utf8");

console.log(`OK: ${mapped.length} registros exportados a ${outputPath}`);
