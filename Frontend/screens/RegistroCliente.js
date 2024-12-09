import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const RegistroCliente = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    nombre: false,
    email: false,
    telefono: false,
    password: false,
    repeatPassword: false,
  });

  const handleRegister = async () => {
    setError('');
    setFieldErrors({
      nombre: false,
      email: false,
      telefono: false,
      password: false,
      repeatPassword: false,
    });

    const newFieldErrors = { ...fieldErrors };
    if (!nombre) newFieldErrors.nombre = true;
    if (!email) newFieldErrors.email = true;
    if (!telefono) newFieldErrors.telefono = true;
    if (!password) newFieldErrors.password = true;
    if (!repeatPassword) newFieldErrors.repeatPassword = true;

    if (Object.values(newFieldErrors).some((error) => error)) {
      setError('Todos los campos son obligatorios');
      setFieldErrors(newFieldErrors);
      return;
    }

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      setFieldErrors({ ...newFieldErrors, password: true, repeatPassword: true });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El formato del email es incorrecto');
      setFieldErrors({ ...newFieldErrors, email: true });
      return;
    }

    try {
      const response = await fetch('http://192.168.0.106:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario: nombre.trim(),
          email: email.trim().toLowerCase(),
          clave: password.trim(),
          rol_id: 1,
          telefono: telefono.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.mensaje);
        navigation.navigate('Login');
      } else {
        if (data.error === 'Email ya registrado') {
          setError('El email ya está registrado');
          setFieldErrors({ ...newFieldErrors, email: true });
        } else {
          setError(data.error || 'Error al registrarse');
        }
      }
    } catch (error) {
      setError('Error de red. Inténtalo nuevamente más tarde.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Registro de Cliente</Text>
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={[styles.input, fieldErrors.nombre ? styles.inputError : null]}
              placeholder="Nombre y Apellido"
              placeholderTextColor="#B0B0B0"
              value={nombre}
              onChangeText={(value) => {
                setNombre(value);
                setFieldErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
            <TextInput
              style={[styles.input, fieldErrors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setFieldErrors((prev) => ({ ...prev, email: false }));
              }}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, fieldErrors.telefono ? styles.inputError : null]}
              placeholder="Teléfono"
              placeholderTextColor="#B0B0B0"
              value={telefono}
              onChangeText={(value) => {
                setTelefono(value);
                setFieldErrors((prev) => ({ ...prev, telefono: false }));
              }}
            />
            <TextInput
              style={[styles.input, fieldErrors.password ? styles.inputError : null]}
              placeholder="Contraseña"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setFieldErrors((prev) => ({ ...prev, password: false }));
              }}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, fieldErrors.repeatPassword ? styles.inputError : null]}
              placeholder="Repite Contraseña"
              placeholderTextColor="#B0B0B0"
              value={repeatPassword}
              onChangeText={(value) => {
                setRepeatPassword(value);
                setFieldErrors((prev) => ({ ...prev, repeatPassword: false }));
              }}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    padding: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4169E1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RegistroCliente;