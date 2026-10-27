// Adapter between the backend Product shape and the shape the existing
// frontend components expect (Product card, sliders, search...).
//
// Backend product:
//   { _id, name, description, price, images:[String], quantityInStock,
//     status, size, promoPrice, category:{name,...}, collection:{...},
//     createdAt, updatedAt }
//
// Frontend card props:
//   { _id, img, productName, price, color, badge, des }
//
// normalizeProduct returns BOTH the card-friendly fields AND the raw backend
// fields needed elsewhere (checkout, ProductDetails gallery, stock checks).

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";

export const getDisplayPrice = (product) => {
  if (!product) return 0;
  if (product.status === "Promo" && product.promoPrice) return product.promoPrice;
  return product.price ?? 0;
};

export const normalizeProduct = (product) => {
  if (!product) return null;
  const images = Array.isArray(product.images) ? product.images : [];
  const img = images[0] || PLACEHOLDER_IMAGE;

  return {
    // Card-friendly fields
    _id: product._id,
    img,
    productName: product.name || "",
    price: getDisplayPrice(product),
    color: "", // no color field on the backend
    badge: product.status === "Promo",
    des: product.description || "",

    // Extra fields components need
    images,
    status: product.status,
    size: product.size,
    promoPrice: product.promoPrice,
    basePrice: product.price,
    quantityInStock: product.quantityInStock,
    categoryName: product.category?.name || "",
    collectionName: product.collection?.name || "",
    createdAt: product.createdAt,

    // Keep the raw object for ProductDetails / any advanced use
    raw: product,
  };
};

export const normalizeProducts = (products) =>
  Array.isArray(products) ? products.map(normalizeProduct).filter(Boolean) : [];
