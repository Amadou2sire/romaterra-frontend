import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import { useProducts, useCategories, useCollections } from "../../api/useApi";
import axiosInstance from "../../api/axiosInstance";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filtres déclenchés par query params :
  //   ?collection=<id>  → depuis "Our Collections" sur la home
  //   ?q=<text>         → depuis la search bar (Enter)
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection");
  const searchQuery = (searchParams.get("q") || "").trim();

  const { products, loading, error } = useProducts();
  const { categories } = useCategories();
  const { collections: allCollections } = useCollections();

  // Détail de la collection (pour le breadcrumb + titre).
  const [collection, setCollection] = useState(null);
  useEffect(() => {
    if (!collectionId) {
      setCollection(null);
      return;
    }
    let active = true;
    axiosInstance
      .get(`/collections/${collectionId}`)
      .then(({ data }) => { if (active) setCollection(data); })
      .catch(() => { if (active) setCollection(null); });
    return () => { active = false; };
  }, [collectionId]);

  // Bornes min/max calculées sur le catalogue complet (pour les sliders).
  // On les calcule une fois que products arrive, puis on initialise le range.
  const priceBounds = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [0, 1000];
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of products) {
      const price = Number(p.price);
      if (!Number.isNaN(price)) {
        if (price < lo) lo = price;
        if (price > hi) hi = price;
      }
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1000];
    // Plancher à 0, plafond arrondi à la dizaine supérieure pour le slider.
    return [Math.max(0, Math.floor(lo)), Math.ceil(hi / 10) * 10];
  }, [products]);

  // À l'arrivée des produits, on réinitialise le range sur les bornes calculées.
  useEffect(() => {
    setPriceRange(priceBounds);
  }, [priceBounds]);

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  // Filtres combinés : catégorie + collection (si collectionId) + prix + recherche texte.
  const filteredItems = useMemo(() => {
    let items = products;
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.categoryName === selectedCategory);
    }
    if (collectionId) {
      // On garde les produits dont l'_id est dans la liste collection.products.
      // Si la collection n'est pas encore chargée, on n'exclut rien.
      const productIds = new Set(
        Array.isArray(collection?.products)
          ? collection.products.map((p) => (p && p._id) || p)
          : [],
      );
      if (productIds.size > 0) {
        items = items.filter((p) => productIds.has(p._id));
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) => {
        const name = (p.productName || "").toLowerCase();
        const desc = (p.des || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }
    // Filtre prix.
    const [lo, hi] = priceRange;
    if (lo > priceBounds[0] || hi < priceBounds[1]) {
      items = items.filter((p) => {
        const price = Number(p.price);
        if (Number.isNaN(price)) return true;
        return price >= lo && price <= hi;
      });
    }
    return items;
  }, [products, selectedCategory, collectionId, collection, searchQuery, priceRange, priceBounds]);

  const breadcrumbTitle = collection
    ? collection.name
    : searchQuery
      ? `Search: "${searchQuery}"`
      : "Products";

  // Collections matchantes (uniquement quand on est en mode recherche sans collection ciblée).
  // On les dérive de allCollections (déjà cache côté useApi).
  const matchedCollections = useMemo(() => {
    if (!searchQuery || collectionId) return [];
    const q = searchQuery.toLowerCase();
    return allCollections.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [searchQuery, collectionId, allCollections]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title={breadcrumbTitle} titleClassName="leading-[2]" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            priceBounds={priceBounds}
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {collection && (
            <div className="rounded-md border border-[#F4E5C8] bg-[#F4E5C8]/30 px-4 py-3 text-sm text-[#884B2C]">
              Showing products in <strong>{collection.name}</strong>
            </div>
          )}
          {searchQuery && (
            <div className="rounded-md border border-[#F4E5C8] bg-[#F4E5C8]/30 px-4 py-3 text-sm text-[#884B2C]">
              Search results for <strong>“{searchQuery}”</strong>
              <span className="ml-2 text-xs text-[#884B2C]/70">
                ({filteredItems.length} product{filteredItems.length > 1 ? "s" : ""}
                {matchedCollections.length > 0 &&
                  `, ${matchedCollections.length} collection${matchedCollections.length > 1 ? "s" : ""}`}
                )
              </span>
            </div>
          )}
          {matchedCollections.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedCollections.slice(0, 3).map((c) => (
                <Link
                  key={c._id}
                  to={`/shop?collection=${c._id}`}
                  className="group block"
                >
                  <div className="relative h-40 overflow-hidden rounded-xl border border-[#F4E5C8] bg-white">
                    <img
                      src={
                        typeof c.image === "string" && c.image.startsWith("http")
                          ? c.image
                          : "https://via.placeholder.com/600x400?text=Collection"
                      }
                      alt={c.name || "Collection"}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=Collection";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-white/80">Collection →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Pagination
            items={filteredItems}
            itemsPerPage={itemsPerPage}
            loading={loading}
          />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
