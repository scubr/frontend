import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import 'swiper/swiper.min.css'
import { Box } from '@chakra-ui/react';


SwiperCore.use([Navigation]);
SwiperCore.use([Pagination]);


const Carousel = React.forwardRef(({ children }, ref) => {

    const { prevRef, nextRef } = ref;

    return (
        <div className='relative'>
            <Swiper
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onInit={swiper => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                slidesPerView={1}
                spaceBetween={10}
                loopFillGroupWithBlank
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                }}
            >
                {children.map((child, index) => (
                    <SwiperSlide key={index}>
                        {child}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* <div ref={prevRef} className="group cursor-pointer absolute top-1/2 transform  -translate-y-1/2 left-2 lg:-translate-x-1/2 lg:left-0 z-10 w-14 h-14 backdrop-brightness-50 backdrop-blur-sm backdrop-contrast-200 hover:bg-gray-50 hover:dark:bg-[#040915] flex justify-center items-center rounded-full shadow-xl">
                <BsFillCaretLeftFill className="h-6 w-6 text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            </div>

            <div ref={nextRef} className="group cursor-pointer absolute top-1/2 transform  -translate-y-1/2 right-2 lg:translate-x-1/2 lg:right-0 z-10 w-14 h-14 backdrop-brightness-50 backdrop-blur-sm backdrop-contrast-200 hover:bg-gray-50 hover:dark:bg-[#040915] flex justify-center items-center rounded-full shadow-xl">
                <BsFillCaretRightFill className="h-6 w-6 text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            </div> */}

        </div>
    )
});

export default Carousel