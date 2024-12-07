 # <h1 align="center">Ubishop App</h1>

Una solución innovadora para mejorar la experiencia de compra, conectando consumidores con comercios locales.

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Características Principales](#características-principales)
3. [Requerimientos del Sistema](#requerimientos-del-sistema)
4. [Arquitectura Tecnológica](#arquitectura-tecnológica)
5. [Instalación](#instalación)

---

## Descripción del Proyecto

Ubishop App es una aplicación móvil que facilita a los usuarios buscar y comparar precios de bienes y servicios en tiempo real, utilizando su ubicación geográfica. También permite a los comercios locales destacar frente a grandes cadenas, incrementando su visibilidad y ventas.

### Objetivo General

Desarrollar una plataforma que permita la cotización de productos y servicios con base en la ubicación del usuario, ofreciendo opciones relevantes y personalizadas.

---

## Características Principales

- **Geolocalización en tiempo real:** Encuentra opciones cercanas a la ubicación del usuario.
- **Cotización instantánea:** Muestra precios de productos y servicios de múltiples proveedores.
- **Perfiles de comercios locales:** Incluye información detallada de horarios, productos y calificaciones.
- **Notificaciones personalizadas:** Ofertas y promociones basadas en preferencias del usuario.
- **Sistema de opiniones:** Los usuarios pueden evaluar y comentar sobre comercios y servicios.

---

## Requerimientos del Sistema

- **Plataforma:** Android 8.0 o superior
- **Tecnologías:** React Native, Node.js con Express, MongoDB, Mongoose
- **Dependencias:**
  - API de mapas para geolocalización
  - API de comparación de precios
- **Otros:** Conexión a Internet para funcionalidades en tiempo real

---

## Arquitectura Tecnológica

El sistema está diseñado con los siguientes componentes:

- **Frontend:** React Native
- **Backend:** Node.js con Express
- **Base de Datos:** MongoDBCompass

**Flujo de Trabajo:**

1. React Native realiza peticiones HTTP al backend.
2. Node.js procesa las peticiones y consulta la base de datos.
3. Los datos son devueltos al frontend en formato JSON.

---

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/ubishop-app.git

2. Instala las dependencias del frontend y backend:

    ```bash
    cd frontend
    npm install
    cd ../backend
    npm install

