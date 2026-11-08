import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import { useProductById } from "../../api/useApi";

const ProductDetails = () => {
  const location = useLocation();
  const { _id } = useParams();
  const [prevLocation, setPrevLocation] = useState("/");

  // If we arrived via in-app navigation, state.item holds the product already
  // (object from the API, normalized or raw). Otherwise fetch by _id from the
  // API. The state.item passed from the card is already the backend product
  // (normalizeProduct keeps the raw object under .raw, but cards from the shop
  // grid pass normalized props — so we accept either shape here).
  // Only trust the full backend product (normalizeProduct exposes .raw).
  // The Shop card passes individual props (no .raw) → we re-fetch by _id.
  // A direct URL lands with no state.item → we fetch by _id too.
  const passedItem = location.state?.item;
  const initialProduct = passedItem?.raw || null;

  const { product: fetchedProduct, loading, error } = useProductById(
    initialProduct ? null : _id
  );

  const productInfo = initialProduct || fetchedProduct || {};

  useEffect(() => {
    setPrevLocation(location.pathname);
  }, [location]);

  // Prefer the multi-image gallery; fall back to a single image.
  const images = Array.isArray(productInfo.images) && productInfo.images.length > 0
    ? productInfo.images
    : productInfo.img
      ? [productInfo.img]
      : [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const firstImage = images[0] || "";

  useEffect(() => {
    setActiveImageIndex(0);
  }, [productInfo._id, firstImage]);

  const activeImage = images[activeImageIndex] || firstImage;
  const productName = productInfo.name || productInfo.productName || "";

  return (
    <div className="w-full mx-auto border-b border-gray-300">
      <div className="max-w-container mx-auto px-4">

        {/* BREADCRUMB */}
        <div>
          <Breadcrumbs
            title={productName}
            prevLocation={prevLocation}
            titleClassName="leading-[2]"
          />
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-500">Loading product...</div>
        ) : error ? (
          <div className="p-20 text-center text-gray-500">{error}</div>
        ) : (
          /* PRODUCT CARD */
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-8 pb-12 rounded-lg
                       bg-white border-2"
            style={{ borderColor: "#884B2C" }}
          >

            {/* IMAGE GALLERY */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200 bg-[#faf9f6]">
                <img
                  src={activeImage}
                  alt={productName}
                  className="w-full h-full object-contain bg-white"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((index) => (index - 1 + images.length) % images.length)}
                      aria-label="Image précédente"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#884B2C] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#884B2C]"
                    >
                      <FiChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((index) => (index + 1) % images.length)}
                      aria-label="Image suivante"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#884B2C] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#884B2C]"
                    >
                      <FiChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Images du produit">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Afficher ${productName}, image ${index + 1}`}
                      aria-pressed={activeImageIndex === index}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white transition sm:h-24 sm:w-24
                        ${
                          activeImageIndex === index
                            ? "border-[#884B2C] ring-1 ring-[#884B2C]"
                            : "border-gray-300 hover:border-[#884B2C]"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${productName} ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col justify-center gap-6">
              <ProductInfo productInfo={productInfo} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
