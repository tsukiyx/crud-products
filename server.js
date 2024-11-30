const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const PASSWORD = "CqYclt90VGkgNXGc";
const BASE_URL = `mongodb+srv://noirxen:${PASSWORD}@cluster0.fxhnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
const PORT = 5040;

const product = require("./moduls/products");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(BASE_URL)
  .then(() => console.log("Conectado a mongoDB"))
  .catch((error) => console.log("No se puede conectar", error));

app.post("/db/products", async (req, res) => {
  try {
    const newProduct = new product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/db/products", async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/db/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID del producto a actualizar:", id);
    console.log("Datos recibidos para actualizar:", req.body);

    const updatedProduct = await product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Producto actualizado:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/db/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
