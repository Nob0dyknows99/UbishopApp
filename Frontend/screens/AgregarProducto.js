import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
const categoryMap = {
  1: "Vestuario",
  2: "Casa",
  3: "Bebida",
  4: "Congelados",
  5: "Ferretería",
  6: "Tecnología",
  7: "Despensa",
  8: "Mascotas",
};

const AgregarProducto = ({ navigation }) => {
  const [imagen, setImagen] = useState(null);
  const formData = new FormData();

  const [productData, setProductData] = useState({
    tienda_id: 2,
    nombre_producto: "",
    descripcion: "",
    precio: "",
    categoria_id: null,
    estado: "activo",
  });

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se requiere acceso a la galería para continuar"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };
  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se requiere acceso a la cámara para continuar"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImagen(null);
  };

  const handleSaveProduct = async () => {
    if (
      !productData.nombre_producto ||
      !productData.descripcion ||
      !productData.precio ||
      !productData.categoria_id ||
      !imagen
    ) {
      Alert.alert(
        "Error",
        "Por favor completa todos los campos y selecciona una imagen"
      );
      return;
    }
    // Agregar datos del producto
    formData.append("nombre_producto", productData.nombre_producto);
    formData.append("descripcion", productData.descripcion);
    formData.append("precio", parseInt(productData.precio));
    formData.append("categoria_id", productData.categoria_id);
    formData.append("estado", productData.estado);
    formData.append("tienda_id", productData.tienda_id);

    // Agregar imagen
    formData.append("imagen", {
      uri: imagen,
      type: "image/jpeg",
      name: "producto.jpg",
    });
    const payload = {
      nombre_producto: productData.nombre_producto,
      descripcion: productData.descripcion,
      precio: parseInt(productData.precio),
      categoria_id: productData.categoria_id,
      estado: productData.estado,
    };

    try {
      console.log("tienda_id:", productData.tienda_id);

      const response = await fetch("http://192.168.0.106:3000/productos", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        Alert.alert("Éxito", "Producto guardado correctamente");
        navigation.goBack();
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        Alert.alert(
          "Error",
          `No se pudo guardar el producto: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert(
        "Error",
        "Hubo un problema con la solicitud. Verifica la consola."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Agregar Producto</Text>

        <Text style={styles.label}>Nombre del Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Reloj de Pared"
          value={productData.nombre_producto}
          onChangeText={(text) =>
            setProductData({ ...productData, nombre_producto: text })
          }
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción del producto"
          value={productData.descripcion}
          onChangeText={(text) =>
            setProductData({ ...productData, descripcion: text })
          }
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          placeholder="Precio en pesos"
          keyboardType="numeric"
          value={productData.precio}
          onChangeText={(text) =>
            setProductData({ ...productData, precio: text })
          }
        />

        <Text style={styles.label}>Categoría</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            Alert.alert("Seleccionar Categoría", null, [
              ...Object.keys(categoryMap).map((key) => ({
                text: categoryMap[key],
                onPress: () =>
                  setProductData({
                    ...productData,
                    categoria_id: parseInt(key),
                  }),
              })),
              { text: "Cancelar", style: "cancel" },
            ])
          }
        >
          <Text style={styles.dropdownText}>
            {categoryMap[productData.categoria_id] ||
              "Selecciona una categoría"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImagePicker}>
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {/* Image */}
        {imagen ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imagen }} style={styles.imagen} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveImage}
            >
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() =>
              Alert.alert("Subir imagen", "Selecciona una opción", [
                { text: "Cámara", onPress: handleCamera },
                { text: "Galería", onPress: handleImagePicker },
                { text: "Cancelar", style: "cancel" },
              ])
            }
          >
            <Text style={styles.imageButtonText}>Subir imagen</Text>
          </TouchableOpacity>
        )}

        {/* Save Button */}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Guardar Producto</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  dropdown: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CCC",
  },

  imageButton: {
    width: "60%",
    height: 50,
    backgroundColor: "#5FBBFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  imageButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AgregarProducto;