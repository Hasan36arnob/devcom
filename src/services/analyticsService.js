// Analytics and Reports Service
import { api } from '../utils/apiHelper';

export const AnalyticsService = {
  getSalesReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
      const orders = response.orders;

      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Sales by day
      const salesByDay = {};
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        salesByDay[date] = (salesByDay[date] || 0) + order.total;
      });

      return {
        totalSales,
        totalOrders,
        averageOrderValue,
        salesByDay,
        orders,
      };
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  },

  getRevenueReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
      const orders = response.orders;

      const deliveredOrders = orders.filter(order => order.status === 'delivered');
      const revenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
      
      const pendingRevenue = orders
        .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

      return {
        revenue,
        pendingRevenue,
        totalPotentialRevenue: revenue + pendingRevenue,
        deliveredOrdersCount: deliveredOrders.length,
      };
    } catch (error) {
      console.error('Get revenue report error:', error);
      throw error;
    }
  },

  getExpenseReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/expenses?startDate=${startDate}&endDate=${endDate}`);
      
      const totalExpenses = response.totalAmount;
      
      // Expenses by category
      const expensesByCategory = {};
      response.expenses.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
      });

      return {
        totalExpenses,
        expensesByCategory,
        expenses: response.expenses,
      };
    } catch (error) {
      console.error('Get expense report error:', error);
      throw error;
    }
  },

  getProfitLossReport: async (startDate, endDate) => {
    try {
      const revenueReport = await AnalyticsService.getRevenueReport(startDate, endDate);
      const expenseReport = await AnalyticsService.getExpenseReport(startDate, endDate);

      const grossProfit = revenueReport.revenue;
      const netProfit = grossProfit - expenseReport.totalExpenses;
      const profitMargin = grossProfit > 0 ? (netProfit / grossProfit) * 100 : 0;

      return {
        grossProfit,
        totalExpenses: expenseReport.totalExpenses,
        netProfit,
        profitMargin,
        isProfitable: netProfit >= 0,
      };
    } catch (error) {
      console.error('Get profit loss report error:', error);
      throw error;
    }
  },

  getCustomerReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
      const orders = response.orders;

      // Unique customers
      const uniqueCustomers = new Set(orders.map(order => order.customerEmail));
      const totalCustomers = uniqueCustomers.size;

      // Repeat customers
      const customerOrderCounts = {};
      orders.forEach(order => {
        customerOrderCounts[order.customerEmail] = (customerOrderCounts[order.customerEmail] || 0) + 1;
      });
      
      const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

      // Customer lifetime value
      const customerSpending = {};
      orders.forEach(order => {
        customerSpending[order.customerEmail] = (customerSpending[order.customerEmail] || 0) + order.total;
      });
      
      const averageCustomerValue = Object.values(customerSpending).reduce((a, b) => a + b, 0) / totalCustomers;

      return {
        totalCustomers,
        repeatCustomers,
        newCustomers: totalCustomers - repeatCustomers,
        averageCustomerValue,
        customerRetentionRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
      };
    } catch (error) {
      console.error('Get customer report error:', error);
      throw error;
    }
  },

  getProductReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
      const orders = response.orders;

      // Product sales
      const productSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          productSales[item._id] = {
            productName: item.productName,
            quantity: (productSales[item._id]?.quantity || 0) + item.quantity,
            revenue: (productSales[item._id]?.revenue || 0) + (item.price * item.quantity),
          };
        });
      });

      // Top selling products
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      return {
        productSales,
        topProducts,
        totalProductsSold: Object.values(productSales).reduce((sum, p) => sum + p.quantity, 0),
      };
    } catch (error) {
      console.error('Get product report error:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const [ordersResponse, productsResponse] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
      ]);
      
      const orders = ordersResponse.orders;
      const products = productsResponse.products;
      
      const todayOrders = orders.filter(order => new Date(order.createdAt) >= startOfToday);
      const monthOrders = orders.filter(order => new Date(order.createdAt) >= startOfMonth);
      
      const todayRevenue = todayOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);
      
      const monthRevenue = monthOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const processingOrders = orders.filter(order => order.status === 'processing').length;
      const shippedOrders = orders.filter(order => order.status === 'shipped').length;

      const lowStockProducts = products.filter(product => product.stock < 10).length;

      return {
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        monthOrders: monthOrders.length,
        todayRevenue,
        monthRevenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        totalProducts: products.length,
        lowStockProducts,
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  addExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.expense;
    } catch (error) {
      console.error('Add expense error:', error);
      throw error;
    }
  },

  getExpenses: async () => {
    try {
      const response = await api.get('/expenses');
      return response.expenses;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      await api.delete(`/expenses?id=${expenseId}`);
      return true;
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  },
};
