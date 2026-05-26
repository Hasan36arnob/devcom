import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { AnalyticsService } from "../../services/analyticsService";

const Dashboard = () => {
  const { stats, products, orders, expenses } = useSelector((state) => state.adminReducer);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);

  useEffect(() => {
    const loadDashboardStats = () => {
      const stats = AnalyticsService.getDashboardStats();
      setDashboardStats(stats);

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const profitLossReport = AnalyticsService.getProfitLossReport(
        startOfMonth.toISOString(),
        today.toISOString()
      );
      setProfitLoss(profitLossReport);

      const customerReport = AnalyticsService.getCustomerReport(
        startOfMonth.toISOString(),
        today.toISOString()
      );
      setCustomerStats(customerReport);
    };

    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [orders, expenses]);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
      trend: "+8%",
    },
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toFixed(2)} BDT`,
      icon: DollarSign,
      color: "bg-purple-500",
      trend: "+23%",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: AlertCircle,
      color: "bg-orange-500",
      trend: "Action needed",
    },
  ];

  const additionalStats = [
    {
      title: "Today's Revenue",
      value: dashboardStats ? `${dashboardStats.todayRevenue.toFixed(2)} BDT` : '0 BDT',
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Month Revenue",
      value: dashboardStats ? `${dashboardStats.monthRevenue.toFixed(2)} BDT` : '0 BDT',
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: customerStats ? customerStats.totalCustomers : 0,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Net Profit",
      value: profitLoss ? `${profitLoss.netProfit.toFixed(2)} BDT` : '0 BDT',
      icon: profitLoss?.isProfitable ? ArrowUp : ArrowDown,
      color: profitLoss?.isProfitable ? "bg-green-500" : "bg-red-500",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-600">{order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.total.toFixed(2)} BDT
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Products
            </h2>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products yet</p>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={product.img}
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {product.price} BDT
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Analytics Summary
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-semibold text-gray-900">
                {profitLoss ? `${profitLoss.profitMargin.toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-semibold text-gray-900">
                {customerStats ? `${customerStats.customerRetentionRate.toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat Customers</span>
              <span className="font-semibold text-gray-900">
                {customerStats?.repeatCustomers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Low Stock Items</span>
              <span className="font-semibold text-orange-600">
                {dashboardStats?.lowStockProducts || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Orders</span>
              <span className="font-semibold text-blue-600">
                {dashboardStats?.processingOrders || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
