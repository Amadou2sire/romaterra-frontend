import React from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { Link } from "react-router-dom";

const Category = ({ categories = [], selectedCategory, onSelectCategory }) => {
  // Always offer an "All" option, then the real categories from the API.
  const items = [{ _id: "all", name: "All" }, ...categories];

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {items.map(({ _id, name }) => {
            const active = (selectedCategory || "All") === name;
            return (
              <li
                key={_id}
                onClick={() => onSelectCategory?.(name)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300 ${
                  active ? "text-primeColor font-semibold" : ""
                }`}
              >
                {name}
                <ImPlus className="text-[10px] lg:text-xs text-gray-400" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Category;
