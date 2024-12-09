// Importaciones necesarias
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


// Definir esquemas y modelos
const productoSchema = new mongoose.Schema({
  producto_id: { type: Number, required: true, unique: true },
  nombre_producto: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria_id: { type: Number, required: true },
  tienda_id: { type: Number, required: true },
  estado: { type: String, required: true, default: 'activo' },
});

const opinionSchema = new mongoose.Schema({
  opinion_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  producto_id: { type: Number, required: true },
  calificacion: { type: Number, required: true },
  comentario: { type: String, required: true },
  fecha_opinion: { type: Date, default: Date.now },
});

const ubicacionSchema = new mongoose.Schema({
  tienda_id: { type: Number, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  direccion: { type: String, required: true },
});

const categoriaSchema = new mongoose.Schema({
  categoria_id: { type: Number, required: true },
  nombre_categoria: { type: String, required: true },
  descripcion: { type: String, required: true },
});

const usuarioSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  nombre_usuario: { type: String, required: true },
  clave: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  rol_id: { type: Number, required: true },
});

const tiendaSchema = new mongoose.Schema({
  tienda_id: { type: Number, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  propietario: { type: String, required: true },
  user_id: { type: Number, required: true },
  plan_id: { type: Number, required: true },
});

const planSchema = new mongoose.Schema({
  plan_id: { type: Number, required: true },
  periodo: { type: String, required: true },
  costo: { type: Number, required: true },
});

// Modelos
const Producto = mongoose.model('Producto', productoSchema, 'Productos');
const Opinion = mongoose.model('Opinion', opinionSchema, 'Opinion');
const Ubicacion = mongoose.model('Ubicacion', ubicacionSchema, 'ubicacion');
const Categoria = mongoose.model('Categoria', categoriaSchema, 'Categoria');
const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');
const Tienda = mongoose.model('Tienda', tiendaSchema, 'Tiendas');
const Plan = mongoose.model('Plan', planSchema, 'Planes');

// Inicialización de Express
const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose
  .connect('mongodb://localhost:27017/Ubishop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// ---- ENDPOINTS ----

// Leer productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find().lean();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/Planes', async (req, res) => {
  try {
    const Planes = await Planes.find().lean();
    res.json(Planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los Planes' });
  }
});

// Obtener todas las opiniones
app.get('/opiniones', async (req, res) => {
  try {
    const opiniones = await Opinion.find().lean();
    res.json(opiniones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las opiniones' });
  }
});

// Obtener Categorias
app.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Leer ubicaciones
app.get('/ubicacion', async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find().lean();
    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ubicaciones' });
  }
});

// Leer usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find().lean();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Leer tiendas
app.get('/tiendas', async (req, res) => {
  try {
    const tiendas = await Tienda.find().lean();
    res.json(tiendas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tiendas' });
  }
});

// Leer una tienda específica por tienda_id
app.get('/tienda/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tienda = await Tienda.findOne({ tienda_id: id }).lean();
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    res.json(tienda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tienda' });
  }
});

// Endpoint de login
app.post('/login', async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Verifica los datos enviados
    const { email, clave } = req.body;

    if (!email || !clave) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() }).lean();
    console.log('Usuario encontrado:', usuario); // Verifica el usuario obtenido

    if (!usuario || usuario.clave.trim() !== clave.trim()) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const rol = usuario.rol_id === 2 ? 'Tienda' : usuario.rol_id === 1 ? 'Cliente' : 'Desconocido';

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      rol,
      id: usuario.user_id,
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      telefono: usuario.telefono,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});



