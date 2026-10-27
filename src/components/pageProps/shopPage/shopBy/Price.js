import React from "react";
import NavTitle from "./NavTitle";

// Filtre prix dynamique basé sur le min/max des produits chargés.
// On reçoit priceBounds (min, max) et priceRange ([currentMin, currentMax]).
// Deux range sliders synchronisés.
const Price = ({ priceRange, onChangePriceRange, priceBounds }) => {
  const [min, max] = priceBounds || [0, 1000];
  const [currentMin, currentMax] = priceRange || [min, max];

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), currentMax);
    onChangePriceRange([v, currentMax]);
  };
  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), currentMin);
    onChangePriceRange([currentMin, v]);
  };

  return (
    <div>
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-[#767676]">
          <span>{currentMin} DT</span>
          <span>{currentMax} DT</span>
        </div>

        {/* Slider MIN */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={currentMin}
          onChange={handleMin}
          className="w-full accent-[#884B2C]"
          aria-label="Minimum price"
        />
        {/* Slider MAX */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={currentMax}
          onChange={handleMax}
          className="w-full accent-[#884B2C]"
          aria-label="Maximum price"
        />

        <button
          type="button"
          onClick={() => onChangePriceRange([min, max])}
          className="self-start text-xs text-[#767676] underline hover:text-[#884B2C]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Price;
