import mongoose from "mongoose";

// Define el esquema
const productoSchema = new mongoose.Schema({
  producto_id: { type: Number, required: true, unique: true },
  tienda_id: { type: Number, required: true },
  nombre_producto: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria_id: { type: Number, required: true },
  estado: { type: String, required: true, default: "activo" },
  imagen: { type: String, required: true }, // Campo para la URL de la imagen
});

// Especifica explícitamente el nombre de la colección: 'Productos'
const Productos = mongoose.model("Productos", productoSchema, "Productos");

export default Productos;