import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { cargarRegistrosIniciales } from "./src/services/registros";
import type { Registro } from "./src/types/registro";
import { filtrarRegistros, type FiltrosBusqueda } from "./src/utils/search";
import eventosData from "./src/data/eventos.json";

const registros = cargarRegistrosIniciales();
type Evento = {
  codigo: string;
  descripcion: string;
  stockAntes: number;
  stockDespues: number;
};

const eventos = eventosData as Evento[];

const obtenerOpcionesUnicas = (
  lista: Registro[],
  selector: (item: Registro) => string
): string[] => [...new Set(lista.map(selector))].sort((a, b) => a.localeCompare(b));

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    medida: "",
    textura: "",
    gramaje: ""
  });
  const [filtroAbierto, setFiltroAbierto] = useState<"" | "medida" | "textura" | "gramaje">("");
  const [registroSeleccionado, setRegistroSeleccionado] = useState<Registro | null>(
    null
  );

  const opcionesMedida = useMemo(
    () => obtenerOpcionesUnicas(registros, (item) => item.medida),
    []
  );
  const opcionesTextura = useMemo(
    () => obtenerOpcionesUnicas(registros, (item) => item.textura),
    []
  );
  const opcionesGramaje = useMemo(
    () => obtenerOpcionesUnicas(registros, (item) => String(item.gramaje)),
    []
  );

  const resultado = useMemo(
    () => filtrarRegistros(registros, busqueda, filtros),
    [busqueda, filtros]
  );
  const ultimosMovimientos = useMemo(() => {
    // Quitamos OT y mostramos solo 5 movimientos, del más reciente al más antiguo.
    return eventos
      .filter((evento) => evento.codigo.trim().toUpperCase() !== "OT")
      .slice(-5)
      .reverse();
  }, []);

  const hayDatos = registros.length > 0;
  const sinResultados = hayDatos && resultado.length === 0;
  // Si el precio viene en 0, mostramos un mensaje simple para el usuario.
  const mostrarPrecio = (precio: number): string =>
    precio === 0 ? "Precio no disponible" : `$${precio.toFixed(2)}`;

  if (!hayDatos) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerMessage}>
          <Text style={styles.title}>Registros</Text>
          <Text style={styles.message}>No existen datos cargados.</Text>
          <Text style={styles.helper}>
            Revisa el archivo src/data/registros.json o importa desde Excel.
          </Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (registroSeleccionado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalle del registro</Text>
        </View>

        <View style={styles.cardDetail}>
          <Text style={styles.name}>{registroSeleccionado.nombreVisible}</Text>
          <Text style={styles.meta}>Código: {registroSeleccionado.codigo}</Text>
          <Text style={styles.meta}>
            Descripción: {registroSeleccionado.descripcion}
          </Text>
          <Text style={styles.meta}>Existencia: {registroSeleccionado.existencia}</Text>
          <Text style={styles.meta}>Precio: {mostrarPrecio(registroSeleccionado.precio)}</Text>
          <Text style={styles.meta}>Tipo: {registroSeleccionado.tipo}</Text>
          <Text style={styles.meta}>Textura: {registroSeleccionado.textura}</Text>
          <Text style={styles.meta}>Gramaje: {registroSeleccionado.gramaje}</Text>
          <Text style={styles.meta}>Medida: {registroSeleccionado.medida}</Text>
        </View>

        {/* Botón simple para volver a la lista principal */}
        <Pressable
          style={styles.backButton}
          onPress={() => setRegistroSeleccionado(null)}
        >
          <Text style={styles.backButtonText}>Volver a la lista</Text>
        </Pressable>

        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registros</Text>
        <TextInput
          placeholder="Buscar por nombre, descripción, tipo, textura, medida o código"
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.searchInput}
        />
        <View style={styles.filtersBlock}>
          <Text style={styles.filterLabel}>Medida</Text>
          <FiltroDesplegable
            label={!filtros.medida ? "Todas" : filtros.medida}
            abierto={filtroAbierto === "medida"}
            opciones={opcionesMedida}
            opcionActiva={filtros.medida}
            textoTodas="Todas"
            onToggle={() =>
              setFiltroAbierto((prev) => (prev === "medida" ? "" : "medida"))
            }
            onSeleccionar={(valor) => {
              setFiltros((prev) => ({ ...prev, medida: valor }));
              setFiltroAbierto("");
            }}
          />
        </View>

        <View style={styles.filtersBlock}>
          <Text style={styles.filterLabel}>Textura</Text>
          <FiltroDesplegable
            label={!filtros.textura ? "Todas" : filtros.textura}
            abierto={filtroAbierto === "textura"}
            opciones={opcionesTextura}
            opcionActiva={filtros.textura}
            textoTodas="Todas"
            onToggle={() =>
              setFiltroAbierto((prev) => (prev === "textura" ? "" : "textura"))
            }
            onSeleccionar={(valor) => {
              setFiltros((prev) => ({ ...prev, textura: valor }));
              setFiltroAbierto("");
            }}
          />
        </View>

        <View style={styles.filtersBlock}>
          <Text style={styles.filterLabel}>Gramaje</Text>
          <FiltroDesplegable
            label={!filtros.gramaje ? "Todos" : filtros.gramaje}
            abierto={filtroAbierto === "gramaje"}
            opciones={opcionesGramaje}
            opcionActiva={filtros.gramaje}
            textoTodas="Todos"
            onToggle={() =>
              setFiltroAbierto((prev) => (prev === "gramaje" ? "" : "gramaje"))
            }
            onSeleccionar={(valor) => {
              setFiltros((prev) => ({ ...prev, gramaje: valor }));
              setFiltroAbierto("");
            }}
          />
        </View>
        <Text style={styles.counter}>
          Mostrando {resultado.length} de {registros.length}
        </Text>
      </View>
      <View style={styles.eventosSection}>
        <Text style={styles.eventosTitle}>Últimos movimientos</Text>

        {ultimosMovimientos.length === 0 ? (
          <Text style={styles.eventosEmpty}>No hay movimientos recientes</Text>
        ) : (
          ultimosMovimientos.map((evento, index) => (
            <View
              key={`${evento.codigo}-${index}`}
              style={styles.eventoCard}
            >
              <Text style={styles.meta}>Código: {evento.codigo}</Text>
              <Text style={styles.meta}>Descripción: {evento.descripcion}</Text>
              <Text style={styles.meta}>Stock antes: {evento.stockAntes}</Text>
              <Text style={styles.meta}>Stock después: {evento.stockDespues}</Text>
            </View>
          ))
        )}
      </View>

      {sinResultados ? (
        <View style={styles.centerMessage}>
          <Text style={styles.message}>No hay resultados para tu búsqueda.</Text>
          <Text style={styles.helper}>Prueba otro término o limpia el buscador.</Text>
        </View>
      ) : (
        <FlatList
          data={resultado}
          keyExtractor={(item) => item.codigo}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => setRegistroSeleccionado(item)}
            >
              <Text style={styles.name}>{item.nombreVisible}</Text>
              <Text style={styles.meta}>Existencia: {item.existencia}</Text>
              <Text style={styles.meta}>Precio: {mostrarPrecio(item.precio)}</Text>
              <Text style={styles.metaSecondary}>Código: {item.codigo}</Text>
            </Pressable>
          )}
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

