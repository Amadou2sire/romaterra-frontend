import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../api/useApi";
import Product from "./Product";

const Products = () => {
  const { products, loading, error } = useProducts();
  // Show top 8 newest
  const items = Array.isArray(products)
    ? [...products]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8)
    : [];

  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-[#884B2C]">Our Products</h2>
          <Link to="/shop" className="text-[#884B2C] hover:underline">
            See all products
          </Link>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading products…</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((p) => (
              <Product key={p._id} {...p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