app.post('/register', async (req, res) => {
  const { nombre_usuario, email, clave, rol_id, telefono } = req.body; // Asegúrate de incluir `telefono`

  if (!nombre_usuario || !email || !clave || !rol_id || !telefono) { // Validar también `telefono`
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ email: email.trim().toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario({
      user_id: Date.now(),
      nombre_usuario: nombre_usuario.trim(),
      clave: clave.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono.trim(), // Guardar el teléfono correctamente
      rol_id,
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});


// Endpoint para insertar en "Tiendas"
app.post('/tiendas', async (req, res) => {
  const { tienda_id, nombre, descripcion, propietario, user_id } = req.body;

  if (!tienda_id || !nombre || !descripcion || !propietario || !user_id) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const nuevaTienda = new Tienda({
      tienda_id,
      nombre,
      descripcion,
      propietario,
      user_id,
    });

    await nuevaTienda.save();
    res.status(201).json({ mensaje: 'Tienda registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la tienda' });
  }
});

// Endpoint para editar un producto
app.put('/productos/:producto_id', async (req, res) => {
  const { producto_id } = req.params; // Obtenemos el producto_id
  const { nombre_producto, precio, descripcion, categoria_id, estado } = req.body;

  // Validación de campos
  if (!nombre_producto || !precio || !descripcion || !categoria_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
      // Buscar el producto por producto_id y actualizarlo
      const productoActualizado = await Producto.findOneAndUpdate(
          { producto_id: parseInt(producto_id) }, // Buscar por producto_id
          { nombre_producto, precio, descripcion, categoria_id, estado }, // Actualizar campos
          { new: true } // Devolver el producto actualizado
      );

      if (!productoActualizado) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({
          mensaje: 'Producto actualizado exitosamente',
          producto: productoActualizado,
      });
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


//eliminar producto
app.delete('/productos/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  try {
    const productoEliminado = await Producto.findOneAndDelete({ producto_id: parseInt(producto_id) });
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});




// Endpoint para insertar en "Productos"
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.aggregate([
      {
        $lookup: {
          from: 'Tiendas', // Nombre exacto de la colección de tiendas
          localField: 'tienda_id', // Campo en la colección Productos
          foreignField: 'tienda_id', // Campo en la colección Tiendas
          as: 'tiendaInfo', // Resultado del join
        },
      },
      {
        $unwind: {
          path: '$tiendaInfo', // Desanidar la información de la tienda
          preserveNullAndEmptyArrays: true, // Permitir productos sin tienda asociada
        },
      },
      {
        $project: {
          _id: 0,
          producto_id: 1,
          tienda_id: 1,
          nombre_producto: 1,
          descripcion: 1,
          precio: 1,
          categoria_id: 1,
          estado: 1,
          'tiendaInfo.nombre': 1, // Incluye el nombre de la tienda
          'tiendaInfo.descripcion': 1, // Incluye la descripción de la tienda
        },
      },
    ]);

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});










// Endpoint para insertar en "Ubicacion"
app.post('/ubicacion', async (req, res) => {
  const { tienda_id, latitud, longitud, direccion } = req.body;

  if (!tienda_id || !latitud || !longitud || !direccion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const nuevaUbicacion = new Ubicacion({
      tienda_id,
      latitud,
      longitud,
      direccion,
    });

    await nuevaUbicacion.save();
    res.status(201).json({ mensaje: 'Ubicación registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la ubicación' });
  }
});


// Obtener opiniones por producto_id
app.get('/opiniones/producto/:producto_id', async (req, res) => {
  const { producto_id } = req.params;

  try {
    const opiniones = await Opinion.aggregate([
      {
        $match: { producto_id: parseInt(producto_id) },
      },
      {
        $lookup: {
          from: 'usuarios', // Nombre exacto de la colección
          localField: 'user_id', // Campo en la colección Opiniones
          foreignField: 'user_id', // Campo en la colección Usuarios
          as: 'usuarioInfo', // Resultado del join
        },
      },
      {
        $unwind: {
          path: '$usuarioInfo',
          preserveNullAndEmptyArrays: true, // Permite valores nulos si no hay coincidencia
        },
      },
      {
        $project: {
          opinion_id: 1,
          producto_id: 1,
          calificacion: 1,
          comentario: 1,
          fecha_opinion: 1,
          usuario: '$usuarioInfo.nombre_usuario', // Incluye el nombre del usuario
        },
      },
    ]);

    console.log('Opiniones obtenidas:', opiniones);
    res.json(opiniones);
  } catch (error) {
    console.error('Error al obtener opiniones:', error);
    res.status(500).json({ error: 'Error al obtener opiniones del producto' });
  }
});






app.get('/productos/categoria/:categoria_id', async (req, res) => {
  const { categoria_id } = req.params;

  try {
    const productosPorCategoria = await Producto.aggregate([
      {
        $match: { categoria_id: parseInt(categoria_id) } // Campo correcto para la coincidencia
      },
      {
        $lookup: {
          from: 'Categoria', // Nombre exacto de la colección
          localField: 'categoria_id', // Campo en la colección Productos
          foreignField: 'categoria_id', // Campo en la colección Categoria
          as: 'categoriaInfo' // Nombre del campo en el resultado
        }
      },
      {
        $unwind: '$categoriaInfo' // Desanida la información de la categoría
      },
      {
        $project: {
          _id: 1,
          nombre_producto: 1,
          descripcion: 1,
          precio: 1,
          estado: 1,
          'categoriaInfo.nombre_categoria': 1,
          'categoriaInfo.descripcion': 1
        }
      }
    ]);

    res.json(productosPorCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos de la categoría' });
  }
});


app.get('/productos/ubicacion', async (req, res) => {
  try {
    const productos = await Producto.aggregate([
      {
        $lookup: {
          from: 'ubicacion', // Nombre de la colección de ubicaciones
          localField: 'tienda_id', // Relación entre productos y tiendas
          foreignField: 'tienda_id', // Campo relacionado en ubicaciones
          as: 'ubicacionInfo',
        },
      },
      {
        $unwind: '$ubicacionInfo', // Desanidar los datos de ubicación
      },
      {
        $project: {
          _id: 1,
          producto_id: 1, // Incluye producto_id
          nombre_producto: 1,
          precio: 1,
          descripcion: 1,
          categoria_id: 1,
          estado: 1,
          'ubicacionInfo.latitud': 1,
          'ubicacionInfo.longitud': 1,
          'ubicacionInfo.direccion': 1,
        },
      },
    ]);

    console.log('Productos con ubicación obtenidos:', productos); // Verifica producto_id
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos con ubicación:', error);
    res.status(500).json({ error: 'Error al obtener productos con ubicación' });
  }
});




app.get('/tiendas/ubicacion', async (req, res) => {
  try {
    const tiendasConUbicacion = await Tienda.aggregate([
      {
        $lookup: {
          from: 'ubicacion', // Nombre exacto de la colección
          localField: 'tienda_id', // Campo en la colección Tiendas
          foreignField: 'tienda_id', // Campo en la colección Ubicacion
          as: 'ubicacionInfo' // Nombre del campo en el resultado
        }
      },
      {
        $unwind: '$ubicacionInfo' // Desanida la información de ubicación
      },
      {
        $project: {
          _id: 1,
          nombre: 1,
          descripcion: 1,
          propietario: 1,
          'ubicacionInfo.latitud': 1,
          'ubicacionInfo.longitud': 1,
          'ubicacionInfo.direccion': 1
        }
      }
    ]);

    res.json(tiendasConUbicacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tiendas con ubicación' });
  }
});

app.get('/tienda/plan/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const tiendaConPlan = await Tienda.aggregate([
      {
        $match: { user_id: parseInt(user_id) }, // Filtra por el user_id del usuario logueado
      },
      {
        $lookup: {
          from: 'Planes', // Une la colección de planes
          localField: 'plan_id',
          foreignField: 'plan_id',
          as: 'planInfo',
        },
      },
      {
        $unwind: '$planInfo', // Desanidar los datos del plan
      },
      {
        $project: {
          _id: 0,
          nombre: 1,
          descripcion: 1,
          propietario: 1,
          'planInfo.periodo': 1,
          'planInfo.costo': 1,
        },
      },
    ]);

    if (tiendaConPlan.length === 0) {
      return res.status(404).json({ error: 'No se encontró la tienda para el usuario logueado' });
    }

    res.json(tiendaConPlan[0]); // Devuelve la tienda con su plan
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la información de la tienda' });
  }
});