type FiltroOpcionProps = {
  label: string;
  activo?: boolean;
  onPress: () => void;
};

function FiltroOpcion({ label, activo, onPress }: FiltroOpcionProps) {
  return (
    <Pressable
      style={[styles.dropdownItem, activo && styles.dropdownItemActive]}
      onPress={onPress}
    >
      <Text style={[styles.dropdownItemText, activo && styles.dropdownItemTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type FiltroDesplegableProps = {
  label: string;
  abierto: boolean;
  opciones: string[];
  opcionActiva: string;
  textoTodas: string;
  onToggle: () => void;
  onSeleccionar: (valor: string) => void;
};

function FiltroDesplegable({
  label,
  abierto,
  opciones,
  opcionActiva,
  textoTodas,
  onToggle,
  onSeleccionar
}: FiltroDesplegableProps) {
  return (
    <View style={styles.dropdown}>
      <Pressable style={styles.dropdownButton} onPress={onToggle}>
        <Text style={styles.dropdownButtonText}>{label}</Text>
        <Text style={styles.dropdownArrow}>{abierto ? "▲" : "▼"}</Text>
      </Pressable>

      {abierto ? (
        <View style={styles.dropdownPanel}>
          {/* Lista básica para mantener una experiencia simple en móvil y web */}
          <FiltroOpcion
            label={textoTodas}
            activo={!opcionActiva}
            onPress={() => onSeleccionar("")}
          />
          {opciones.map((opcion) => (
            <FiltroOpcion
              key={opcion}
              label={opcion}
              activo={opcionActiva === opcion}
              onPress={() => onSeleccionar(opcion)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "700"
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D9DEE3"
  },
  filtersBlock: {
    gap: 6
  },
  filterLabel: {
    fontWeight: "600",
    color: "#44505C"
  },
  dropdown: {
    gap: 6
  },
  dropdownButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D9DEE3",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownButtonText: {
    color: "#24303C"
  },
  dropdownArrow: {
    color: "#607080",
    fontSize: 12
  },
  dropdownPanel: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D9DEE3",
    borderRadius: 8,
    overflow: "hidden"
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  dropdownItemActive: {
    backgroundColor: "#1F6FEB",
  },
  dropdownItemText: {
    color: "#44505C",
    fontWeight: "500"
  },
  dropdownItemTextActive: {
    color: "#FFF"
  },
  counter: {
    color: "#607080"
  },
  eventosSection: {
    paddingHorizontal: 16,
    gap: 8
  },
  eventosTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#24303C"
  },
  eventosEmpty: {
    color: "#607080"
  },
  eventoCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    gap: 4
  },
  list: {
    padding: 16,
    gap: 10
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    gap: 6
  },
  cardDetail: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 16,
    padding: 16,
    gap: 8
  },
  name: {
    fontSize: 16,
    fontWeight: "600"
  },
  meta: {
    color: "#44505C"
  },
  metaSecondary: {
    color: "#607080"
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 8
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  helper: {
    color: "#607080",
    textAlign: "center"
  },
  backButton: {
    backgroundColor: "#1F6FEB",
    borderRadius: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "600"
  }
});
