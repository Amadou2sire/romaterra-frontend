import { useEffect, useRef, useState } from "react";
import axiosInstance from "./axiosInstance";
import { normalizeProducts } from "./normalize";

// Session-level cache so navigating between Shop / Home / Details / Search
// doesn't refetch the whole catalog each time.
let productsCache = null;
let categoriesCache = null;
let collectionsCache = null;

const fetchProducts = async () => {
  if (productsCache) return productsCache;
  const { data } = await axiosInstance.get("/products");
  productsCache = normalizeProducts(data);
  return productsCache;
};

const fetchCategories = async () => {
  if (categoriesCache) return categoriesCache;
  const { data } = await axiosInstance.get("/categories");
  categoriesCache = Array.isArray(data) ? data : [];
  return categoriesCache;
};

const fetchCollections = async () => {
  if (collectionsCache) return collectionsCache;
  const { data } = await axiosInstance.get("/collections/");
  collectionsCache = Array.isArray(data) ? data : [];
  return collectionsCache;
};

// Allow manual invalidation (e.g. after creating a product).
export const invalidateProducts = () => { productsCache = null; };
export const invalidateCategories = () => { categoriesCache = null; };
export const invalidateCollections = () => { collectionsCache = null; };

// Flat shipping fee, configurable from the dashboard (/settings/shipping).
let shippingFeeCache = null;
const fetchShippingFee = async () => {
  if (shippingFeeCache !== null) return shippingFeeCache;
  const { data } = await axiosInstance.get("/settings/shipping");
  shippingFeeCache = Number(data.fee) || 0;
  return shippingFeeCache;
};

export const useShippingFee = () => {
  const [shippingFee, setShippingFee] = useState(shippingFeeCache ?? 0);
  const [shippingLoading, setShippingLoading] = useState(shippingFeeCache === null);

  useEffect(() => {
    let active = true;
    fetchShippingFee()
      .then((fee) => { if (active) setShippingFee(fee); })
      .catch(() => {})
      .finally(() => { if (active) setShippingLoading(false); });
    return () => { active = false; };
  }, []);

  return { shippingFee, shippingLoading };
};

export const useProducts = () => {
  const [products, setProducts] = useState(productsCache || []);
  const [loading, setLoading] = useState(!productsCache);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (active) {
          setProducts(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Failed to fetch products.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { products, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((data) => {
        if (active) {
          setCategories(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Failed to fetch categories.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { categories, loading, error };
};

export const useCollections = () => {
  const [collections, setCollections] = useState(collectionsCache || []);
  const [loading, setLoading] = useState(!collectionsCache);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchCollections()
      .then((data) => {
        if (active) {
          setCollections(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Failed to fetch collections.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { collections, loading, error };
};

// Fetch a single product by its _id. Used by ProductDetails when the user
// lands via a direct URL (no router state.item).
export const useProductById = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance
      .get(`/products/${id}`)
      .then(({ data }) => { if (active) { setProduct(data); setError(""); } })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Product not found.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return { product, loading, error };
};
