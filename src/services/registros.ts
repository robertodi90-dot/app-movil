import registros from "../data/registros.json";
import type { Registro } from "../types/registro";

// Servicio simple para centralizar la carga de datos locales.
export const cargarRegistrosIniciales = (): Registro[] => registros as Registro[];
