import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { removeFromWishlist } from "../../redux/orebiSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.orebiReducer.wishlist || []);

  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaHeart className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          <Link to="/shop" className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt={item.productName}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                  <FaHeart className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{item.productName}</h3>
                <p className="text-indigo-600 font-bold text-lg mb-4">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/product/${item.productName.toLowerCase().split(" ").join("")}`}
                    state={{ item: item }}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemove(item._id)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FaTrash className="w-5 h-5 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
