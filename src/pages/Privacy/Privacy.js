import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const LAST_UPDATED = "October 30, 2026";

const sections = [
  {
    title: "Who we are",
    body: (
      <p>
        RomaTerra is a handmade ceramics workshop based in Moknine, Tunisia. We are
        responsible for the personal data collected through this website
        (romaterra.tn). You can reach us by phone at{" "}
        <a href="tel:+21695715400" className="text-[#884B2C] underline">
          +216 95 715 400
        </a>{" "}
        or through our <Link to="/contact" className="text-[#884B2C] underline">contact page</Link>.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>When you place an order:</strong> your name, email address, phone
          number, shipping address, and the products and quantities you order.
        </li>
        <li>
          <strong>When you contact us:</strong> the name, email address and message you
          send.
        </li>
        <li>
          <strong>When you browse:</strong> your shopping cart is stored in your own
          browser (local storage) so it is still there when you come back. It is not
          sent to us until you order.
        </li>
        <li>
          <strong>Advertising measurement:</strong> see "Meta Pixel" below.
        </li>
      </ul>
    ),
  },
  {
    title: "Why we use it",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To process, prepare and deliver your order, and to contact you about it.</li>
        <li>To answer your questions.</li>
        <li>To keep the records required for accounting and tax purposes.</li>
        <li>To measure the performance of our ads and show them to interested people.</li>
      </ul>
    ),
  },
  {
    title: "Meta Pixel",
    body: (
      <>
        <p>
          This website uses the Meta Pixel, a tool provided by Meta Platforms (Facebook,
          Instagram). It places cookies in your browser and sends Meta information about
          your visit: pages viewed, products added to the cart, the start of checkout
          and completed purchases (product references, amount and currency). Meta may
          link this information to your Facebook or Instagram account.
        </p>
        <p className="mt-3">
          We use it only to measure our ads and to reach people likely to be interested
          in our ceramics. We do not send Meta your name, email, phone or address. You
          can limit this tracking in your{" "}
          <a
            href="https://www.facebook.com/adpreferences"
            target="_blank"
            rel="noreferrer"
            className="text-[#884B2C] underline"
          >
            Meta ad preferences
          </a>
          , by blocking third-party cookies, or with a content blocker. Meta's own
          handling of data is described in its{" "}
          <a
            href="https://www.facebook.com/privacy/policy"
            target="_blank"
            rel="noreferrer"
            className="text-[#884B2C] underline"
          >
            privacy policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Who receives your data",
    body: (
      <>
        <p>We never sell your data. It is only shared with:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>the delivery service that brings you your order (name, phone, address);</li>
          <li>
            the technical providers that run this website: our web host, our database
            provider and our email provider, which process data only on our behalf;
          </li>
          <li>Meta, for the advertising measurement described above.</li>
        </ul>
        <p className="mt-3">
          Some of these providers may store data outside Tunisia.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Order data: for as long as required by accounting and tax law.</li>
        <li>Contact messages: up to 1 year after our last exchange.</li>
        <li>Your cart: in your browser until you empty it or clear your browser data.</li>
      </ul>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        In accordance with Tunisian Organic Law No. 2004-63 on the protection of
        personal data, and the GDPR where it applies, you can ask to access, correct or
        delete your personal data, or object to its use. Contact us using the details
        above. If you believe your rights are not respected, you can file a complaint
        with the Instance Nationale de Protection des Données Personnelles (INPDP), or
        the data protection authority of your country.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        Our website is served over an encrypted connection (HTTPS), and access to order
        data is restricted to authorised staff.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy, for example when we add a new service. The date at
        the top of this page shows the latest version.
      </p>
    ),
  },
];

const Privacy = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  return (
    <div className="relative w-full bg-[#FBF7ED] text-[#33271f]">
      <div className="px-4 py-1 md:px-16">
        <Breadcrumbs
          title="Privacy Policy"
          prevLocation={prevLocation}
          className="text-sm text-[#884B2C]"
        />
      </div>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-10 sm:py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b6a4f]">
          RomaTerra · Last updated {LAST_UPDATED}
        </p>
        <h1 className="mb-6 text-3xl font-semibold text-[#884B2C] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-10 text-base leading-8 text-[#493b31]">
          This page explains what personal data we collect when you visit our website or
          place an order, why we collect it, and how you can control it.
        </p>

        <div className="space-y-9 border-t border-[#884B2C]/25 pt-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-[#33271f]">
                {section.title}
              </h2>
              <div className="text-sm leading-7 text-[#67594f] sm:text-base sm:leading-8">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Privacy;
