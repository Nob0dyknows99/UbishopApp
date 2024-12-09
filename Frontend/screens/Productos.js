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
import * as Location from 'expo-location';
import { useAuth } from '../components/AuthContext';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en kilómetros
};

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
  const [locations, setLocations] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [priceOrder, setPriceOrder] = useState(null);
  const fixedRadius = 5000;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.0.106:3000/productos');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:3000/ubicacion');
      setLocations(response.data);
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
    }
  };

  const fetchTiendas = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:3000/tiendas');
      setTiendas(response.data.filter((tienda) => tienda.plan_id !== 0));
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:3000/categorias');
      setCategories([{ nombre_categoria: 'Todos', categoria_id: null }, ...response.data]);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Se necesitan permisos de ubicación para filtrar productos cercanos.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchTiendas();
    fetchCategories();
    if (role !== 'Tienda') fetchLocation();
  }, [role]);

  const filteredProducts = products
    .filter((product) => {
      const tienda = tiendas.find((t) => t.tienda_id === product.tienda_id);

      console.log('Productos:', products);
      console.log('Tiendas:', tiendas);
      console.log('Rol:', role, 'User ID:', userId);

      if (!tienda) return false;

      if (role === 'Tienda') {
        return tienda.user_id === userId;
      }

      if (role === 'Todos' && userLocation) {
        const location = locations.find((loc) => loc.tienda_id === product.tienda_id);
        if (!location || !location.latitud || !location.longitud) {
          return false;
        }

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitud,
          location.longitud
        );

        return distance <= fixedRadius;
      }

      return true;
    })
    .filter((product) =>
      categoryFilter === 'Todos'
        ? true
        : product.categoria_id === categories.find((cat) => cat.nombre_categoria === categoryFilter)?.categoria_id
    )
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
