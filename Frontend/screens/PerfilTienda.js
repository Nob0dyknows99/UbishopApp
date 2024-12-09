import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

const PerfilTienda = () => {
  const { role, logout, userId } = useAuth();
  const navigation = useNavigation();

  if (role !== "Tienda") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No tienes acceso a esta pantalla.</Text>
      </View>
    );
  }

  const [editableField, setEditableField] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    owner: "",
    location: "",
  });
  const [backupData, setBackupData] = useState({});
  const [locationId, setLocationId] = useState(null); // Para almacenar el ID de la ubicación

  useEffect(() => {
    // Obtener datos de la tienda desde el backend utilizando el userId del contexto
    const fetchStoreData = async () => {
      if (!userId) {
        console.error("ID de usuario no disponible. Asegúrate de estar autenticado.");
        return;
      }

      try {
        const response = await axios.get(`http://192.168.0.106:3000/tienda/${userId}`);
        const data = response.data;

        // Obtener la ubicación de la tienda
        const locationResponse = await axios.get(
          `http://192.168.0.106:3000/ubicacion?tienda_id=${data.tienda_id}`
        );

        const locationData = locationResponse.data[0] || {};

        setFormData({
          storeName: data.nombre || "",
          description: data.descripcion || "",
          owner: data.propietario || "",
          location: locationData.direccion || "Ubicación no especificada",
        });
        setLocationId(locationData._id); // Guardar el ID de la ubicación para futuras actualizaciones
      } catch (error) {
        console.error("Error al obtener los datos de la tienda:", error);
        Alert.alert("Error", "No se pudieron cargar los datos de la tienda.");
      }
    };

    fetchStoreData();
  }, [userId]);

  const handleEdit = (field) => {
    setEditableField(field);
    setBackupData({ ...formData });
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("ID de usuario no disponible. Asegúrate de estar autenticado.");
      return;
    }

    try {
      await axios.put(`http://192.168.0.106:3000/tienda/${userId}`, formData);
      console.log("Datos guardados:", formData);
    } catch (error) {
      console.error("Error al guardar los datos de la tienda:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
    setEditableField(null);
  };

  const handleCancel = () => {
    setFormData({ ...backupData });
    setEditableField(null);
  };

  const handleLocationSelect = async (selectedLocation) => {
    try {
      const updatedLocation = {
        tienda_id: userId, // Asociar la ubicación con la tienda actual
        latitud: selectedLocation.latitude,
        longitud: selectedLocation.longitude,
        direccion: selectedLocation.direccion,
      };

      if (locationId) {
        // Actualizar ubicación existente
        await axios.put(`http://192.168.0.106:3000/ubicacion/${locationId}`, updatedLocation);
      } else {
        // Crear nueva ubicación si no existe
        const response = await axios.post(`http://192.168.0.106:3000/ubicacion`, updatedLocation);
        setLocationId(response.data._id); // Guardar el nuevo ID de la ubicación
      }

      setFormData({
        ...formData,
        location: selectedLocation.direccion,
      });

      Alert.alert("Éxito", "Ubicación actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error);
      Alert.alert("Error", "No se pudo actualizar la ubicación.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <View style={styles.formContainer}>
        {/* Campo de Nombre de la Tienda */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la tienda"
            placeholderTextColor="#B0B0B0"
            value={formData.storeName}
            editable={editableField === "storeName"}
            onChangeText={(text) =>
              setFormData({ ...formData, storeName: text })
            }
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("storeName")}
          >
            <FontAwesome name="edit" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        {/* Campo de Descripción */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            placeholderTextColor="#B0B0B0"
            value={formData.description}
            editable={editableField === "description"}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("description")}
          >
            <FontAwesome name="edit" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        {/* Campo de Propietario */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Propietario"
            placeholderTextColor="#B0B0B0"
            value={formData.owner}
            editable={editableField === "owner"}
            onChangeText={(text) => setFormData({ ...formData, owner: text })}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => handleEdit("owner")}
          >
            <FontAwesome name="edit" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        {/* Campo de Ubicación */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            placeholderTextColor="#B0B0B0"
            value={formData.location}
            editable={false}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("AgregarUbicacion", {
                onLocationSelect: handleLocationSelect,
              })
            }
          >
            <Text style={styles.buttonText}>Cambiar ubicación</Text>
          </TouchableOpacity>
        </View>
        {editableField && (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#CCC",
    color: "#000",
  },
  editIcon: {
    marginLeft: 10,
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#32CD32",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#FF4500",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  logoutButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#FF4500",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PerfilTienda;
