import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { imageUrl } from '../config.js';

export default function Landing() {
  return (
    <>
      <Navbar variant="landing" />
      <main>
        <div className="login-grid-one">
          <div className="grid-block-one">
            <p className="admissions-open-title">Admissions Open for 2025-2026</p>
            <p className="title-intro">Lighting your Minds</p>
            <p className="title-intro">Shaping Bright Scholars</p>
            <p className="title-intro">Leading Tomorrow’s Future</p>
            <p className="Academic"> Beyond Academic Success</p>
            <p className="grade-title">
              From <span className="inside-grade">Pre-Primary to 7th Grade</span>
            </p>
            <p className="geo-tag">📍 Beeramguda</p>
            <Link to="/main">
              <button type="button" className="button-knowmore">
                Know More
              </button>
            </Link>
          </div>
          <div className="landing-hero-visual">
            <img
              className="image-one"
              src={imageUrl('/Images/LoginPage/image-01.png')}
              alt="Student at Alpha Model School"
            />
          </div>
        </div>
      </main>
    </>
  );
}
