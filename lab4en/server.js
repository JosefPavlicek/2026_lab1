const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = "products.json";

app.use(cors());
app.use(express.json());

// serve static files
app.use(express.static(__dirname));


// Load products from file on server start
let products = loadProducts();


// Function to load products from disk
function loadProducts() {
   try {
       if (fs.existsSync(DATA_FILE)) {
           const data = fs.readFileSync(DATA_FILE, "utf8");
           return JSON.parse(data);
       } else {
           return []; // If file doesn't exist, return empty array
       }
   } catch (error) {
       console.error("Error loading products:", error);
       return [];
   }
}


// Function to save products to disk
function saveProducts() {
   try {
       fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
   } catch (error) {
       console.error("Error saving products:", error);
   }
}


// Function to ensure correct data types
function sanitizeProduct(product) {
   return {
       id: parseInt(product.id), // Ensure ID is integer
       name: product.name,
       price: parseFloat(product.price) // Ensure price is a number (float or integer)
   };
}


// GET - home page
app.get("/", (req, res) => {
   console.log("Call get method in root");
   res.sendFile(path.join(__dirname, "index.html"));
});

// GET - Retrieve all products
app.get("/products", (req, res) => {
   res.json(products);
});


// POST - Add a new product (ensures ID and price are numbers)
app.post("/products", (req, res) => {
   let product = sanitizeProduct(req.body);
   products.push(product);
   saveProducts(); // Save to disk
   console.log("POST request: Added product", product);
   res.status(201).json(product);
});


// PUT - Update an existing product (ensures ID and price are numbers)
app.put("/products/:id", (req, res) => {
   const id = parseInt(req.params.id);
   const updatedData = sanitizeProduct(req.body);
   let productFound = false;


   console.log("PUT request received for ID:", id, "updated data", updatedData);


   products = products.map(p => {
       if (p.id === id) {
           productFound = true;
           return { ...p, ...updatedData, id: p.id }; // Ensure ID stays the same
       }
       return p;
   });


   if (productFound) {
       saveProducts(); // Save changes to file
       res.json({ message: `Product with id ${id} updated.`, updatedData });
   } else {
       res.status(404).json({ error: "Product not found." });
   }
});


// DELETE - Remove a product (ensures ID is a number)
app.delete("/products/:id", (req, res) => {
   const id = parseInt(req.params.id);
   const initialLength = products.length;


   products = products.filter(p => p.id !== id);


   if (products.length < initialLength) {
       saveProducts(); // Save changes
       console.log("DELETE request: Removed product with ID", id);
       res.status(200).json({ message: `Product with id ${id} deleted.` });
   } else {
       res.status(404).json({ error: "Product not found." });
   }
});


// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
