import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../components/AuthContext';

const PerfilCliente = () => {
  const { role, logout, userInfo } = useAuth();

  if (role !== 'Cliente') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No tienes acceso a esta pantalla.</Text>
      </View>
    );
  }

  const [editableField, setEditableField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [backupData, setBackupData] = useState({});

  useEffect(() => {
    console.log('userInfo recibido:', userInfo); // LOG DE DEPURACIÓN
    setFormData({
      name: userInfo.nombre_usuario || '',
      phone: userInfo.telefono || '', // Asegúrate de que `telefono` esté disponible
      email: userInfo.email || '',
    });
  }, [userInfo]);

  const handleEdit = (field) => {
    setEditableField(field);
    setBackupData({ ...formData });
  };

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    setEditableField(null);
  };

  const handleCancel = () => {
    setFormData({ ...backupData });
    setEditableField(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, {formData.name}!</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.name}
            editable={editableField === 'name'}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => handleEdit('name')}>
            <FontAwesome name="edit" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.phone}
            editable={editableField === 'phone'}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => handleEdit('phone')}>
            <FontAwesome name="edit" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            editable={false}
          />
        </View>

        {editableField && (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    color: '#000',
  },
  editIcon: {
    marginLeft: 10,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#32CD32',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FF4500',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#FF4500',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PerfilCliente;
