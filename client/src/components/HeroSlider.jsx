import { useEffect, useState } from 'react';
import { imageUrl } from '../config.js';

const DEFAULT_IMAGES = [
  '/Images/Childernsphotos/intro-image[1].png',
  '/Images/Childernsphotos/intro-image[2].png',
  '/Images/Childernsphotos/intro-image[3].png'
];

export default function HeroSlider({ images = DEFAULT_IMAGES, intervalMs = 5000 }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  const active = images[slideIndex];

  return (
    <div className="hero-slider-root">
      <div className="hero-slider-frame">
        <img
          className="hero-slide-img"
          src={imageUrl(active)}
          alt={`Slide ${slideIndex + 1}`}
          key={active}
        />
      </div>
      <div className="hero-slider-dots" role="tablist" aria-label="Hero slides">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={idx === slideIndex}
            className={`hero-slider-dot${idx === slideIndex ? ' active' : ''}`}
            onClick={() => setSlideIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
