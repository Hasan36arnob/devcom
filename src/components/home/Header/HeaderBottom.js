import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt4, HiHeart } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { paginationItems } from "../../../constants";
import { addToWishlist } from "../../../redux/orebiSlice";

const HeaderBottom = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.orebiReducer?.products || []);
  const wishlistItems = useSelector((state) => state.orebiReducer?.wishlist || []);
  const adminProducts = useSelector((state) => state.adminReducer.products);
  const products = adminProducts.length > 0 ? adminProducts : paginationItems;
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = products.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 relative z-40 border-b border-gray-200">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div className="relative">
            <div
              onClick={() => setShow(!show)}
              ref={ref}
              className="flex h-14 cursor-pointer items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200 group"
            >
              <HiOutlineMenuAlt4 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <p className="text-[14px] font-medium font-titleFont group-hover:text-indigo-600">Shop by Category</p>
            </div>

            <AnimatePresence>
              {show && (
                <motion.ul
                  initial={{ y: 15, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 15, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl w-56 text-slate-600 h-auto p-2 overflow-hidden"
                >
                  {['Accessories', 'Furniture', 'Electronics', 'Clothes', 'Bags', 'Home appliances'].map((category) => (
                    <li key={category} className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {category}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative w-full lg:w-[600px] h-[52px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100/50 focus-within:shadow-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-gray-400 placeholder:text-[14px] text-gray-700"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search products, brands, categories..."
            />
            <button className="p-2 hover:bg-indigo-100 rounded-lg transition-colors duration-200">
              <FaSearch className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition-colors" />
            </button>
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full mx-auto h-96 bg-white top-14 absolute left-0 z-50 overflow-y-auto border border-gray-200 rounded-xl shadow-2xl scrollbar-hide cursor-pointer p-2 space-y-2"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          navigate(
                            `/product/${item.productName
                              .toLowerCase()
                              .split(" ")
                              .join("")}`,
                            {
                              state: {
                                item: item,
                              },
                            }
                          ) & setSearchQuery("")
                        }
                        key={item._id}
                        className="w-full h-24 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg p-3 flex items-center gap-4 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="relative">
                          <img className="w-16 h-16 object-cover rounded-lg bg-gray-100 border border-gray-200 group-hover:border-indigo-400 group-hover:shadow-md transition-all" src={item.img} alt="productImg" />
                          <div className="absolute inset-0 rounded-lg bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors"></div>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="font-semibold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">{item.description || item.des}</p>
                          <p className="text-xs font-medium text-slate-400">
                            Price:{" "}
                            <span className="text-indigo-600 font-bold">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => dispatch(addToWishlist(item))}
                            className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-gray-400 hover:text-indigo-600"
                          >
                            <FaRegHeart className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-16 text-center">
                      <FaSearch className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-slate-400 text-sm font-medium">No products found</p>
                      <p className="text-slate-300 text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 relative">
            <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 text-slate-600 hover:text-pink-600 transition-all duration-200 group">
              <HiHeart className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 font-titleFont text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-200">
                {wishlistItems.length}
              </span>
            </Link>
            <div 
              onClick={() => setShowUser(!showUser)} 
              className="relative flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors duration-200 p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 group"
            >
              <FaUser className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <FaCaretDown className={`w-3.5 h-3.5 transition-transform ${showUser ? 'rotate-180' : ''}`} />
            </div>
            <AnimatePresence>
              {showUser && (
                <motion.ul
                  initial={{ y: 15, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 15, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 -left-8 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl w-48 text-slate-600 h-auto p-2 overflow-hidden"
                >
                  <Link to="/signin" onClick={() => setShowUser(false)}>
                    <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Login
                    </li>
                  </Link>
                  <Link to="/signup" onClick={() => setShowUser(false)}>
                    <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Sign Up
                    </li>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Profile
                  </li>
                  <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-2">
                    <HiHeart className="w-4 h-4" />
                    Wishlist
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
            <Link to="/cart">
              <div className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 text-slate-600 hover:text-indigo-600 transition-all duration-200 group">
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 font-titleFont text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-200 animate-pulse">
                  {cartProducts.length > 0 ? cartProducts.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
