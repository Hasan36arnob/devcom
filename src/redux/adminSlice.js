import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  products: [],
  categories: [
    { id: "cat1", name: "men's clothing", subcategories: ["Shirts", "Pants", "Jackets", "Accessories"] },
    { id: "cat2", name: "women's clothing", subcategories: ["Dresses", "Tops", "Skirts", "Accessories"] },
    { id: "cat3", name: "jewelery", subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings"] },
    { id: "cat4", name: "electronics", subcategories: ["Phones", "Laptops", "Headphones", "Cameras"] },
  ],
  orders: [],
  coupons: [],
  expenses: [],
  users: [],
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
  },
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token || null;
      state.user = action.payload.user || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.stats.totalProducts = action.payload.length;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
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
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.stats.totalOrders = action.payload.length;
      state.stats.pendingOrders = action.payload.filter(o => o.status === 'pending').length;
      state.stats.shippedOrders = action.payload.filter(o => o.status === 'shipped').length;
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
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    addCoupon: (state, action) => {
      state.coupons.push(action.payload);
    },
    updateCoupon: (state, action) => {
      const index = state.coupons.findIndex((c) => c._id === action.payload._id || c.id === action.payload.id);
      if (index !== -1) {
        state.coupons[index] = { ...state.coupons[index], ...action.payload };
      }
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((c) => c._id !== action.payload && c.id !== action.payload);
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e._id !== action.payload && e.id !== action.payload);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id || u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload && u.id !== action.payload);
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
  setAuth,
  logout,
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  setOrders,
  updateOrderStatus,
  deleteOrder,
  setCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  setExpenses,
  addExpense,
  deleteExpense,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  addSubcategory,
  removeSubcategory,
  updateProductStock,
} = adminSlice.actions;

export default adminSlice.reducer;
