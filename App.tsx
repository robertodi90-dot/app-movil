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
import { filtrarRegistros } from "./src/utils/search";

const registros = cargarRegistrosIniciales();

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [registroSeleccionado, setRegistroSeleccionado] = useState<Registro | null>(
    null
  );

  const resultado = useMemo(
    () => filtrarRegistros(registros, busqueda),
    [busqueda]
  );

  const hayDatos = registros.length > 0;
  const sinResultados = hayDatos && resultado.length === 0;

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
          <Text style={styles.name}>{registroSeleccionado.nombre}</Text>
          <Text style={styles.meta}>ID: {registroSeleccionado.id}</Text>
          <Text style={styles.meta}>
            Categoría: {registroSeleccionado.categoria}
          </Text>
          <Text style={styles.meta}>Stock: {registroSeleccionado.stock}</Text>
          <Text style={styles.meta}>
            Ubicación: {registroSeleccionado.ubicacion}
          </Text>
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
          placeholder="Buscar por nombre, categoría o ubicación"
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.searchInput}
        />
        <Text style={styles.counter}>
          Mostrando {resultado.length} de {registros.length}
        </Text>
      </View>

      {sinResultados ? (
        <View style={styles.centerMessage}>
          <Text style={styles.message}>No hay resultados para tu búsqueda.</Text>
          <Text style={styles.helper}>Prueba otro término o limpia el buscador.</Text>
        </View>
      ) : (
        <FlatList
          data={resultado}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => setRegistroSeleccionado(item)}
            >
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.meta}>Categoría: {item.categoria}</Text>
              <Text style={styles.meta}>Stock: {item.stock}</Text>
              <Text style={styles.meta}>Ubicación: {item.ubicacion}</Text>
            </Pressable>
          )}
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
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
  counter: {
    color: "#607080"
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
