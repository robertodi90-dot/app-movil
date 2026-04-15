import type { Registro } from "../types/registro";

const normalize = (value: string): string => value.trim().toLowerCase();

export type FiltrosBusqueda = {
  medida: string;
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
    const cumpleMedida = !filtros.medida || item.medida === filtros.medida;
    const cumpleTextura = !filtros.textura || item.textura === filtros.textura;
    const cumpleGramaje =
      !filtros.gramaje || String(item.gramaje) === filtros.gramaje;

    if (!cumpleMedida || !cumpleTextura || !cumpleGramaje) {
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
