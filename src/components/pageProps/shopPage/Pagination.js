import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full">
            <Product
              _id={item._id}
              img={item.img}
              productName={item.productName}
              price={item.price}
              color={item.color}
              badge={item.badge}
              des={item.des}
              quantityInStock={item.quantityInStock}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ items, itemsPerPage, loading }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  // Reset to first page whenever the underlying list changes (e.g. category
  // filter switches), so we never end up on an out-of-range page.
  useEffect(() => {
    setItemOffset(0);
    setItemStart(1);
  }, [safeItems]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = safeItems.slice(itemOffset, endOffset);
  const pageCount = Math.max(1, Math.ceil(safeItems.length / itemsPerPage));

  // If a page beyond the range somehow lingers, bring it back.
  const activePage = itemOffset / itemsPerPage;
  const clampedOffset = activePage >= pageCount ? (pageCount - 1) * itemsPerPage : itemOffset;

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % safeItems.length;
    setItemOffset(newOffset);
    setItemStart(newOffset);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          forcePage={Math.min(activePage, pageCount - 1)}
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemStart === 0 ? 1 : itemStart + 1} to{" "}
          {endOffset > safeItems.length ? safeItems.length : endOffset} of{" "}
          {safeItems.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
