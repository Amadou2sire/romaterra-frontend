import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Route by the real MongoDB _id (not the slugified name).
  const handleDetails = () => {
    navigate(`/product/${props._id}`, {
      state: { item: props },
    });
  };

  const outOfStock = props.quantityInStock === 0;

  return (
    <div className="w-full max-w-[280px] mx-auto">

      {/* IMAGE */}
      <div
        className="relative w-full aspect-square overflow-hidden rounded-md border border-[#F4E5C8] cursor-pointer group"
        onClick={handleDetails}
      >
        <Image
          className="w-full h-full object-cover"
          imgSrc={props.img}
          alt={props.productName}
        />

        {/* BADGE */}
        {props.badge && (
          <div className="absolute top-3 left-3">
            <Badge text="New" />
          </div>
        )}

        {/* OUT OF STOCK */}
        {outOfStock && (
          <div className="absolute top-3 right-3 bg-[#F4E5C8]/90 border border-[#F4E5C8] px-2 py-1 rounded">
            <span className="text-[#884B2C] text-xs font-semibold">
              Out of stock
            </span>
          </div>
        )}

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white text-sm font-semibold tracking-wide">
            View details
          </span>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-4 text-center">
        <h2 className="text-base font-semibold text-black">
          {props.productName}
        </h2>
        <p className="text-sm text-black mt-1">
          {props.price} DT
        </p>
      </div>

      {/* ADD TO CART */}
      <button
        disabled={outOfStock}
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
        className={`group mt-4 flex items-center justify-center gap-2 mx-auto
                   px-10 py-2 rounded-md border text-sm font-medium transition
                   ${
                     outOfStock
                       ? "border-gray-300 text-gray-400 cursor-not-allowed"
                       : "border-[#884B2C] text-[#884B2C] hover:bg-[#A2664E] hover:text-white"
                   }`}
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
};

export default Product;
