import React, { useRef } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useProducts } from "../../../api/useApi";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiShoppingBag } from "react-icons/fi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SpecialOffers = () => {
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useProducts();

  // Products flagged "Promo" first; fallback to the latest products so the
  // block never renders empty when no promo exists yet.
  const promoItems = products.filter((p) => p.status === "Promo");
  const items = (promoItems.length > 0 ? promoItems : [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  ).slice(0, 12);

  const settings = {
    arrows: false,
    infinite: items.length > 6,
    speed: 450,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const goToDetails = (product) => {
    navigate(`/product/${product._id}`, { state: { item: product } });
  };

  return (
    <section className="w-full bg-[#FBF7ED] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6a4f]">
              RomaTerra selection
            </p>
            <h2 className="text-2xl font-semibold text-[#33271f] sm:text-3xl">
              Special Offers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/offer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#884B2C] transition hover:text-[#5f321f]"
            >
              See all special offers <FiArrowUpRight size={16} />
            </Link>
            {items.length > 1 && (
              <div className="hidden items-center gap-1 sm:flex">
                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickPrev()}
                  aria-label="Previous products"
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#d8cfc5] text-[#6c5142] transition hover:border-[#884B2C] hover:text-[#884B2C]"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickNext()}
                  aria-label="Next products"
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#d8cfc5] text-[#6c5142] transition hover:border-[#884B2C] hover:text-[#884B2C]"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </header>

        {items.length === 0 ? (
          <p className="border-y border-[#e8dfd4] py-10 text-center text-sm text-[#74695f]">
            No products available yet.
          </p>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {items.map((item, index) => {
              const out = item.quantityInStock === 0;
              return (
                <div key={item._id || index} className="h-full px-2 pb-2">
                  <article className="h-full overflow-hidden border border-[#e7dfd5] bg-white">
                    <button
                      type="button"
                      onClick={() => goToDetails(item)}
                      className="group relative block aspect-square w-full overflow-hidden bg-[#f2eee7]"
                      aria-label={`View ${item.productName}`}
                    >
                      <img
                        src={item.img}
                        alt={item.productName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      {item.status === "Promo" && (
                        <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#884B2C]">
                          Promo
                        </span>
                      )}
                      {out && (
                        <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-xs font-medium text-[#5e5750]">
                          Out of stock
                        </span>
                      )}
                    </button>

                    <div className="p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => goToDetails(item)}
                        className="block w-full truncate text-left text-base font-semibold text-[#33271f] hover:text-[#884B2C]"
                      >
                        {item.productName}
                      </button>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-sm text-[#5f5147]">{item.price} DT</p>
                        <button
                          type="button"
                          disabled={out}
                          onClick={() =>
                            dispatch(
                              addToCart({
                                _id: item._id,
                                name: item.productName,
                                quantity: 1,
                                image: item.img,
                                price: item.price,
                              }),
                            )
                          }
                          aria-label={out ? "Out of stock" : `Add ${item.productName} to cart`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#884B2C] text-[#884B2C] transition hover:bg-[#884B2C] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                        >
                          <FiShoppingBag size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </Slider>
        )}

        {items.length > 1 && (
          <div className="mt-3 flex justify-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous products"
              className="flex h-9 w-9 items-center justify-center rounded border border-[#d8cfc5] text-[#6c5142]"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next products"
              className="flex h-9 w-9 items-center justify-center rounded border border-[#d8cfc5] text-[#6c5142]"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
