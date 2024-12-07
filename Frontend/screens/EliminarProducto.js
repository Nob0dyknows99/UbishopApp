import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const EliminarProducto = ({ navigation }) => {
  const { userId } = useAuth(); // Obtener el ID del usuario logueado
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState(null);

  // Obtener los productos de la tienda logueada
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://192.168.0.104:3000/productos`);
        const userProducts = response.data.filter(
          (product) => product.tienda_id === userId
        );
        setProducts(userProducts);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los productos.');
      }
    };
    fetchProducts();
  }, [userId]);

  const handleProductSelection = () => {
    if (products.length === 0) {
      Alert.alert('Error', 'No tienes productos para eliminar.');
      return;
    }

    Alert.alert('Seleccionar producto', 'Elige un producto:', [
      ...products.map((product) => ({
        text: product.nombre_producto,
        onPress: () => setSelectedProduct(product),
      })),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Por favor selecciona un producto para eliminar.');
      return;
    }

    try {
      await axios.delete(
        `http://192.168.0.104:3000/productos/${selectedProduct.producto_id}`
      );

      setDeletedProduct(selectedProduct); // Guardar el producto eliminado
      const remainingProducts = products.filter(
        (product) => product.producto_id !== selectedProduct.producto_id
      );
      setProducts(remainingProducts); // Actualizar la lista de productos
      setSelectedProduct(null); // Reiniciar selección
      Alert.alert(
        'Producto eliminado',
        `El producto "${selectedProduct.nombre_producto}" ha sido eliminado.`
      );
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto.');
    }
  };

  const handleUndo = () => {
    if (!deletedProduct) {
      Alert.alert('Error', 'No hay ningún producto para deshacer la eliminación.');
      return;
    }

    // Restaurar el producto eliminado (solo en el estado local)
    setProducts([...products, deletedProduct]);
    setDeletedProduct(null); // Limpiar la eliminación previa
    Alert.alert(
      'Acción deshecha',
      `El producto "${deletedProduct.nombre_producto}" ha sido restaurado.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Botón de regreso */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Eliminar Producto</Text>

            <TouchableOpacity style={styles.dropdownButton} onPress={handleProductSelection}>
              <Text style={styles.dropdownButtonText}>
                {selectedProduct ? selectedProduct.nombre_producto : 'Seleccionar producto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>

            {deletedProduct && (
              <TouchableOpacity style={styles.undoButton} onPress={handleUndo}>
                <Text style={styles.undoButtonText}>Deshacer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 15,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
  },
  deleteButton: {
    width: '60%',
    height: 40,
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  undoButton: {
    width: '60%',
    height: 40,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  undoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EliminarProducto;
