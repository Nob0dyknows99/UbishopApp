import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState('Excelente');
  const [isModalVisible, setModalVisible] = useState(false);
  const [storeName, setStoreName] = useState('Cargando...');
  const [storeLocation, setStoreLocation] = useState(null);
  const { isLoggedIn, userId, userInfo } = useAuth();

  const ratingMap = {
    Excelente: 5,
    Bueno: 4,
    Regular: 3,
    Malo: 2,
    Terrible: 1,
  };

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (product?.tienda_id) {
        try {
          const locationResponse = await axios.get(
            `http://192.168.0.106:3000/ubicacion/${product.tienda_id}`
          );
          setStoreLocation(locationResponse.data);
        } catch (error) {
          console.error('Error al obtener la ubicación de la tienda:', error);
        }
        try {
          const storeResponse = await axios.get(
            `http://192.168.0.106:3000/tienda/${product.tienda_id}`
          );
          setStoreName(storeResponse.data.nombre || 'Tienda no disponible');
        } catch (error) {
          console.error('Error al obtener el nombre de la tienda:', error);
        }
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.106:3000/opiniones/producto/${product.producto_id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error al obtener opiniones:', error);
      }
    };

    fetchStoreDetails();
    fetchReviews();
  }, [product]);

  const handleNavigateToStore = () => {
    if (!storeLocation || !storeLocation.latitud || !storeLocation.longitud) {
      Alert.alert('Error', 'No se pudo obtener la ubicación de la tienda.');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeLocation.latitud},${storeLocation.longitud}&travelmode=driving`;

    Linking.openURL(url).catch((err) => {
      console.error('Error al abrir Google Maps:', err);
    });
  };

  const handleAddReview = async () => {
    if (!isLoggedIn) {
      Alert.alert('Error', 'Debes iniciar sesión para agregar una reseña.');
      return;
    }

    if (!newReview.trim()) {
      Alert.alert('Error', 'Debe ingresar una reseña válida.');
      return;
    }

    try {
      const newOpinion = {
        opinion_id: Date.now(),
        user_id: userId,
        producto_id: product.producto_id,
        calificacion: ratingMap[newRating],
        comentario: newReview.trim(),
      };

      const response = await axios.post('http://192.168.0.106:3000/opiniones', newOpinion);

      if (response.status === 201) {
        setReviews([...reviews, { ...newOpinion, usuario: userInfo.nombre_usuario }]);
        setNewReview('');
        setNewRating('Excelente');
        setModalVisible(false);
        Alert.alert('Éxito', 'Reseña añadida exitosamente.');
      } else {
        throw new Error('Error inesperado al guardar la reseña.');
      }
    } catch (error) {
      console.error('Error al agregar reseña:', error);
      Alert.alert('Error', 'No se pudo agregar la reseña. Verifica los datos ingresados.');
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <FontAwesome
            key={index}
            name={index < rating ? 'star' : 'star-o'}
            size={16}
            color="gold"
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#007BFF" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.productName}>{product.nombre_producto}</Text>
        <Image source={{ uri: product.imagen }} style={styles.productImage} />
        <Text style={styles.storeName}>Tienda: {storeName}</Text>
        <Text style={styles.productPrice}>${product.precio}</Text>
        <Text style={styles.productDescription}>{product.descripcion}</Text>
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToStore}>
          <Text style={styles.navigateButtonText}>Ir a tienda</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsTitle}>Reseñas</Text>
        {isLoggedIn && (
          <TouchableOpacity style={styles.addReviewButton} onPress={() => setModalVisible(true)}>
            <FontAwesome name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewCard}>
          <Text style={styles.reviewAuthor}>{review.usuario || 'Usuario desconocido'}</Text>
          {renderStars(review.calificacion)}
          <Text style={styles.reviewText}>{review.comentario}</Text>
        </View>
      ))}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Añadir Reseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu reseña..."
              value={newReview}
              onChangeText={setNewReview}
            />
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => Alert.alert('Selecciona una calificación', null, [
                ...Object.keys(ratingMap).map((rating) => ({
                  text: rating,
                  onPress: () => setNewRating(rating),
                })),
                { text: 'Cancelar', style: 'cancel' },
              ])}
            >
              <Text style={styles.selectorButtonText}>Calificación: {newRating}</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddReview}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  card: {
    marginBottom: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  navigateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  navigateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addReviewButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  reviewCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#CCC',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default ProductDetails;
