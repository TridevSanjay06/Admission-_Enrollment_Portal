import { Link } from 'react-router-dom';
import { imageUrl } from '../config.js';

/**
 * @param {'landing' | 'main' | 'enroll'} variant
 */
export default function Navbar({ variant = 'main' }) {
  const logoSrc = imageUrl('/Images/NavBar/School-logo.png');

  if (variant === 'landing') {
    return (
      <nav className="navbar" aria-label="Primary">
        <div className="navbar-inner">
          <div className="left-section">
            <img className="school-logo" src={logoSrc} alt="" />
            <div className="logo-name-class">
              <p className="logo-name">AMS</p>
              <p className="logo-motive"> Light-Learn-Lead</p>
            </div>
          </div>
          <div className="right-section-login">
            <ul>
              <li>
                <Link to="/enroll">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  if (variant === 'enroll') {
    return (
      <nav className="navbar" aria-label="Primary">
        <div className="navbar-inner">
          <div className="left-section">
            <img className="school-logo" src={logoSrc} alt="" />
            <div className="logo-name-class">
              <p className="logo-name">AMS</p>
              <p className="logo-motive"> Light-Learn-Lead</p>
            </div>
          </div>
          <div className="right-section-login">
            <ul>
              <li>
                <Link to="/main">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-inner">
        <div className="left-section">
          <img className="school-logo" src={logoSrc} alt="" />
          <div className="logo-name-class">
            <p className="logo-name">AMS</p>
            <p className="logo-motive"> Light-Learn-Lead</p>
          </div>
        </div>
        <div className="middel-section">
          <ul className="middel-buttons">
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <Link to="/enroll">Admissions</Link>
            </li>
            <li>
              <a href="#career">Career</a>
            </li>
            <li>
              <a href="#blogs">Blogs</a>
            </li>
          </ul>
        </div>
        <div className="right-section">
          <ul>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
