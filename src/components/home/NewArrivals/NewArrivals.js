import React, { useRef } from "react";
import Slider from "react-slick";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  arrow1,
  arrow2,
  arrow,
  bk,
  //bg,
} from "../../../assets/images";
import { addToCart } from "../../../redux/orebiSlice";
import { useProducts } from "../../../api/useApi";

const NewArrivals = () => {
  const sliderRef = useRef(null); // slider ref
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useProducts();

  // Newest first: 6 most recently created products.
  const items = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  const settings = {
    arrows: false, // disable built-in arrows
    infinite: items.length > 3,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.productName,
        quantity: 1,
        image: product.img,
        price: product.price,
      })
    );
  };

  const handleProductDetails = (product) => {
    navigate(`/product/${product._id}`, { state: { item: product } });
  };

  return (
    <section
      className="relative py-32 overflow-hidden bg-cover bg-center"
      //style={{ backgroundImage: `url(${bg})` }}
    >
      {/* ===== TITLE ===== */}
      <div className="flex justify-center mb-20 ">
        <svg viewBox="0 0 1400 300" className="w-full max-w-6xl">
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            stroke="#884B2C"
            strokeWidth="12"
            paintOrder="stroke fill"
            style={{ fontFamily: "'Style Script', cursive", fontSize: "180px" }}
          >
            New Products
          </text>
        </svg>
      </div>

      {/* ===== SLIDER WRAPPER ===== */}
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-10">
        {/* ===== BROWN RECTANGLE ===== */}
        <div className="relative bg-[#A2664E] rounded-[4rem] px-8 md:px-14 py-16 md:py-20">
          
          {/* ===== CUSTOM ARROWS INSIDE WRAPPER ===== */}
          <div
            className="absolute right-12 -top-16 z-30 cursor-pointer"
            onClick={() => sliderRef.current && sliderRef.current.slickNext()}
          >
            <img src={arrow1} alt="next" className="w-12 h-12" />
          </div>
          <div
            className="absolute right-24 -top-16 z-30 cursor-pointer"
            onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
          >
            <img src={arrow2} alt="prev" className="w-12 h-12" />
          </div>

          <Slider {...settings} ref={sliderRef}>
            {items.length === 0 ? (
              <div className="px-4">
                <p className="text-center text-white/90 py-20">
                  No new products yet.
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item._id || index} className="px-4">
                  <div
                    className="p-6 flex flex-col items-center text-center bg-cover bg-center rounded-[2.5rem] cursor-pointer group"
                    style={{ backgroundImage: `url(${bk})` }}
                  >
                    {/* IMAGE */}
                    <div
                      className="w-full h-[400px] rounded-2xl border-2 border-[#884B2C] overflow-hidden mb-6"
                      onClick={() => handleProductDetails(item)}
                    >
                      <img
                        src={item.img}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* NAME */}
                    <h3
                      className="text-xl font-semibold text-black"
                      onClick={() => handleProductDetails(item)}
                    >
                      {item.productName}
                    </h3>

                    {/* PRICE */}
                    <p className="mt-2 text-lg text-black font-medium">
                      {item.price} DT
                    </p>

                    {/* BUTTON */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="group mt-4 md:mt-5 flex items-center gap-2 md:gap-3 border-2 border-[#884B2C] px-4 md:px-20 py-2 rounded-lg text-[#884B2C] bg-transparent hover:bg-[#884B2C] hover:text-white transition whitespace-nowrap"
                    >
                      Add to cart
                      <span className="relative w-5 h-5 md:w-7 md:h-7">
                        <img
                          src={arrow1}
                          alt="arrow"
                          className="absolute inset-0 w-5 md:w-7 h-5 md:h-7 opacity-100 group-hover:opacity-0 transition-opacity"
                        />
                        <img
                          src={arrow}
                          alt="arrow hover"
                          className="absolute inset-0 w-5 md:w-7 h-5 md:h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
