<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubishop App - README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        header {
            background: #0073e6;
            color: #fff;
            padding: 20px 10px;
            text-align: center;
        }
        nav ul {
            background: #333;
            color: #fff;
            padding: 10px;
            list-style: none;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        nav ul li {
            margin: 5px 0;
        }
        nav ul a {
            color: #fff;
            text-decoration: none;
            padding: 5px 10px;
            transition: background 0.3s;
        }
        nav ul a:hover {
            background: #0073e6;
            border-radius: 5px;
        }
        section {
            padding: 20px;
            background: #fff;
            margin: 20px auto;
            max-width: 800px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1, h2 {
            color: #0073e6;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        pre {
            background: #f4f4f4;
            border-left: 5px solid #0073e6;
            padding: 10px;
            overflow-x: auto;
        }
        code {
            color: #0073e6;
        }
        footer {
            text-align: center;
            padding: 10px;
            margin-top: 20px;
            background: #333;
            color: #fff;
        }
    </style>
</head>
<body>
    <header>
        <h1>Ubishop App</h1>
        <p>Una solución innovadora para mejorar la experiencia de compra, conectando consumidores con comercios locales.</p>
    </header>

    <nav>
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

    <footer>
        <p>© 2024 Ubishop App. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
