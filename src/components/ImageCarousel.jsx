import React, { useState } from 'react'
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ImageCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

  
    return (
      <Carousel activeIndex={index} onSelect={handleSelect} >
        <Carousel.Item interval={6000}>
          <video
            className="d-block w-100 "
            src="https://res.cloudinary.com/dckddk4fm/video/upload/v1671122506/Kevins-reef-store/carousel1_veklev.mp4"
            alt="First slide"
            loop
            muted
            autoPlay
            playsInline

          />
          <Carousel.Caption>
            <h4>Welcome to the Kevin's Reef Store</h4>
            <p>The hub for healthy aqua-cultured corals</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item >
          <img
            className="d-block w-100 "
            src="https://res.cloudinary.com/dckddk4fm/image/upload/v1671129664/Kevins-reef-store/IMG_1883_xyjepq.jpg"
            alt="Second slide"
          />
  
          <Carousel.Caption>
          <h3>Live Arrival Guaranteed </h3>
            <strong>
              <p >
                With over 5 years of experience in shipping. Alive arrival or your money back. <Link to='/policy'>Terms and conditions apply</Link>
              </p>
            </strong>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 "
            src="https://res.cloudinary.com/dckddk4fm/image/upload/v1671130059/Kevins-reef-store/carousel3_afkep2.jpg"
            alt="Third slide"
          />
  
          <Carousel.Caption>
          <h3>Home Grown Aqua-Cultured Corals</h3>
            <strong>
              <p className='dark'>
                Pests and Diseases Free
              </p>
            </strong>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
}
