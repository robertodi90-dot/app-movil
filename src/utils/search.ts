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
    const texto = [item.nombre, item.categoria, item.ubicacion]
      .map(normalize)
      .join(" ");

    return texto.includes(q);
  });
};
