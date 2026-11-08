import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
  banner1,
} from "../../assets/images";
import { useBanner } from "../../api/useApi";
import Image from "../designLayouts/Image";

const IMAGE_SLIDE_DURATION = 5000;
// Shown until the first slide is added from the dashboard.
const DEFAULT_SLIDES = [{ id: "default", type: "image", url: banner1, link: "/offer" }];

const Banner = () => {
  const [dotActive, setDocActive] = useState(0);
  const { slides: bannerSlides, loading } = useBanner();
  const slides = bannerSlides.length > 0 ? bannerSlides : DEFAULT_SLIDES;
  const hasManySlides = slides.length > 1;
  const sliderRef = useRef(null);
  const videoRefs = useRef([]);
  const currentSlide = slides[dotActive];

  const goToNextSlide = () => {
    if (hasManySlides) sliderRef.current?.slickNext();
  };

  // Only the visible video plays. Images advance on a timer, videos when they end.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === dotActive) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
    if (!hasManySlides || currentSlide?.type === "video") return undefined;
    const timer = setTimeout(() => sliderRef.current?.slickNext(), IMAGE_SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [dotActive, hasManySlides, currentSlide?.type, loading]);

  const settings = {
    dots: hasManySlides,
    infinite: true,
    // Fade mode has no cloned slides, so each video exists only once in the page.
    fade: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "7%",
          transform: "translateY(-50%)",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={
          i === dotActive
            ? {
                width: "30px",
                color: "#262626",
                borderRight: "3px #262626 solid",
                padding: "8px 0",
                cursor: "pointer",
              }
            : {
                width: "30px",
                color: "transparent",
                borderRight: "3px white solid",
                padding: "8px 0",
                cursor: "pointer",
              }
        }
      >
        0{i + 1}
      </div>
    ),
    responsive: [
      {
        breakpoint: 576,
        settings: {
          dots: hasManySlides,
          appendDots: (dots) => (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "2%",
                transform: "translateY(-50%)",
              }}
            >
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
          ),
          customPaging: (i) => (
            <div
              style={
                i === dotActive
                  ? {
                      width: "25px",
                      color: "#262626",
                      borderRight: "3px #262626 solid",
                      cursor: "pointer",
                      fontSize: "12px",
                    }
                  : {
                      width: "25px",
                      color: "transparent",
                      borderRight: "3px white solid",
                      cursor: "pointer",
                      fontSize: "12px",
                    }
              }
            >
              0{i + 1}
            </div>
          ),
        },
      },
    ],
  };
  if (loading) return <div className="w-full bg-white min-h-[40vh]" />;

  return (
    <div className="w-full bg-white">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <Link key={slide.id} to={slide.link || "/offer"}>
            <div>
              {slide.type === "video" ? (
                <video
                  ref={(element) => { videoRefs.current[index] = element; }}
                  className="w-full"
                  src={slide.url}
                  muted
                  playsInline
                  loop={!hasManySlides}
                  preload="metadata"
                  onEnded={goToNextSlide}
                  onError={goToNextSlide}
                />
              ) : (
                <Image imgSrc={slide.url} className="w-full" />
              )}
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
