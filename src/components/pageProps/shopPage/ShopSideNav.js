import React from "react";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";

const ShopSideNav = ({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePriceRange,
  priceBounds,
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <Price
        priceRange={priceRange}
        onChangePriceRange={onChangePriceRange}
        priceBounds={priceBounds}
      />
    </div>
  );
};

export default ShopSideNav;
