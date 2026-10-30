import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import axiosInstance from "../../api/axiosInstance";
import { useShippingFee } from "../../api/useApi";
import { trackEvent, CURRENCY } from "../../analytics/metaPixel";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.orebiReducer.products);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Replicate Cart.js totals logic so the customer sees the same amount.
  const totalAmt = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const { shippingFee } = useShippingFee();
  const grandTotal = totalAmt + shippingFee;

  // Meta Pixel: checkout page opened with a non-empty cart.
  useEffect(() => {
    if (cart.length === 0) return;
    trackEvent("InitiateCheckout", {
      content_ids: cart.map((item) => item._id),
      content_type: "product",
      num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
      value: totalAmt,
      currency: CURRENCY,
    });
    // Once per visit of the page, not on every cart change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.customerName.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim()))
      return "Please enter a valid email.";
    if (form.customerPhone.trim().length < 6)
      return "Please enter a valid phone number.";
    if (form.shippingAddress.trim().length < 5)
      return "Please enter a shipping address (min 5 characters).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Backend recomputes the total server-side; we only send ids + quantities.
      const body = {
        items: cart.map((it) => ({ product: it._id, quantity: it.quantity })),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
      };
      const { data: order } = await axiosInstance.post("/orders", body);
      // Use the server total (price recomputed + shipping) and the order id
      // as eventID so Meta can deduplicate if a server-side event is added later.
      trackEvent(
        "Purchase",
        {
          content_ids: cart.map((item) => item._id),
          content_type: "product",
          num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
          value: Number(order?.totalAmount ?? grandTotal),
          currency: CURRENCY,
        },
        order?._id ? { eventID: String(order._id) } : undefined
      );
      dispatch(resetCart());
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to place your order. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Success screen ---
  if (success) {
    return (
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Order confirmed" />
        <div className="pb-20 pt-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#884B2C] mb-3">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 max-w-md mb-6">
            Merci {form.customerName.split(" ")[0]}. Nous avons bien reçu votre
            commande et vous contacterons pour la livraison (paiement à la
            livraison).
          </p>
          <Link to="/">
            <button className="px-8 py-3 rounded-md bg-[#A2664E] text-white font-semibold hover:opacity-90 transition">
              Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- Empty cart ---
  if (cart.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Checkout" />
        <div className="pb-20 pt-10 flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold mb-3">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">
            Ajoutez des produits avant de passer commande.
          </p>
          <Link to="/shop">
            <button className="px-8 py-3 rounded-md border-2 border-[#884B2C] text-[#884B2C] font-semibold hover:bg-[#884B2C] hover:text-white transition">
              Voir les produits
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- Checkout form ---
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Checkout" />
      <div className="pb-20">
        <h1
          className="text-3xl font-semibold text-[#884B2C] my-6"
          style={{ fontFamily: "'Style Script', cursive" }}
        >
          Paiement à la livraison
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ORDER SUMMARY */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 text-sm text-gray-700 grid grid-cols-12 px-4 py-3 font-semibold">
                <span className="col-span-6">Produit</span>
                <span className="col-span-2 text-center">Qté</span>
                <span className="col-span-2 text-center">Prix</span>
                <span className="col-span-2 text-right">Sous-total</span>
              </div>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-12 px-4 py-3 text-sm border-t items-center"
                >
                  <span className="col-span-6 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    {item.name}
                  </span>
                  <span className="col-span-2 text-center">{item.quantity}</span>
                  <span className="col-span-2 text-center">{item.price} DT</span>
                  <span className="col-span-2 text-right font-semibold">
                    {item.price * item.quantity} DT
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border rounded-lg p-4">
              <p className="flex justify-between py-1 text-gray-700">
                <span>Sous-total</span>
                <span className="font-semibold">{totalAmt} DT</span>
              </p>
              <p className="flex justify-between py-1 text-gray-700">
                <span>Livraison</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? "Gratuite" : `${shippingFee} DT`}
                </span>
              </p>
              <p className="flex justify-between py-2 border-t mt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-[#884B2C]">{grandTotal} DT</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Le montant final est recalculé côté serveur à la confirmation.
              </p>
            </div>
          </div>

          {/* CUSTOMER FORM */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Vos informations de livraison
            </h2>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border rounded-md outline-none focus:border-[#A2664E]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="jean.dupont@example.com"
                  className="w-full px-4 py-3 border rounded-md outline-none focus:border-[#A2664E]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  placeholder="+216 12 345 678"
                  className="w-full px-4 py-3 border rounded-md outline-none focus:border-[#A2664E]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Adresse de livraison
                </label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Rue, ville, code postal..."
                  className="w-full px-4 py-3 border rounded-md outline-none focus:border-[#A2664E]"
                />
              </div>

              <div className="bg-[#F5F7F7] border border-[#F4E5C8] rounded-md p-3 text-sm text-gray-700">
                💵 Paiement <strong>cash à la livraison</strong> — réglez en
                espèces à la réception de votre commande.
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Retour au panier
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-md text-white font-semibold transition
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#A2664E] hover:opacity-90"}`}
                >
                  {loading ? "Confirmation..." : "Confirmer la commande"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
