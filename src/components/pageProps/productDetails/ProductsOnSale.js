import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../api/useApi";

const ProductsOnSale = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  // Show promo products (fallback: 4 newest if none flagged Promo).
  const promo = products.filter((p) => p.status === "Promo");
  const items = promo.length > 0 ? promo : [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products on sale
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/product/${item._id}`, { state: { item } })}
            className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2 cursor-pointer hover:bg-gray-50"
          >
            <div>
              <img className="w-24" src={item.img} alt={item.productName} />
            </div>
            <div className="flex flex-col gap-2 font-titleFont">
              <p className="text-base font-medium">{item.productName}</p>
              <p className="text-sm font-semibold">DT {item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
