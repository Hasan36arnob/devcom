import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
  bannerImgOne,
  bannerImgTwo,
} from "../../assets/images";
import Image from "../designLayouts/Image";

const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="w-full bg-white">
      <Slider {...settings}>
        <Link to="/offer">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image imgSrc={bannerImgOne} className="w-full h-full object-cover" />
          </div>
        </Link>
        <Link to="/offer">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image imgSrc={bannerImgTwo} className="w-full h-full object-cover" />
          </div>
        </Link>
        <Link to="/offer">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image imgSrc={bannerImgTwo} className="w-full h-full object-cover" />
          </div>
        </Link>
      </Slider>
    </div>
  );
};

export default Banner;
