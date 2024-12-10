import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const EditarProducto = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productData, setProductData] = useState({
    nombre_producto: "",
    descripcion: "",
    precio: "",
    categoria_id: null,
    estado: "activo",
    imagen: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.0.106:3000/productos");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId) => {
    const product = products.find((p) => p.producto_id === productId);
    if (product) {
      setSelectedProduct(product);
      setProductData({
        nombre_producto: product.nombre_producto,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        categoria_id: product.categoria_id,
        estado: product.estado,
        imagen: product.imagen,
      });
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProductData({ ...productData, imagen: result.assets[0].uri });
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Selecciona un producto antes de guardar.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_producto", productData.nombre_producto);
    formData.append("descripcion", productData.descripcion);
    formData.append("precio", parseFloat(productData.precio)); // Convertir precio a número
    formData.append("categoria_id", productData.categoria_id);
    formData.append("estado", productData.estado);

    if (productData.imagen && productData.imagen !== selectedProduct.imagen) {
      formData.append("imagen", {
        uri: productData.imagen,
        type: "image/jpeg",
        name: "producto.jpg",
      });
    }

    try {
      await axios.put(
        `http://192.168.0.106:3000/productos/${selectedProduct.producto_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Alert.alert("Éxito", "Producto actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Editar Producto</Text>

        <Text style={styles.label}>Seleccionar Producto:</Text>
        <Picker
          selectedValue={selectedProduct?.producto_id || ""}
          onValueChange={(value) => handleProductChange(value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un producto" value="" />
          {products.map((product) => (
            <Picker.Item
              key={product.producto_id}
              label={product.nombre_producto}
              value={product.producto_id}
            />
          ))}
        </Picker>

        {selectedProduct && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={productData.nombre_producto}
              onChangeText={(text) =>
                setProductData({ ...productData, nombre_producto: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={productData.descripcion}
              onChangeText={(text) =>
                setProductData({ ...productData, descripcion: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={productData.precio}
              onChangeText={(text) =>
                /^\d*$/.test(text) && setProductData({ ...productData, precio: text })
              }
              keyboardType="numeric"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Estado: {productData.estado}</Text>
              <Switch
                value={productData.estado === "activo"}
                onValueChange={(value) =>
                  setProductData({
                    ...productData,
                    estado: value ? "activo" : "inactivo",
                  })
                }
              />
            </View>

            {productData.imagen ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: productData.imagen }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setProductData({ ...productData, imagen: null })}
                >
                  <Text style={styles.removeButtonText}>Eliminar Imagen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageButton}
                onPress={handleImagePicker}
              >
                <Text style={styles.imageButtonText}>Subir Imagen</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#F9F9F9",
    borderRadius: 5,
    marginBottom: 15,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  imageContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default EditarProducto;