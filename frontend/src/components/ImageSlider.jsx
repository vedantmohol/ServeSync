import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import Slider1 from "../assets/Slider1.webp";
import Slider2 from "../assets/Slider2.avif";
import Slider3 from "../assets/Slider3.webp";
import Slider4 from "../assets/Slider4.webp";

const images = [Slider1, Slider2, Slider3, Slider4];

export default function ImageSlider() {
    const swiperRef = useRef(null);

  return (
    <div className="w-[90%] mx-auto my-8">
      <h1 className="text-2xl md:text-4xl font-serif  text-center mb-6 text-black">
        Welcome to ServeSync! 
      </h1>

      <hr className="my-10 border-t-2 border-gray-300" />

      <div className="rounded-2xl overflow-hidden" 
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}>
        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="h-[300px] md:h-[450px]"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
