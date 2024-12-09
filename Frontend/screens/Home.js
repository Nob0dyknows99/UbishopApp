import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ProductCard } from '../components/ProductCard';

const Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [ubicaciones, setUbicaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Productos', { searchText }); // Navegar a Productos.js con el texto de búsqueda
    }
  };

  // Función para centrar el mapa en la ubicación actual del usuario
  const centerOnUserLocation = () => {
    if (currentLocation && mapRef) {
      mapRef.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  };

  // Efecto para obtener datos del servidor y la ubicación actual
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const response = await fetch('http://192.168.0.106:3000/tiendas/ubicacion');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setUbicaciones(data);
        } else {
          throw new Error('Formato inesperado de datos.');
        }
      } catch (error) {
        console.error('Error obteniendo ubicaciones:', error.message);
        setError('No se pudieron cargar las ubicaciones.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await fetch('http://192.168.0.106:3000/Productos');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setProductos(data.slice(0, 4)); // Mostrar solo los primeros 4 productos
      } catch (error) {
        console.error('Error obteniendo productos:', error.message);
        setError('No se pudieron cargar los productos.');
      }
    };

    const fetchCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Permiso de ubicación denegado');
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error obteniendo la ubicación actual:', error.message);
        setError('No se pudo obtener la ubicación actual.');
      }
    };

    fetchUbicaciones();
    fetchProductos();
    fetchCurrentLocation();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="¿Qué necesitas?"
          placeholderTextColor="#B0B0B0"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#B0B0B0" />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <MapView
              ref={(ref) => setMapRef(ref)}
              style={styles.map}
              initialRegion={{
                latitude: currentLocation?.latitude || -35.4355,
                longitude: currentLocation?.longitude || -71.6433,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation
              showsMyLocationButton={false} // Ocultar el botón del sistema
            >
              {/* Marcadores de ubicaciones */}
              {ubicaciones.length > 0 &&
                ubicaciones.map((ubicacion) => {
                  const { ubicacionInfo } = ubicacion;
                  if (ubicacionInfo && ubicacionInfo.latitud && ubicacionInfo.longitud) {
                    return (
                      <Marker
                        key={ubicacion._id}
                        coordinate={{
                          latitude: ubicacionInfo.latitud,
                          longitude: ubicacionInfo.longitud,
                        }}
                        title={ubicacion.nombre}
                        description={ubicacion.descripcion}
                      />
                    );
                  }
                  console.warn(`Ubicación inválida:`, ubicacion);
                  return null;
                })}
            </MapView>
            {/* Botón para centrar en la ubicación del usuario */}
            <TouchableOpacity style={styles.centerButton} onPress={centerOnUserLocation}>
              <MaterialIcons name="my-location" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Productos destacados */}
      <View style={styles.productsContainer}>
        {productos.length > 0 ? (
          productos.map((product) => (
            <View style={styles.productWrapper} key={product._id || product.id}>
              <ProductCard product={product} />
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>No hay productos para mostrar.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#B0B0B0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    padding: 5,
  },
  mapContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.4,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4169E1',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  productWrapper: {
    width: '48%',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Home;