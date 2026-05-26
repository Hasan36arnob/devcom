import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const SpecialOffers = () => {
  const { products } = useSelector((state) => state.adminReducer);
  const displayProducts = products.length > 0 ? products.slice(4, 8) : [];
  
  return (
    <div className="w-full pb-24 bg-gradient-to-b from-pink-50 via-white to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-red-500/5"></div>
      <div className="max-w-container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Heading heading="Special Offers" />
            <p className="text-sm text-gray-500 mt-2 font-medium">Exclusive deals just for you</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full shadow-lg shadow-pink-500/30"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Limited Time</span>
          </div>
        </div>
        {displayProducts.length > 0 ? (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 blur-3xl rounded-3xl"></div>
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
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 mb-6 shadow-xl">
              <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">No Special Offers</h3>
            <p className="text-gray-500 font-medium">Add products from the admin panel to see special offers here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialOffers;
