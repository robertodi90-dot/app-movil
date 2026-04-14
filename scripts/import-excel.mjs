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
const firstSheetName = workbook.SheetNames[0];
const firstSheet = workbook.Sheets[firstSheetName];
const rows = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });

const mapped = rows.map((row, idx) => ({
  id: String(row.id || `row-${idx + 1}`),
  nombre: String(row.nombre || ""),
  categoria: String(row.categoria || ""),
  stock: Number(row.stock || 0),
  ubicacion: String(row.ubicacion || "")
}));

const outputPath = path.resolve("src/data/registros.json");
fs.writeFileSync(outputPath, `${JSON.stringify(mapped, null, 2)}\n`, "utf8");

console.log(`OK: ${mapped.length} registros exportados a ${outputPath}`);
