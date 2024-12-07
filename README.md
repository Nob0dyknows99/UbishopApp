<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubishop App - README</title>
</head>
<body>
    <header>
        <h1>Ubishop App</h1>
        <p>Una solución innovadora para mejorar la experiencia de compra, conectando consumidores con comercios locales mediante funcionalidades avanzadas como geolocalización, cotización instantánea y más.</p>
    </header>

    <nav>
        <h2>Tabla de Contenidos</h2>
        <ul>
            <li><a href="#descripcion">Descripción del Proyecto</a></li>
            <li><a href="#caracteristicas">Características Principales</a></li>
            <li><a href="#requerimientos">Requerimientos del Sistema</a></li>
            <li><a href="#arquitectura">Arquitectura Tecnológica</a></li>
            <li><a href="#instalacion">Instalación</a></li>
            <li><a href="#uso">Uso</a></li>
            <li><a href="#colaboracion">Colaboración</a></li>
            <li><a href="#autores">Autores</a></li>
            <li><a href="#licencia">Licencia</a></li>
        </ul>
    </nav>

    <section id="descripcion">
        <h2>Descripción del Proyecto</h2>
        <p>Ubishop App es una aplicación móvil que facilita a los usuarios buscar y comparar precios de bienes y servicios en tiempo real, utilizando su ubicación geográfica. También permite a los comercios locales destacar frente a grandes cadenas, incrementando su visibilidad y ventas.</p>
        <h3>Objetivo General</h3>
        <p>Desarrollar una plataforma que permita la cotización de productos y servicios con base en la ubicación del usuario, ofreciendo opciones relevantes y personalizadas.</p>
    </section>

    <section id="caracteristicas">
        <h2>Características Principales</h2>
        <ul>
            <li><strong>Geolocalización en tiempo real:</strong> Encuentra opciones cercanas a la ubicación del usuario.</li>
            <li><strong>Cotización instantánea:</strong> Muestra precios de productos y servicios de múltiples proveedores.</li>
            <li><strong>Perfiles de comercios locales:</strong> Incluye información detallada de horarios, productos y calificaciones.</li>
            <li><strong>Notificaciones personalizadas:</strong> Ofertas y promociones basadas en preferencias del usuario.</li>
            <li><strong>Sistema de opiniones:</strong> Los usuarios pueden evaluar y comentar sobre comercios y servicios.</li>
        </ul>
    </section>

    <section id="requerimientos">
        <h2>Requerimientos del Sistema</h2>
        <ul>
            <li><strong>Plataforma:</strong> Android 8.0 o superior</li>
            <li><strong>Tecnologías:</strong> React Native, Node.js con Express, MySQL</li>
            <li><strong>Dependencias:</strong>
                <ul>
                    <li>API de mapas para geolocalización</li>
                    <li>API de comparación de precios</li>
                </ul>
            </li>
            <li><strong>Otros:</strong> Conexión a Internet para funcionalidades en tiempo real</li>
        </ul>
    </section>

    <section id="arquitectura">
        <h2>Arquitectura Tecnológica</h2>
        <p>El sistema está diseñado con los siguientes componentes:</p>
        <ul>
            <li><strong>Frontend:</strong> React Native</li>
            <li><strong>Backend:</strong> Node.js con Express</li>
            <li><strong>Base de Datos:</strong> MySQL Workbench</li>
        </ul>
        <p><strong>Flujo de Trabajo:</strong></p>
        <ol>
            <li>React Native realiza peticiones HTTP al backend.</li>
            <li>Node.js procesa las peticiones y consulta la base de datos.</li>
            <li>Los datos son devueltos al frontend en formato JSON.</li>
        </ol>
    </section>

    <section id="instalacion">
        <h2>Instalación</h2>
        <ol>
            <li>Clona este repositorio:
                <pre><code>git clone https://github.com/tuusuario/ubishop-app.git</code></pre>
            </li>
            <li>Instala las dependencias del frontend y backend:
                <pre><code>cd frontend
npm install
cd ../backend
npm install</code></pre>
            </li>
            <li>Configura la base de datos en <code>backend/config/database.js</code>.</li>
            <li>Inicia los servidores:
                <pre><code>cd frontend
npm start
cd ../backend
npm run dev</code></pre>
            </li>
        </ol>
    </section>

    <section id="uso">
        <h2>Uso</h2>
        <ol>
            <li>Registra un usuario desde la aplicación.</li>
            <li>Permite el acceso a tu ubicación para visualizar comercios cercanos.</li>
            <li>Busca productos o servicios y compara precios en tiempo real.</li>
            <li>Califica y deja opiniones para mejorar la comunidad de usuarios.</li>
        </ol>
    </section>

    <section id="colaboracion">
        <h2>Colaboración</h2>
        <p>Estamos abiertos a contribuciones. Por favor, sigue estos pasos:</p>
        <ol>
            <li>Haz un fork del repositorio.</li>
            <li>Crea una rama para tu funcionalidad (<code>git checkout -b feature/nueva-funcion</code>).</li>
            <li>Envía un pull request.</li>
        </ol>
    </section>

    <section id="autores">
        <h2>Autores</h2>
        <ul>
            <li><strong>Vicente Campillay:</strong> Tester</li>
            <li><strong>Benjamin Gonzalez:</strong> Backend Developer</li>
            <li><strong>Marcelo Cancino:</strong> Scrum Master</li>
            <li><strong>Claudio Acevedo:</strong> Frontend Developer</li>
            <li><strong>Luis Arévalo:</strong> UI/UX Designer</li>
        </ul>
    </section>

    <section id="licencia">
        <h2>Licencia</h2>
        <p>Este proyecto está licenciado bajo los términos de la <a href="LICENSE">MIT License</a>.</p>
    </section>
</body>
</html>
