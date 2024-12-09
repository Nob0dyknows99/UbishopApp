import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../components/AuthContext'; // Importa el contexto de autenticación

const AgregarProducto = ({ navigation }) => {
  const { userId } = useAuth(); // Obtén el userId del usuario logueado desde el contexto
  const [productData, setProductData] = useState({
    tienda_id: userId, // Usa el userId como tienda_id
    nombre_producto: '',
    descripcion: '',
    precio: '',
    categoria_id: null,
    estado: 'activo',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [image, setImage] = useState(null); // Estado para la imagen seleccionada

  // Obtener categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.0.106:3000/categorias');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error.message);
        Alert.alert('Error', 'No se pudieron cargar las categorías.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Manejar selección de imagen desde galería
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para continuar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Manejar selección de imagen desde cámara
  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para continuar');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Remover imagen seleccionada
  const handleRemoveImage = () => {
    setImage(null);
  };

  // Guardar producto en el backend
  const handleSaveProduct = async () => {
    // Validar campos obligatorios
    if (
      !productData.nombre_producto ||
      !productData.descripcion ||
      !productData.precio ||
      !productData.categoria_id
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Construir el payload
    const payload = {
      ...productData,
      tienda_id: userId, // Asegurarse de enviar el userId logueado
      precio: parseFloat(productData.precio), // Convertir precio a número
    };

    try {
      const response = await fetch('http://192.168.0.106:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Producto guardado correctamente');
        navigation.goBack(); // Regresar a la pantalla anterior
      } else {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        Alert.alert('Error', `No se pudo guardar el producto: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
      Alert.alert('Error', 'Ocurrió un problema al guardar el producto. Inténtalo nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Agregar Producto</Text>

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
          keyboardType="numeric"
          value={productData.precio}
          onChangeText={(text) =>
            setProductData({ ...productData, precio: text })
          }
        />

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            Alert.alert('Seleccionar Categoría', null, [
              ...categories.map((category) => ({
                text: category.nombre_categoria,
                onPress: () =>
                  setProductData({
                    ...productData,
                    categoria_id: category.categoria_id,
                  }),
              })),
              { text: 'Cancelar', style: 'cancel' },
            ])
          }
        >
          <Text style={styles.dropdownText}>
            {
              categories.find(
                (category) => category.categoria_id === productData.categoria_id
              )?.nombre_categoria || 'Categoría'
            }
          </Text>
        </TouchableOpacity>

        {/* Manejo de Imagen */}
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() =>
              Alert.alert('Subir imagen', 'Selecciona una opción', [
                { text: 'Cámara', onPress: handleCamera },
                { text: 'Galería', onPress: handleImagePicker },
                { text: 'Cancelar', style: 'cancel' },
              ])
            }
          >
            <Text style={styles.imageButtonText}>Subir imagen</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  imageButton: {
    width: '60%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgregarProducto;