// Crear una nueva opinión
app.post('/opiniones', async (req, res) => {
  const { opinion_id, user_id, producto_id, calificacion, comentario } = req.body;

  if (!opinion_id || !user_id || !producto_id || !calificacion || !comentario) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const nuevaOpinion = new Opinion({
      opinion_id,
      user_id,
      producto_id,
      calificacion,
      comentario,
      fecha_opinion: new Date(), // Fecha actual
    });

    await nuevaOpinion.save();
    res.status(201).json({ mensaje: 'Opinión registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la opinión' });
  }
});


// Editar una opinión
app.put('/opiniones/:id', async (req, res) => {
  const { id } = req.params;
  const { calificacion, comentario } = req.body;

  if (!calificacion || !comentario) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const opinionActualizada = await Opinion.findByIdAndUpdate(
      id,
      { calificacion, comentario },
      { new: true }
    );

    if (!opinionActualizada) {
      return res.status(404).json({ error: 'Opinión no encontrada' });
    }

    res.json({
      mensaje: 'Opinión actualizada exitosamente',
      opinion: opinionActualizada,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la opinión' });
  }
});


// Eliminar una opinión
app.delete('/opiniones/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const opinionEliminada = await Opinion.findByIdAndDelete(id);

    if (!opinionEliminada) {
      return res.status(404).json({ error: 'Opinión no encontrada' });
    }

    res.json({ mensaje: 'Opinión eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la opinión' });
  }
});


