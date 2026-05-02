import { useEffect, useState } from 'react';
import { imageUrl } from '../config.js';

const DEFAULT_IMAGES = [
  '/Images/Childernsphotos/intro-image[6].jpg',
  '/Images/Childernsphotos/intro-image[7].jpg',
  '/Images/Childernsphotos/intro-image[8].jpg',
  '/Images/Childernsphotos/intro-image[9].jpg',
  '/Images/Childernsphotos/intro-image[10].jpg',
  '/Images/Childernsphotos/intro-image[11].jpg'
];

/**
 * Shows three visible images at a time and rotates — preserves the “strip” feel of the original track carousel without duplicate `.dot` nodes.
 */
export default function TrackCarousel({ images = DEFAULT_IMAGES, intervalMs = 3000 }) {
  const [start, setStart] = useState(0);
  const n = images.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setStart((s) => (s + 1) % n);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [n, intervalMs]);

  const visible = [0, 1, 2].map((k) => images[(start + k) % n]);

  return (
    <div className="grid-five-main">
      <div className="grid-five">
        <div className="carousel-track" style={{ transform: 'translateX(0)' }}>
          {visible.map((src, idx) => (
            <img key={`${src}-${start}-${idx}`} src={imageUrl(src)} alt="" />
          ))}
        </div>
      </div>
      <div className="dotteds">
        {images.map((_, idx) => (
          <span
            key={idx}
            role="button"
            tabIndex={0}
            className={`dotted${idx === start ? ' active' : ''}`}
            onClick={() => setStart(idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setStart(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
}
