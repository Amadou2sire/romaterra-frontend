import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { getDisplayPrice } from "../../../api/normalize";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const productName = productInfo.name || productInfo.productName || "";
  const isPromo = productInfo.status === "Promo" && productInfo.promoPrice;
  const displayPrice = getDisplayPrice(productInfo);
  const outOfStock = productInfo.quantityInStock === 0;

  return (
    <div className="flex flex-col gap-5">
      {/* NAME */}
      <h2 className="text-4xl font-semibold text-black">{productName}</h2>

      {/* PRICE */}
      {isPromo ? (
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-black">
            {productInfo.promoPrice} DT
          </span>
          <span className="text-lg text-gray-400 line-through">
            {productInfo.price} DT
          </span>
          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-semibold">
            PROMO
          </span>
        </div>
      ) : (
        <p className="text-xl font-semibold text-black">{displayPrice} DT</p>
      )}

      {/* DESCRIPTION */}
      <p className="text-base text-gray-600">{productInfo.description}</p>

      {/* <p className="text-sm text-gray-500">Be the first to leave a review.</p> */}

      {/* SIZE (only if present) */}
      {productInfo.size && (
        <p className="font-medium text-lg text-black">
          <span className="font-normal">Size:</span> {productInfo.size}
        </p>
      )}

      {/* ADD TO CART */}
      <button
        disabled={outOfStock}
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo._id,
              name: productName,
              quantity: 1,
              image: Array.isArray(productInfo.images) ? productInfo.images[0] : productInfo.img,
              price: displayPrice,
            })
          )
        }
        className={`w-full py-4 rounded-md text-lg font-semibold transition duration-300
          ${
            outOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white"
          }`}
        style={!outOfStock ? { backgroundColor: "#A2664E" } : undefined}
        onMouseOver={(e) => {
          if (!outOfStock) e.currentTarget.style.backgroundColor = "#8E5743";
        }}
        onMouseOut={(e) => {
          if (!outOfStock) e.currentTarget.style.backgroundColor = "#A2664E";
        }}
      >
        {outOfStock ? "Out of stock" : "Add to Cart"}
      </button>

      {/* CATEGORY */}
      <p className="font-normal text-sm text-gray-600">
        <span className="text-base font-medium text-black">Categories:</span>{" "}
        {productInfo.category?.name || "Uncategorized"}
      </p>
    </div>
  );
};

export default ProductInfo;
