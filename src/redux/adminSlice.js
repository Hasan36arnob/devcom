import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  adminCredentials: {
    username: process.env.REACT_APP_ADMIN_USERNAME || "admin",
    password: process.env.REACT_APP_ADMIN_PASSWORD || "",
  },
  products: [
    {
      _id: "1",
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      productName: "Premium Wireless Headphones",
      price: 299.99,
      category: "electronics",
      description: "High-fidelity wireless headphones with noise cancellation and premium sound quality",
      stock: 50,
      rating: 5,
      color: "Black",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      productName: "Luxury Smart Watch",
      price: 449.99,
      category: "electronics",
      description: "Premium smartwatch with health tracking, GPS, and stunning display",
      stock: 100,
      rating: 5,
      color: "Silver",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      productName: "Designer Running Shoes",
      price: 189.99,
      category: "men's clothing",
      description: "Premium athletic shoes with advanced cushioning and breathable design",
      stock: 75,
      rating: 4,
      color: "Red",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "4",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      productName: "Professional Camera Lens",
      price: 899.99,
      category: "electronics",
      description: "High-performance camera lens for professional photography",
      stock: 30,
      rating: 5,
      color: "Black",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "5",
      img: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
      productName: "Designer Leather Bag",
      price: 349.99,
      category: "women's clothing",
      description: "Elegant leather handbag with premium craftsmanship",
      stock: 45,
      rating: 4,
      color: "Brown",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "6",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      productName: "Premium Wireless Earbuds",
      price: 199.99,
      category: "electronics",
      description: "Crystal clear wireless earbuds with active noise cancellation",
      stock: 120,
      rating: 5,
      color: "White",
      badge: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "7",
      img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      productName: "Modern Polaroid Camera",
      price: 149.99,
      category: "electronics",
      description: "Retro-style instant camera with modern features",
      stock: 60,
      rating: 4,
      color: "Rainbow",
      badge: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "8",
      img: "https://images.unsplash.com/photo-1491553895911-0055uj?w=800&q=80",
      productName: "Classic Sunglasses",
      price: 129.99,
      category: "accessories",
      description: "Timeless designer sunglasses with UV protection",
      stock: 80,
      rating: 4,
      color: "Black",
      badge: true,
      createdAt: new Date().toISOString(),
    },

    // Seed: Classic Sunglasses (images from the internet)
    {
      _id: "SUN001",
      productName: "Classic Aviator Sunglasses",
      price: 39.99,
      category: "accessories",
      description: "Timeless aviator style with UV protection.",
      stock: 35,
      rating: 4.6,
      img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      createdAt: new Date().toISOString(),
      color: "Brown",
      badge: true,
    },
    {
      _id: "SUN002",
      productName: "Classic Round Sunglasses",
      price: 34.5,
      category: "accessories",
      description: "Retro round frames for everyday street style.",
      stock: 22,
      rating: 4.4,
      img: "https://images.unsplash.com/photo-1520975958225-2a5a8b0eaa7b?w=800&q=80",
      createdAt: new Date().toISOString(),
      color: "Black",
      badge: true,
    },
    {
      _id: "SUN003",
      productName: "Classic Wayfarer Sunglasses",
      price: 29.0,
      category: "accessories",
      description: "Bold wayfarer silhouette with crisp lens clarity.",
      stock: 40,
      rating: 4.5,
      img: "https://images.unsplash.com/photo-1511499767150-2f6ed4a0a2c4?w=800&q=80",
      createdAt: new Date().toISOString(),
      color: "Tortoise",
      badge: true,
    },
  ],
  categories: [
    { id: "cat1", name: "men's clothing", subcategories: ["Shirts", "Pants", "Jackets", "Accessories"] },
    { id: "cat2", name: "women's clothing", subcategories: ["Dresses", "Tops", "Skirts", "Accessories"] },
    { id: "cat3", name: "jewelery", subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings"] },
    { id: "cat4", name: "electronics", subcategories: ["Phones", "Laptops", "Headphones", "Cameras"] },
  ],
  orders: [
    {
      _id: "ORD001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+8801700000000",
      customerAddress: "Dhaka, Bangladesh",
      billingAddress: "Dhaka, Bangladesh",
      items: [
        {
          _id: "1",
          productName: "Fjallraven - Foldsack No. 1 Backpack",
          price: 109.95,
          quantity: 2,
        },
      ],
      subtotal: 219.9,
      shippingCost: 60,
      discount: 0,
      tax: 0,
      total: 279.9,
      status: "pending",
      paymentMethod: "COD",
      paymentStatus: "Pending",
      paymentGateway: null,
      transactionId: null,
      courier: "steadfast",
      trackingNumber: null,
      invoiceNumber: null,
      isComplete: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "ORD002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+8801800000000",
      customerAddress: "Chittagong, Bangladesh",
      billingAddress: "Chittagong, Bangladesh",
      items: [
        {
          _id: "2",
          productName: "Mens Casual Premium Slim Fit T-Shirts",
          price: 22.3,
          quantity: 3,
        },
      ],
      subtotal: 66.9,
      shippingCost: 120,
      discount: 0,
      tax: 0,
      total: 186.9,
      status: "shipped",
      paymentMethod: "bkash",
      paymentStatus: "Paid",
      paymentGateway: "bkash",
      transactionId: "TXN123456",
      courier: "redx",
      trackingNumber: "REDX123456",
      invoiceNumber: "INV-20240101-0001",
      isComplete: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: "ORD003",
      customerName: "Incomplete Order",
      customerEmail: "incomplete@example.com",
      customerPhone: "+8801900000000",
      customerAddress: "Sylhet, Bangladesh",
      billingAddress: "Sylhet, Bangladesh",
      items: [
        {
          _id: "3",
          productName: "Sample Product",
          price: 100,
          quantity: 1,
        },
      ],
      subtotal: 100,
      shippingCost: 0,
      discount: 0,
      tax: 0,
      total: 100,
      status: "incomplete",
      paymentMethod: null,
      paymentStatus: "Pending",
      paymentGateway: null,
      transactionId: null,
      courier: null,
      trackingNumber: null,
      invoiceNumber: null,
      isComplete: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  coupons: [],
  expenses: [],
  users: [
    {
      id: "admin1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      fullName: "Super Admin",
      phone: "+8801700000000",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  stats: {
    totalProducts: 8,
    totalOrders: 2,
    totalRevenue: 286.8,
    pendingOrders: 1,
    shippedOrders: 1,
  },
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;
      if (
        username === state.adminCredentials.username &&
        password === state.adminCredentials.password
      ) {
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        _id: Date.now().toString(),
        rating: 0,
        createdAt: new Date().toISOString(),
      };
      state.products.push(newProduct);
      state.stats.totalProducts = state.products.length;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
      state.stats.totalProducts = state.products.length;
    },
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c !== action.payload
      );
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = status;
        if (status === "delivered") {
          state.stats.totalRevenue += order.total;
        }
      }
      state.stats.pendingOrders = state.orders.filter(
        (o) => o.status === "pending"
      ).length;
      state.stats.shippedOrders = state.orders.filter(
        (o) => o.status === "shipped"
      ).length;
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter((o) => o._id !== action.payload);
      state.stats.totalOrders = state.orders.length;
    },
    addCoupon: (state, action) => {
      const newCoupon = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.coupons.push(newCoupon);
    },
    updateCoupon: (state, action) => {
      const index = state.coupons.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.coupons[index] = { ...state.coupons[index], ...action.payload };
      }
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((c) => c.id !== action.payload);
    },
    addExpense: (state, action) => {
      const newExpense = {
        id: Date.now().toString(),
        ...action.payload,
        date: action.payload.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      state.expenses.push(newExpense);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    addUser: (state, action) => {
      const newUser = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    addSubcategory: (state, action) => {
      const { categoryId, subcategory } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category && !category.subcategories.includes(subcategory)) {
        category.subcategories.push(subcategory);
      }
    },
    removeSubcategory: (state, action) => {
      const { categoryId, subcategory } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.subcategories = category.subcategories.filter((s) => s !== subcategory);
      }
    },
    updateProductStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find((p) => p._id === productId);
      if (product) {
        product.stock = quantity;
      }
    },
  },
});

export const {
  login,
  logout,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  updateOrderStatus,
  deleteOrder,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  addExpense,
  deleteExpense,
  addUser,
  updateUser,
  deleteUser,
  addSubcategory,
  removeSubcategory,
  updateProductStock,
} = adminSlice.actions;

export default adminSlice.reducer;
