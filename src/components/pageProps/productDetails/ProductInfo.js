import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, addToWishlist } from "../../../redux/orebiSlice";
import { FaHeart } from "react-icons/fa";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">${productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>
      <p className="text-sm">Be the first to leave a review.</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Colors:</span> {productInfo.color}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() =>
            dispatch(
              addToCart({
                _id: productInfo.id,
                name: productInfo.productName,
                quantity: 1,
                image: productInfo.img,
                badge: productInfo.badge,
                price: productInfo.price,
                colors: productInfo.color,
              })
            )
          }
          className="flex-1 py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
        >
          Add to Cart
        </button>
        <button
          onClick={() =>
            dispatch(
              addToWishlist({
                _id: productInfo._id || productInfo.id,
                productName: productInfo.productName,
                price: productInfo.price,
                img: productInfo.img,
                des: productInfo.des,
                color: productInfo.color,
                badge: productInfo.badge,
              })
            )
          }
          className="px-6 py-4 border border-gray-300 hover:border-primeColor hover:text-primeColor duration-300 text-gray-600 text-lg font-titleFont flex items-center justify-center"
        >
          <FaHeart />
        </button>
      </div>
      <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> Spring
        collection, Streetwear, Women Tags: featured SKU: N/A
      </p>
    </div>
  );
};

export default ProductInfo;
