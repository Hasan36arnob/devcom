import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const BestSellers = () => {
  const { products } = useSelector((state) => state.adminReducer);
  const displayProducts = products.length > 0 ? products.slice(0, 4) : [];
  
  return (
    <div className="w-full pb-24 bg-gradient-to-b from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-pink-500/5"></div>
      <div className="max-w-container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Heading heading="Our Bestsellers" />
            <p className="text-sm text-gray-500 mt-2 font-medium">Most loved by our customers</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-500/30"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Top Rated</span>
          </div>
        </div>
        {displayProducts.length > 0 ? (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 blur-3xl rounded-3xl"></div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
              {displayProducts.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Product
                    _id={item._id}
                    img={item.img}
                    productName={item.productName}
                    price={item.price}
                    color={item.color || "Mixed"}
                    badge={item.badge || false}
                    des={item.description || "Premium quality product"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-6 shadow-xl">
              <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">No Products Available</h3>
            <p className="text-gray-500 font-medium">Add products from the admin panel to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
