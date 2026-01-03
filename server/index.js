const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory database (for demo purposes)
let products = [
  // Electronics - Laptops
  { id: '1', name: 'MacBook Pro 16" M3', price: 2499.99, originalPrice: 2799.99, description: 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.8, reviews: 1245, delivery: 'Free delivery', inStock: true },
  { id: '2', name: 'Dell XPS 15 Laptop', price: 1599.99, originalPrice: 1899.99, description: '15.6" 4K OLED Display, Intel i7, 16GB RAM, 1TB SSD', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.6, reviews: 892, delivery: 'Free delivery', inStock: true },
  { id: '3', name: 'HP Pavilion Gaming', price: 899.99, originalPrice: 1099.99, description: 'Gaming Laptop, RTX 3050, AMD Ryzen 7, 16GB RAM', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.4, reviews: 567, delivery: 'Free delivery', inStock: true },
  
  // Electronics - Smartphones
  { id: '4', name: 'iPhone 15 Pro Max', price: 1199.99, originalPrice: 1299.99, description: '256GB, Titanium, A17 Pro chip, 48MP camera', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.9, reviews: 2341, delivery: 'Free delivery', inStock: true },
  { id: '5', name: 'Samsung Galaxy S24 Ultra', price: 1099.99, originalPrice: 1199.99, description: '256GB, 200MP Camera, S Pen, 5G', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.7, reviews: 1876, delivery: 'Free delivery', inStock: true },
  { id: '6', name: 'OnePlus 12', price: 799.99, originalPrice: 899.99, description: '256GB, Snapdragon 8 Gen 3, 50MP Camera', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.5, reviews: 654, delivery: 'Free delivery', inStock: true },
  
  // Electronics - Headphones
  { id: '7', name: 'Sony WH-1000XM5', price: 399.99, originalPrice: 449.99, description: 'Wireless Noise Cancelling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.8, reviews: 3421, delivery: 'Free delivery', inStock: true },
  { id: '8', name: 'AirPods Pro 2', price: 249.99, originalPrice: 279.99, description: 'Active Noise Cancellation, Spatial Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.7, reviews: 2890, delivery: 'Free delivery', inStock: true },
  { id: '9', name: 'Bose QuietComfort 45', price: 329.99, originalPrice: 379.99, description: 'Noise Cancelling Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.6, reviews: 1234, delivery: 'Free delivery', inStock: true },
  
  // Electronics - Cameras
  { id: '10', name: 'Canon EOS R6 Mark II', price: 2499.99, originalPrice: 2799.99, description: '24.2MP Full-Frame Mirrorless Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.9, reviews: 456, delivery: 'Free delivery', inStock: true },
  { id: '11', name: 'Sony A7 IV', price: 2499.99, originalPrice: 2699.99, description: '33MP Full-Frame Mirrorless Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.8, reviews: 678, delivery: 'Free delivery', inStock: true },
  { id: '12', name: 'Nikon Z6 III', price: 2199.99, originalPrice: 2399.99, description: '24.5MP Full-Frame Mirrorless Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.7, reviews: 345, delivery: 'Free delivery', inStock: true },
  
  // Accessories - Watches
  { id: '13', name: 'Apple Watch Series 9', price: 399.99, originalPrice: 449.99, description: '45mm GPS, Aluminum Case, Sport Band', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.8, reviews: 4567, delivery: 'Free delivery', inStock: true },
  { id: '14', name: 'Samsung Galaxy Watch 6', price: 299.99, originalPrice: 349.99, description: '44mm, Bluetooth, Health Tracking', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.6, reviews: 2341, delivery: 'Free delivery', inStock: true },
  { id: '15', name: 'Fitbit Sense 2', price: 299.99, originalPrice: 329.99, description: 'Advanced Health & Fitness Smartwatch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.5, reviews: 1890, delivery: 'Free delivery', inStock: true },
  
  // Accessories - Bags
  { id: '16', name: 'Travel Backpack 40L', price: 89.99, originalPrice: 119.99, description: 'Waterproof, USB Charging Port, Laptop Compartment', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.6, reviews: 1234, delivery: 'Free delivery', inStock: true },
  { id: '17', name: 'Leather Messenger Bag', price: 149.99, originalPrice: 199.99, description: 'Genuine Leather, Laptop Sleeve, Multiple Pockets', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.7, reviews: 567, delivery: 'Free delivery', inStock: true },
  { id: '18', name: 'Gym Duffle Bag', price: 49.99, originalPrice: 69.99, description: 'Large Capacity, Shoe Compartment, Water Resistant', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', category: 'Accessories', rating: 4.4, reviews: 890, delivery: 'Free delivery', inStock: true },
  
  // Home & Kitchen
  { id: '19', name: 'Smart TV 55" 4K', price: 599.99, originalPrice: 799.99, description: '55" 4K UHD Smart TV, HDR, Android TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', category: 'Home', rating: 4.7, reviews: 3456, delivery: 'Free delivery', inStock: true },
  { id: '20', name: 'Air Fryer 6QT', price: 99.99, originalPrice: 149.99, description: 'Digital Display, 1700W, Non-Stick Basket', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop', category: 'Home', rating: 4.6, reviews: 2345, delivery: 'Free delivery', inStock: true },
  { id: '21', name: 'Robot Vacuum Cleaner', price: 299.99, originalPrice: 399.99, description: 'WiFi, App Control, Auto-Charge, Mapping', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', category: 'Home', rating: 4.5, reviews: 1789, delivery: 'Free delivery', inStock: true },
  
  // Fashion
  { id: '22', name: 'Men\'s Running Shoes', price: 129.99, originalPrice: 179.99, description: 'Lightweight, Breathable, Cushioned Sole', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', category: 'Fashion', rating: 4.6, reviews: 3456, delivery: 'Free delivery', inStock: true },
  { id: '23', name: 'Women\'s Handbag', price: 79.99, originalPrice: 119.99, description: 'Leather, Multiple Compartments, Crossbody', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop', category: 'Fashion', rating: 4.5, reviews: 2341, delivery: 'Free delivery', inStock: true },
  { id: '24', name: 'Wireless Mouse', price: 29.99, originalPrice: 49.99, description: 'Ergonomic, 2.4GHz, 1600 DPI, Long Battery', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop', category: 'Electronics', rating: 4.4, reviews: 5678, delivery: 'Free delivery', inStock: true }
];

let cart = [];
let orders = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  // Sort products
  if (sort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  
  res.json(filteredProducts);
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Add product to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const cartItem = {
    id: uuidv4(),
    productId,
    product: product,
    quantity: quantity || 1
  };

  cart.push(cartItem);
  res.json(cartItem);
});

// Get cart
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  cart = cart.filter(item => item.id !== req.params.id);
  res.json({ message: 'Item removed from cart' });
});

// Create order
app.post('/api/orders', (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const order = {
    id: uuidv4(),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  cart = []; // Clear cart
  res.json(order);
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Start server
app.listen(PORT, () => {
  console.log(`E-commerce server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

