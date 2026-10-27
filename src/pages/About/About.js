import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ourStoryImg from "../../assets/images/ourstory.png";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  return (
    <div className="relative w-full bg-[#FBF7ED] text-[#33271f]">
      <div className="px-4 py-1 md:px-16">
        <Breadcrumbs
          title="Our Story"
          prevLocation={prevLocation}
          className="text-sm text-[#884B2C]"
        />
      </div>

      <main>
        <section
          className="relative flex min-h-[680px] items-center overflow-hidden bg-cover bg-[62%_center] sm:min-h-[760px] lg:min-h-[820px]"
          style={{ backgroundImage: `url(${ourStoryImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7ED]/95 via-[#FBF7ED]/80 to-[#FBF7ED]/5" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-10 lg:px-16">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b6a4f]">
                RomaTerra · Handmade ceramics
              </p>
              <h1
                className="mb-5 text-6xl leading-none text-[#884B2C] sm:text-7xl"
                style={{ fontFamily: "'Style Script', cursive" }}
              >
                Our Story
              </h1>
              <p className="mb-5 max-w-xl text-xl font-medium leading-8 text-[#3f3026] sm:text-2xl sm:leading-9">
                Where clay becomes story.
              </p>
              <p className="max-w-xl text-base leading-8 text-[#493b31] sm:text-lg sm:leading-9">
                Inspired by nature and tradition, we shape timeless pieces by hand. Each creation carries its own identity, celebrating imperfection, authenticity and the beauty of slow making. Made to bring warmth and character into modern living spaces.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#884B2C]">
                <span className="h-px w-12 bg-[#884B2C]" />
                Shaped by hand in Tunisia
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-16 lg:px-16">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b6a4f]">
              Our approach
            </p>
            <h2 className="text-2xl font-semibold text-[#33271f] sm:text-3xl">
              Made slowly. Made to matter.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 border-t border-[#884B2C]/25 pt-7 sm:grid-cols-3 sm:gap-10">
            <article>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6a4f]">01 · The material</p>
              <h3 className="mb-2 text-lg font-semibold text-[#33271f]">Nature, as a starting point</h3>
              <p className="text-sm leading-7 text-[#67594f]">The character of clay guides every form, texture and finish.</p>
            </article>
            <article>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6a4f]">02 · The making</p>
              <h3 className="mb-2 text-lg font-semibold text-[#33271f]">Shaped by hand</h3>
              <p className="text-sm leading-7 text-[#67594f]">Small details and natural variations make each piece its own.</p>
            </article>
            <article>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6a4f]">03 · The feeling</p>
              <h3 className="mb-2 text-lg font-semibold text-[#33271f]">A place in your home</h3>
              <p className="text-sm leading-7 text-[#67594f]">Ceramics made to bring warmth and character to everyday spaces.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;