app.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'preapproval') {
      const preapprovalId = event.data.id;

      // Llamar a la API de MercadoPago para verificar el estado del preapproval
      const response = await axios.get(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
      });

      const subscriptionData = response.data;

      // Verificar si la suscripción está autorizada
      if (subscriptionData.status === 'authorized') {
        const userId = parseInt(subscriptionData.external_reference); // `external_reference` contiene el `user_id` asignado al crear la suscripción
        const newPlanId = parseInt(subscriptionData.reason); // Usa `reason` para mapear el ID del plan

        // Actualizar el `plan_id` en la base de datos
        const tiendaActualizada = await Tienda.findOneAndUpdate(
          { user_id: userId },
          { plan_id: newPlanId },
          { new: true }
        );

        if (tiendaActualizada) {
          console.log(`Plan actualizado para la tienda: ${tiendaActualizada.nombre}`);
          return res.status(200).json({ message: 'Plan actualizado exitosamente' });
        } else {
          console.error('Tienda no encontrada');
          return res.status(404).json({ error: 'Tienda no encontrada' });
        }
      } else {
        console.error('Pago no autorizado');
        return res.status(400).json({ error: 'Pago no autorizado' });
      }
    }

    res.sendStatus(200); // Responde con éxito incluso si el evento no es relevante
  } catch (error) {
    console.error('Error procesando el webhook:', error);
    res.status(500).json({ error: 'Error interno al procesar el webhook' });
  }
});


app.get('/tienda/plan/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const tienda = await Tienda.findOne({ user_id: parseInt(user_id) });

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json({
      plan_id: tienda.plan_id,
      nombre: tienda.nombre,
      descripcion: tienda.descripcion,
    });
  } catch (error) {
    console.error('Error al obtener el plan de la tienda:', error);
    res.status(500).json({ error: 'Error al obtener el plan de la tienda' });
  }
});


// Actualizar ubicación por tienda_id
// Endpoint to fetch store location by tienda_id
app.get('/ubicacion/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ubicacion = await Ubicacion.findOne({ tienda_id: parseInt(id) }).lean();
    if (!ubicacion) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }
    res.json(ubicacion);
  } catch (error) {
    console.error('Error fetching store location:', error);
    res.status(500).json({ error: 'Error interno al obtener la ubicación' });
  }
});


app.post('/productos', async (req, res) => {
  const { nombre_producto, precio, descripcion, categoria_id, tienda_id, estado } = req.body;

  if (!nombre_producto || !precio || !descripcion || !categoria_id || !tienda_id) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const maxProducto = await Producto.findOne().sort({ producto_id: -1 }).lean();
    const nuevoProductoId = maxProducto ? maxProducto.producto_id + 1 : 1;

    const nuevoProducto = new Producto({
      producto_id: nuevoProductoId,
      nombre_producto,
      precio,
      descripcion,
      categoria_id,
      tienda_id,
      estado: estado || 'activo',
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


app.put('/usuarios/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { nombre_usuario, telefono } = req.body;

  if (!nombre_usuario || !telefono) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { user_id: parseInt(user_id) },
      { nombre_usuario, telefono },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});




// Inicialización del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
