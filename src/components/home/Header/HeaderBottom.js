import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProducts, useCategories, useCollections } from "../../../api/useApi";
import { cart, search } from "../../../assets/images";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const { products: allProducts } = useProducts();
  const { categories } = useCategories();
  const { collections: allCollections } = useCollections();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);

  // CLOSE CATEGORY MENU ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  // SEARCH HANDLER
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Enter dans l'input : navigue vers /shop?q=... pour voir tous les résultats.
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredProducts([]);
      setFilteredCollections([]);
      return;
    }
    // Products : match sur name + description + categoryName (insensible à la casse).
    const filtered = allProducts.filter((item) => {
      const name = (item.productName || "").toLowerCase();
      const desc = (item.des || "").toLowerCase();
      const cat = (item.categoryName || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
    setFilteredProducts(filtered);
    // Collections : match sur name + description.
    const filteredColl = allCollections.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
    setFilteredCollections(filteredColl);
  }, [searchQuery, allProducts, allCollections]);

  return (
    <div className="w-full bg-[#F3ECE1] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">

          {/* CATEGORY MENU */}
          <button
            type="button"
            ref={ref}
            onClick={() => setShow(!show)}
            className="flex h-14 cursor-pointer items-center gap-2 text-[#884B2C]"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute top-36 z-50 bg-white w-auto text-[#767676] p-4 pb-6 shadow-lg"
              >
                {(categories || []).map(({ _id, name }) => (
                  <li
                    key={_id}
                    onClick={() => {
                      navigate(`/shop`);
                      setShow(false);
                    }}
                    className="px-4 py-1 border-b border-gray-200 hover:text-[#884B2C] cursor-pointer"
                  >
                    {name}
                  </li>
                ))}
              </motion.ul>
            )}
          </button>

          {/* SEARCH + CART (SAME LINE ON MOBILE) */}
          <div className="flex w-full lg:w-auto items-center gap-3">

            {/* SEARCH */}
            <div className="relative flex-1 lg:w-[400px] h-[40px] bg-white flex items-center px-4 rounded-xl">
              <input
                className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
                type="text"
                onChange={handleSearch}
                onKeyDown={handleSearchKeyDown}
                value={searchQuery}
                placeholder="Search your products here"
              />

              <img
                src={search}
                alt="search"
                className="w-578 h-5 opacity-70"
              />

              {searchQuery && (
                <div className="absolute top-14 left-0 w-full max-h-96 bg-white z-50 overflow-y-scroll shadow-xl">
                  {/* COLLECTIONS SECTION */}
                  {filteredCollections.length > 0 && (
                    <div>
                      <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[#884B2C] bg-[#F4E5C8]/40">
                        Collections
                      </div>
                      {filteredCollections.slice(0, 4).map((c) => (
                        <button
                          type="button"
                          key={c._id}
                          onClick={() => {
                            navigate(`/shop?collection=${c._id}`);
                            setSearchQuery("");
                          }}
                          className="flex w-full items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer text-left border-b border-gray-100"
                        >
                          <img
                            src={
                              typeof c.image === "string" && c.image.startsWith("http")
                                ? c.image
                                : "https://via.placeholder.com/64?text=Collection"
                            }
                            alt={c.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/64?text=Collection";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{c.name}</p>
                            {c.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {c.description}
                              </p>
                            )}
                            <p className="text-xs text-[#884B2C] mt-0.5">
                              Collection →
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* PRODUCTS SECTION */}
                  <div>
                    {filteredCollections.length > 0 && filteredProducts.length > 0 && (
                      <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[#884B2C] bg-[#F4E5C8]/40">
                        Products
                      </div>
                    )}
                    {filteredProducts.length === 0 && filteredCollections.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        No results for “{searchQuery}”.
                      </div>
                    ) : (
                      filteredProducts.slice(0, 8).map((item) => (
                        <button
                          type="button"
                          key={item._id}
                          onClick={() => {
                            navigate(`/product/${item._id}`, { state: { item } });
                            setSearchQuery("");
                          }}
                          className="flex w-full items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer text-left"
                        >
                          <img
                            src={item.img}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/64?text=?";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{item.productName}</p>
                            {item.categoryName && (
                              <p className="text-xs text-gray-500 truncate">
                                {item.categoryName}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">DT {item.price}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CART */}
            <Link to="/cart">
              <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-sm">

                <img
                  src={cart}
                  alt="cart"
                  className="w-9 h-9"
                />

                <span className="absolute -top-1 -right-1 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-[#884B2C] text-white">
                  {products.length}
                </span>
              </div>
            </Link>

          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
