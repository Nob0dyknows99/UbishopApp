import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';

const AgregarUbicacion = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [customAddress, setCustomAddress] = useState(''); // Estado para el nombre de la nueva dirección
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { onLocationSelect } = route.params; // Callback recibido desde PerfilTienda

    const goToMyLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación actual.');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
        }
    };

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const confirmarUbicacion = () => {
        if (selectedLocation && customAddress.trim() !== '') {
            const newLocation = {
                ...selectedLocation,
                direccion: customAddress,
            };
            onLocationSelect(newLocation); // Enviar la ubicación seleccionada con el nombre personalizado
            navigation.goBack(); // Regresar a la pantalla anterior
        } else {
            Alert.alert('Error', 'Por favor selecciona una ubicación y asigna un nombre.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subHeaderText}>¿Dónde te encuentras?</Text>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                onPress={handleMapPress}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        pinColor="red"
                    />
                )}
            </MapView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre para esta dirección"
                    placeholderTextColor="#B0B0B0"
                    value={customAddress}
                    onChangeText={setCustomAddress}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.locationButton} onPress={goToMyLocation}>
                    <FontAwesome name="location-arrow" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmarUbicacion}>
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    subHeaderText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginVertical: 10,
    },
    map: {
        flex: 1,
        marginVertical: 10,
        borderRadius: 15,
        marginHorizontal: 10,
    },
    inputContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    input: {
        height: 40,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#CCC',
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    locationButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#4169E1',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    confirmButton: {
        backgroundColor: '#32CD32',
        paddingVertical: 15,
        width: '90%',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default AgregarUbicacion;
