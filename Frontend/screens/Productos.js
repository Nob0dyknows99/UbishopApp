import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import { FontAwesome } from 'react-native-vector-icons';
import { useAuth } from '../components/AuthContext';

const ProductCard = ({ product, navigation }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          headers: {
            Authorization: `Client-ID ML8EDJv2Br2bJJMyTcksZRbEPQRcr4aKmnkt7LkB9Ww`,
          },
          params: {
            query: product.nombre_producto,
            per_page: 1,
          },
        });

        if (response.data.results?.length > 0) {
          setImageUrl(response.data.results[0].urls.small);
        }
      } catch (error) {
        console.error('Error al obtener la imagen:', error);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [product.nombre_producto]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product })}
    >
      {loadingImage ? (
        <ActivityIndicator size="small" color="#000" />
      ) : imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
      ) : (
        <Text style={styles.noImageText}>Sin imagen</Text>
      )}
      <Text style={styles.productName}>{product.nombre_producto}</Text>
      <Text style={styles.productPrice}>Precio: ${product.precio}</Text>
      <Text style={styles.productDescription}>{product.descripcion}</Text>
    </TouchableOpacity>
  );
};

const Productos = ({ navigation, route }) => {
  const { role, userId } = useAuth();
  const initialSearchText = route?.params?.searchText || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [priceOrder, setPriceOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch products and categories from the backend
  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        axios.get('http://192.168.0.106:3000/productos'),
        axios.get('http://192.168.0.106:3000/categorias'),
      ]);

      setProducts(productResponse.data);
      setCategories([{ nombre_categoria: 'Todos', categoria_id: null }, ...categoryResponse.data]);
    } catch (error) {
      console.error('Error al cargar productos o categorías:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Filter products
  const filteredProducts = products
    .filter((product) => {
      if (role === 'Tienda') {
        return product.tienda_id === userId;
      }

      if (categoryFilter !== 'Todos') {
        return (
          product.categoria_id ===
          categories.find((cat) => cat.nombre_categoria === categoryFilter)?.categoria_id
        );
      }

      return true;
    })
    .filter((product) =>
      searchText
        ? product.nombre_producto.toLowerCase().includes(searchText.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (priceOrder === 'asc') return a.precio - b.precio;
      if (priceOrder === 'desc') return b.precio - a.precio;
      return 0;
    });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="¿Qué necesitas?"
              placeholderTextColor="#B0B0B0"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <FontAwesome name="search" size={20} color="#B0B0B0" />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.filterText}>Categoría: {categoryFilter}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() =>
                setPriceOrder(priceOrder === 'asc' ? 'desc' : priceOrder === 'desc' ? null : 'asc')
              }
            >
              <Text style={styles.filterText}>
                {priceOrder === 'asc'
                  ? 'Menor a mayor'
                  : priceOrder === 'desc'
                  ? 'Mayor a menor'
                  : 'Ordenar por precio'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Modal */}
          <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona una categoría</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item, index) => `${item.nombre_categoria}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setCategoryFilter(item.nombre_categoria);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.nombre_categoria}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Product List */}
          <ScrollView contentContainerStyle={styles.productsContainer}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={`${product._id}-${index}`}
                  product={product}
                  navigation={navigation}
                />
              ))
            ) : (
              <Text style={styles.noProductsText}>No se encontraron productos</Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Productos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  searchButton: {
    marginLeft: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    elevation: 2,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginVertical: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
