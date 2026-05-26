import React from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);

  const navigate = useNavigate();
  const productItem = props;
  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: productItem,
      },
    });
  };

  return (
    <div className="w-full relative group">
      {/* Image Box */}
      <div className="w-full aspect-square relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
        <div className="relative w-full h-full">
          <Image className="w-full h-full object-cover" imgSrc={props.img} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          {props.badge && <Badge text="New" />}
        </div>

        {/* Heart Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
          <div className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-white transition-colors cursor-pointer">
            <BsSuitHeartFill className="w-5 h-5 text-gray-400 hover:text-pink-500 transition-colors" />
          </div>
        </div>

        {/* Hover Action Menu */}
        <div className="w-full h-36 absolute bg-white/95 backdrop-blur-md -bottom-[140px] group-hover:bottom-0 duration-500 rounded-b-2xl shadow-2xl">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-3 font-titleFont px-4">
            <li className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center justify-end gap-2 hover:cursor-pointer transition-all duration-300 w-full hover:translate-x-1">
              Compare
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg text-white">
                <GiReturnArrow />
              </span>
            </li>
            <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: props._id,
                    name: props.productName,
                    quantity: 1,
                    image: props.img,
                    badge: props.badge,
                    price: props.price,
                    colors: props.color,
                  })
                )
              }
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center justify-end gap-2 hover:cursor-pointer transition-all duration-300 w-full hover:translate-x-1"
            >
              Add to Cart
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg text-white">
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center justify-end gap-2 hover:cursor-pointer transition-all duration-300 w-full hover:translate-x-1"
            >
              View Details
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg text-white text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Info Box */}
      <div className="w-full py-4 flex flex-col gap-2 px-3 bg-gradient-to-br from-white to-gray-50 rounded-b-2xl border border-t-0 border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-500">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate pr-2">
            {props.productName}
          </h2>
          <p className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            ${typeof props.price === "number" ? props.price.toFixed(2) : props.price}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium truncate">{props.color}</p>
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-600 font-semibold">In Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;