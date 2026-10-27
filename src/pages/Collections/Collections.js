import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axiosInstance from "../../api/axiosInstance";

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    axiosInstance
      .get("/collections/")
      .then(({ data }) => {
        if (active) setCollections(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || "Failed to fetch collections.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredCollections = useMemo(() => {
    const search = normalize(query.trim());
    if (!search) return collections;
    return collections.filter((collection) =>
      normalize(`${collection.name} ${collection.description}`).includes(search),
    );
  }, [collections, query]);

  const resolveImage = (image) =>
    typeof image === "string" && image.startsWith("http")
      ? image
      : "https://via.placeholder.com/800x600?text=RomaTerra";

  return (
    <div className="min-h-screen w-full bg-[#FBF7ED] text-[#33271f]">
      <div className="px-4 py-1 md:px-16">
        <Breadcrumbs title="Collections" prevLocation="Home" />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 border-b border-[#884B2C]/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9b6a4f]">
              RomaTerra · Handmade ceramics
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-[#33271f] sm:text-4xl">
              Our Collections
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#74695f] sm:text-base">
              Explore pieces brought together by their material, inspiration and character.
            </p>
          </div>

          {/* <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search collections</span>
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#887b70]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search collections"
              className="h-11 w-full border border-[#d8cec4] bg-white pl-10 pr-3 text-sm text-[#33271f] outline-none transition placeholder:text-[#a49a92] focus:border-[#884B2C] focus:ring-2 focus:ring-[#884B2C]/10"
            />
          </label> */}
        </header>

        <div className="mb-4 flex items-center justify-between text-xs text-[#81766e]">
          <span>
            {loading ? "Loading collections..." : `${filteredCollections.length} ${filteredCollections.length === 1 ? "collection" : "collections"}`}
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-semibold text-[#884B2C] underline underline-offset-4"
            >
              Clear search
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border border-[#e9c8bc] bg-[#fff7f3] px-4 py-3 text-sm text-[#8a4934]">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse border border-[#e7dfd5] bg-white">
                <div className="aspect-[4/3] bg-[#ece5dc]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 bg-[#ece5dc]" />
                  <div className="h-3 w-full bg-[#f1ece5]" />
                  <div className="h-3 w-4/5 bg-[#f1ece5]" />
                </div>
              </div>
            ))}
          </div>
        ) : !error && filteredCollections.length === 0 ? (
          <div className="border-y border-[#e7dfd5] py-16 text-center">
            <p className="text-base font-medium text-[#4d4037]">
              {collections.length === 0 ? "No collections yet." : "No collections match your search."}
            </p>
            <p className="mt-2 text-sm text-[#81766e]">
              {collections.length === 0
                ? "Our next collection will appear here."
                : "Try another name or clear your search."}
            </p>
          </div>
        ) : !error ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredCollections.map((collection) => {
              const productCount = Array.isArray(collection.products)
                ? collection.products.length
                : 0;

              return (
                <Link
                  key={collection._id}
                  to={`/shop?collection=${collection._id}`}
                  className="group flex h-full flex-col overflow-hidden border border-[#e7dfd5] bg-white transition-colors hover:border-[#b58d74] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884B2C]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#eee8e1]">
                    <img
                      src={resolveImage(collection.image)}
                      alt={collection.name || "RomaTerra collection"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      onError={(event) => {
                        event.currentTarget.src = "https://via.placeholder.com/800x600?text=RomaTerra";
                      }}
                    />
                    <span className="absolute left-3 top-3 bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#884B2C]">
                      {productCount} {productCount === 1 ? "piece" : "pieces"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 text-lg font-semibold leading-snug text-[#33271f] group-hover:text-[#884B2C]">
                        {collection.name || "Untitled collection"}
                      </h2>
                      <FiArrowUpRight className="mt-1 shrink-0 text-[#884B2C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
                    </div>
                    {collection.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#74695f]">
                        {collection.description}
                      </p>
                    )}
                    <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wide text-[#884B2C]">
                      Explore collection
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Collections;