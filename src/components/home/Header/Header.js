import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose, MdPerson } from "react-icons/md";
import { HiMenuAlt2, HiHeart } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", ResponsiveMenu);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`w-full h-16 md:h-20 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100" : "bg-white border-b border-gray-200"
    }`}>
      <nav className="h-full px-3 md:px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2 md:gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg md:text-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">D</span>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-titleFont group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-300 hidden sm:block">
                Devdigitax E-Commerce
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-purple-600 font-bold -mt-1 font-titleFont">
                 
              </span>
            </div>
          </Link>
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center w-auto z-50 p-0 gap-2"
              >
                <>
                  {navBarList.map(({ _id, title, link }) => (
                    <NavLink
                      key={_id}
                      className={({ isActive }) => 
                        `flex font-medium w-24 h-6 justify-center items-center text-base transition-all duration-300 md:border-r border-r-gray-200 last:border-r-0 hoverEffect relative ${
                          isActive 
                            ? "text-indigo-600 font-semibold" 
                            : "text-gray-600 hover:text-indigo-600"
                        }`
                      }
                      style={({ isActive }) => ({
                        borderBottom: isActive ? "2px solid" : "none",
                        borderBottomColor: isActive ? "rgb(79, 70, 229)" : "transparent",
                      })}
                      to={link}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>{title}</li>
                    </NavLink>
                  ))}
                </>
              </motion.ul>
            )}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-8 absolute top-4 right-3 text-indigo-600 hover:text-indigo-700 transition-colors hover:scale-110 transform p-1"
            />
            <AnimatePresence>
              {sidenav && (
                <div className="fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-sm z-50">
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-[85%] h-full relative"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-6">
                      <Link to="/" onClick={() => setSidenav(false)} className="flex items-center gap-2 group mb-6">
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold text-lg md:text-xl shadow-lg">
                          <span>D</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xl md:text-2xl tracking-tight text-white font-titleFont">
                            Devdigitax
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-semibold -mt-1 font-titleFont">
                          
                          </span>
                        </div>
                      </Link>
                      <ul className="text-white flex flex-col gap-2">
                        {navBarList.map((item) => (
                          <li key={item._id}>
                            <NavLink
                              to={item.link}
                              state={{ data: location.pathname.split("/")[1] }}
                              onClick={() => setSidenav(false)}
                              className={({ isActive }) => 
                                `block py-4 px-4 rounded-xl transition-all duration-200 text-base ${
                                  isActive 
                                    ? "bg-white/20 text-white font-semibold" 
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`
                              }
                            >
                              {item.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    <div className="mt-6">
                      <h1
                        onClick={() => setCategory(!category)}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-4 text-white font-semibold"
                      >
                        Shop by Category{" "}
                        <motion.span 
                          animate={{ rotate: category ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-lg"
                        >
                          ▼
                        </motion.span>
                      </h1>
                      <AnimatePresence>
                        {category && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm flex flex-col gap-1 overflow-hidden"
                          >
                            {['New Arrivals', 'Gadgets', 'Accessories', 'Electronics', 'Clothing'].map((cat) => (
                              <li key={cat} className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all">
                                {cat}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-6">
                      <h1
                        onClick={() => setBrand(!brand)}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-4 text-white font-semibold"
                      >
                        Shop by Brand
                        <motion.span 
                          animate={{ rotate: brand ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-lg"
                        >
                          ▼
                        </motion.span>
                      </h1>
                      <AnimatePresence>
                        {brand && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm flex flex-col gap-1 overflow-hidden"
                          >
                            {['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony'].map((brand) => (
                              <li key={brand} className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all">
                                {brand}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="absolute bottom-6 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-around text-white">
                          <div className="flex flex-col items-center gap-2">
                            <MdPerson className="w-6 h-6" />
                            <span className="text-xs font-medium">Account</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <HiHeart className="w-6 h-6" />
                            <span className="text-xs font-medium">Wishlist</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidenav(false)}
                    className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full absolute top-4 -right-16 text-white text-2xl flex justify-center items-center cursor-pointer hover:bg-white/30 transition-all duration-300 shadow-lg"
                  >
                    <MdClose />
                  </motion.button>
                </motion.div>
              </div>
              )}
            </AnimatePresence>
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
