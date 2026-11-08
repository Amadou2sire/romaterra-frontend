import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingBag } from "react-icons/fi";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useProducts } from "../../api/useApi";
import { addToCart } from "../../redux/orebiSlice";

const Offer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const offers = products.filter((product) => product.status === "Promo");

  const openProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { item: product } });
  };

  return (
    <div className="w-full bg-[#FBF7ED]">
      <div className="px-4 py-1 md:px-16">
        <Breadcrumbs title="Special Offers" prevLocation="Home" />
      </div>

      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-8 border-b border-[#884B2C]/20 pb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6a4f]">
            RomaTerra selection
          </p>
          <h1 className="text-3xl font-semibold text-[#33271f] sm:text-4xl">
            Special Offers
          </h1>
          <p className="mt-2 text-sm text-[#74695f]">
            Discover every piece currently on promotion.
          </p>
        </header>

        {loading ? (
          <p className="py-16 text-center text-sm text-[#74695f]">Loading offers...</p>
        ) : error ? (
          <p role="alert" className="py-16 text-center text-sm text-[#8a4934]">{error}</p>
        ) : offers.length === 0 ? (
          <p className="border-y border-[#e8dfd4] py-16 text-center text-sm text-[#74695f]">
            There are no products on offer right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((product) => {
              const outOfStock = product.quantityInStock === 0;
              const originalPrice = Number(product.basePrice ?? product.raw?.price ?? product.price);
              const promoPrice = Number(product.price);
              const hasDiscount = originalPrice > promoPrice;

              return (
                <article key={product._id} className="overflow-hidden border border-[#e7dfd5] bg-white">
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    className="group relative block aspect-square w-full overflow-hidden bg-[#f2eee7]"
                    aria-label={`View ${product.productName}`}
                  >
                    <img
                      src={product.img}
                      alt={product.productName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#884B2C]">
                      Promo
                    </span>
                    {outOfStock && (
                      <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-xs font-medium text-[#5e5750]">
                        Out of stock
                      </span>
                    )}
                  </button>

                  <div className="p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="block w-full truncate text-left text-base font-semibold text-[#33271f] hover:text-[#884B2C]"
                    >
                      {product.productName}
                    </button>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="flex flex-wrap items-baseline gap-2 text-sm">
                        <span className="font-semibold text-[#884B2C]">{promoPrice} DT</span>
                        {hasDiscount && (
                          <span className="text-[#93867b] line-through">{originalPrice} DT</span>
                        )}
                      </p>
                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() =>
                          dispatch(
                            addToCart({
                              _id: product._id,
                              name: product.productName,
                              quantity: 1,
                              image: product.img,
                              price: promoPrice,
                            }),
                          )
                        }
                        aria-label={outOfStock ? "Out of stock" : `Add ${product.productName} to cart`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#884B2C] text-[#884B2C] transition hover:bg-[#884B2C] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                      >
                        <FiShoppingBag size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Offer;
