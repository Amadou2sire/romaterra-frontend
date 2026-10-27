import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowUpRight, FiMapPin, FiPhone } from "react-icons/fi";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import contact from "../../assets/images/contact.png";

const Contact = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("Home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const details = [
      "Bonjour RomaTerra,",
      "",
      `Nom : ${name}`,
      `Email : ${email}`,
      `Sujet : ${subject}`,
      "",
      message,
    ].join("\n");

    window.location.href = `https://wa.me/21695715400?text=${encodeURIComponent(details)}`;
  };

  return (
    <div className="relative w-full bg-[#FBF7ED]">
      <div className="px-4 py-1 md:px-16">
        <Breadcrumbs
          title="Contact"
          prevLocation={prevLocation}
          className="text-sm text-[#884B2C]"
        />
      </div>

      <section
        className="relative isolate overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${contact})` }}
      >
        <div className="absolute inset-0 -z-10 bg-[#FBF7ED]/65" />
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:py-16">
          <div className="max-w-lg">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b6a4f]">
              RomaTerra Ceramics · Moknine, Tunisia
            </p>
            <h1
              className="mb-5 text-5xl leading-tight text-[#884B2C] sm:text-6xl"
              style={{ fontFamily: "'Style Script', cursive" }}
            >
              Let’s talk
            </h1>
            <p className="max-w-md text-base leading-7 text-[#382c25] sm:text-lg sm:leading-8">
              Questions about a piece, an order, or a custom creation? Send us a note. We’d love to hear what you have in mind.
            </p>

            <div className="mt-8 space-y-4 border-t border-[#884B2C]/25 pt-6 text-sm text-[#49372d] sm:text-base">
              <a href="tel:+21695715400" className="flex items-center gap-3 transition hover:text-[#884B2C]">
                <FiPhone className="shrink-0 text-[#884B2C]" size={18} />
                +216 95 715 400
              </a>
              <p className="flex items-center gap-3">
                <FiMapPin className="shrink-0 text-[#884B2C]" size={18} />
                Moknine, Tunisia
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full rounded-md border border-[#884B2C]/20 bg-white/95 p-5 shadow-[0_18px_55px_rgba(68,45,29,0.12)] sm:p-8 lg:p-10"
          >
            <div className="mb-7 border-b border-[#ece4dc] pb-5">
              <h2 className="text-xl font-semibold text-[#302820] sm:text-2xl">Send a message</h2>
              <p className="mt-1 text-sm text-[#81766e]">We’ll continue the conversation with you directly.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#44362d]">
                Full name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded border border-[#d8cec4] bg-[#fdfcf9] px-3 text-base font-normal text-[#302820] outline-none transition placeholder:text-[#a49a92] focus:border-[#884B2C] focus:ring-2 focus:ring-[#884B2C]/10"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#44362d]">
                Email address
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded border border-[#d8cec4] bg-[#fdfcf9] px-3 text-base font-normal text-[#302820] outline-none transition placeholder:text-[#a49a92] focus:border-[#884B2C] focus:ring-2 focus:ring-[#884B2C]/10"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#44362d] sm:col-span-2">
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="What can we help you with?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-12 rounded border border-[#d8cec4] bg-[#fdfcf9] px-3 text-base font-normal text-[#302820] outline-none transition placeholder:text-[#a49a92] focus:border-[#884B2C] focus:ring-2 focus:ring-[#884B2C]/10"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#44362d] sm:col-span-2">
                Message
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell us a little more..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-36 resize-y rounded border border-[#d8cec4] bg-[#fdfcf9] px-3 py-3 text-base font-normal leading-6 text-[#302820] outline-none transition placeholder:text-[#a49a92] focus:border-[#884B2C] focus:ring-2 focus:ring-[#884B2C]/10"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#884B2C] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#6f3c24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884B2C] sm:w-auto"
            >
              Continue in WhatsApp
              <FiArrowUpRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;