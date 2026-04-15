import type { Registro } from "../types/registro";

const normalize = (value: string): string => value.trim().toLowerCase();

export const filtrarRegistros = (
  registros: Registro[],
  termino: string
): Registro[] => {
  const q = normalize(termino);

  if (!q) {
    return registros;
  }

  return registros.filter((item) => {
    const texto = [
      item.nombreVisible,
      item.descripcion,
      item.tipo,
      item.textura,
      item.medida,
      item.codigo
    ]
      .map(normalize)
      .join(" ");

    return texto.includes(q);
  });
};
