import type { Registro } from "../types/registro";

const normalize = (value: string): string => value.trim().toLowerCase();

export type FiltrosBusqueda = {
  tipo: string;
  textura: string;
  gramaje: string;
};

export const filtrarRegistros = (
  registros: Registro[],
  termino: string,
  filtros: FiltrosBusqueda
): Registro[] => {
  const q = normalize(termino);

  return registros.filter((item) => {
    const cumpleTipo = !filtros.tipo || item.tipo === filtros.tipo;
    const cumpleTextura = !filtros.textura || item.textura === filtros.textura;
    const cumpleGramaje =
      !filtros.gramaje || String(item.gramaje) === filtros.gramaje;

    if (!cumpleTipo || !cumpleTextura || !cumpleGramaje) {
      return false;
    }

    if (!q) {
      return true;
    }

    const texto = [
      item.nombreVisible,
      item.descripcion,
      item.tipo,
      item.textura,
      String(item.gramaje),
      item.medida,
      item.codigo
    ]
      .map(normalize)
      .join(" ");

    return texto.includes(q);
  });
};
