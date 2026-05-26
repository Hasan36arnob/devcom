import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useSelector } from "react-redux";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const { products } = useSelector((state) => state.adminReducer);

  const displayProducts = products.length > 0 ? products.slice(0, 8) : [];

  // Only enable infinite if there are more products than the current slidesToShow
  const canInfinite = (slidesToShow) => displayProducts.length > slidesToShow;

  const settings = {
    infinite: canInfinite(4),
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: canInfinite(4),
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dots: false, // Changed from true to false to remove the vertical numbers list
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: canInfinite(4),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: canInfinite(3),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: canInfinite(2),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: canInfinite(1),
        },
      },
    ],
  };

  return (
    <div className="w-full pb-24 bg-gradient-to-b from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="max-w-container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Heading heading="New Arrivals" />
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Discover our latest premium collection
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Premium Collection
            </span>
          </div>
        </div>

        {/* Slider or Empty State */}
        {displayProducts.length > 0 ? (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-3xl -z-10"></div>
            <Slider {...settings}>
              {displayProducts.map((item) => (
                <div key={item._id} className="px-2">
                  <Product
                    _id={item._id}
                    img={item.img}
                    productName={item.productName}
                    price={item.price}
                    color={item.color || "Mixed"}
                    badge={item.badge || false}
                    des={item.description || "Premium quality product"}
                  />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6 shadow-xl">
              <svg
                className="w-16 h-16 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              No Products Available
            </h3>
            <p className="text-gray-500 font-medium">
              Check back later for new arrivals
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;