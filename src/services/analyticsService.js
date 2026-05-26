// Analytics and Reports Service

export const AnalyticsService = {
  getSalesReport: (startDate, endDate) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Sales by day
    const salesByDay = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      salesByDay[date] = (salesByDay[date] || 0) + order.total;
    });

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByDay,
      orders: filteredOrders,
    };
  },

  getRevenueReport: (startDate, endDate) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered');
    const revenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    
    const pendingRevenue = filteredOrders
      .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      revenue,
      pendingRevenue,
      totalPotentialRevenue: revenue + pendingRevenue,
      deliveredOrdersCount: deliveredOrders.length,
    };
  },

  getExpenseReport: (startDate, endDate) => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Expenses by category
    const expensesByCategory = {};
    filteredExpenses.forEach(expense => {
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    return {
      totalExpenses,
      expensesByCategory,
      expenses: filteredExpenses,
    };
  },

  getProfitLossReport: (startDate, endDate) => {
    const revenueReport = AnalyticsService.getRevenueReport(startDate, endDate);
    const expenseReport = AnalyticsService.getExpenseReport(startDate, endDate);

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
  },

  getCustomerReport: (startDate, endDate) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    // Unique customers
    const uniqueCustomers = new Set(filteredOrders.map(order => order.customerEmail));
    const totalCustomers = uniqueCustomers.size;

    // Repeat customers
    const customerOrderCounts = {};
    filteredOrders.forEach(order => {
      customerOrderCounts[order.customerEmail] = (customerOrderCounts[order.customerEmail] || 0) + 1;
    });
    
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

    // Customer lifetime value
    const customerSpending = {};
    filteredOrders.forEach(order => {
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
  },

  getProductReport: (startDate, endDate) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    // Product sales
    const productSales = {};
    filteredOrders.forEach(order => {
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
  },

  getDashboardStats: () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
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
  },

  addExpense: (expenseData) => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return newExpense;
  },

  getExpenses: () => {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
  },

  deleteExpense: (expenseId) => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const filtered = expenses.filter(e => e.id !== expenseId);
    localStorage.setItem('expenses', JSON.stringify(filtered));
  },
};
