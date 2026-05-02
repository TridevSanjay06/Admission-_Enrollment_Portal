import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import TrackCarousel from '../components/TrackCarousel.jsx';
import Chatbot from '../components/Chatbot.jsx';
import { imageUrl } from '../config.js';

export default function Main() {
  return (
    <>
      <Navbar variant="main" />
      <main>
        <div className="grid-one">
          <div className="grid-block-one">
            <p className="admissions-open-title">Admissions Open for 2025-2026</p>
            <p className="title-intro">Lighting your Minds</p>
            <p className="title-intro">Shaping Bright Scholars</p>
            <p className="title-intro">Leading Tomorrow’s Future</p>
            <p className="Academic"> Beyond Academic Success</p>
            <p className="grade-title">
              From <span className="inside-grade">Pre-Primary to 7th Grade</span>
            </p>
            <p className="geo-tag">📍Beeramguda</p>
          </div>
          <HeroSlider />
        </div>

        <div className="grid-two" id="about">
          <div className="grid-block-two">
            <p className="welcome-title">Alpha Model&apos;s International School</p>
            <div className="description">
              At Alpha Model School, we believe every child is a spark of potential waiting to shine. From Playgroup to 7th
              Grade, we provide a nurturing and vibrant learning environment that helps children grow with confidence,
              curiosity, and compassion.
              <p className="description">
                Guided by our motto — <span className="description-bold"> Light, Learn, Lead</span> — we focus on building
                strong <span className="description-bold">foundations, moral values,</span> and{' '}
                <span className="description-bold">life skills.</span> Our experienced teachers and engaging curriculum
                ensure that learning is both <span className="description-bold">joyful and meaningful.</span>
              </p>
              <p className="description">
                We light the path for our students to <span className="description-bold">lead with courage, learn with passion,</span>{' '}
                and grow into thoughtful individuals prepared for tomorrow’s challenges.
              </p>
              <p className="description">
                At Alpha, education is more than books — it&apos;s about creating leaders of character, vision, and heart.
              </p>
            </div>
            <Link to="/enroll">
              <button type="button" className="light-button">
                Light the Way Forward
              </button>
            </Link>
          </div>
          <div className="grid-two-images">
            <img className="image-two" src={imageUrl('/Images/Childernsphotos/intro-image[4].png')} alt="" />
          </div>
        </div>

        <div className="grid-three">
          <div className="grid-block-three">
            <img className="co-founder-image" src={imageUrl('/Images/Childernsphotos/intro-image[5].jpg')} alt="" />
            <div className="co-founder-layout">
              <p className="co-founder-info">
                Our Co-Founder, <span className="co-founder-name"> Mrs. D. Jyothi Acharya</span>, M.Sc. has been the pillar
                of vision and inspiration behind our school. With a passion for education and a belief in holistic growth,
                she has dedicated efforts to nurture young minds with knowledge and values. Her guidance continues to shape
                our journey towards excellence, innovation, and character-building.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-four">
          <div className="school-description-layout">
            <p className="school-description-info">
              Our experienced teachers and activity-based learning approach ensure that each student receives personal
              attention and holistic development. Alpha Model School is more than just a place to study — it&apos;s a place to
              discover potential and prepare for a bright future.
            </p>
            <p className="images-title-heading">&quot;Core Values That Shape Every Learner&quot;</p>
          </div>
        </div>

        <TrackCarousel />

        <div className="grid-six">
          <div className="grid-six-layout">
            <p>Excellence with Integrity : The Mission, Vision and the Purpose of Alpha Model&apos;s International School”</p>
          </div>
        </div>

        <div className="grid-seven">
          <div className="mission-layout">
            <p className="mission-title"> Our Mission</p>
            <p className="mission-description">
              At Alpha Model&apos;s International School, our mission is to deliver quality education that balances academic
              rigor with creativity and innovation.We strive to nurture curiosity, critical thinking, and problem-solving
              skills in every learner. Our focus is on building character, instilling respect, empathy, and responsibility
              as lifelong values.
            </p>
          </div>
          <div className="mission-image-layout">
            <img className="mission-image" src={imageUrl('/Images/Childernsphotos/intro-image[12].jpg')} alt="" />
          </div>
          <div className="mission-image-layout">
            <img className="mission-image1" src={imageUrl('/Images/Childernsphotos/intro-image[13].jpg')} alt="" />
          </div>
          <div className="mission-layout1">
            <p className="mission-title1">Our Vision</p>
            <p className="mission-description1">
              Our vision is to become a model of excellence in international education in Hyderabad.We envision a community
              where diversity is celebrated, and collaboration drives collective growth.We aim to inspire lifelong learners
              who are prepared to embrace opportunities and challenges of the future.
            </p>
          </div>
          <div className="mission-layout2">
            <p className="mission-title2"> Our Purpose</p>
            <p className="mission-description2">
              The purpose of our school is to empower young minds with the skills, knowledge, and values needed to thrive in
              a dynamic world.We are committed to creating a supportive environment where students grow into responsible
              individuals who contribute positively to society.
            </p>
          </div>
          <div className="mission-image-layout2">
            <img className="mission-image2" src={imageUrl('/Images/Childernsphotos/intro-image[14].jpg')} alt="" />
          </div>
        </div>

        <div className="grid-eight">
          <p className="eight-description">
            &quot;Where <span className="eight-color"> Global Standards</span> of Education Meet Holistic Growth, Innovation,
            and Lifelong Values at<span className="eight-color"> Alpha Model&apos;s International</span> School in Hyderabad&quot;
          </p>
          <p className="eight-small-description">
            Our school is committed to nurturing young minds with world-class education, strong values, and creativity. We
            inspire every student to grow into a confident, responsible, and future-ready leader
          </p>
        </div>

        <div className="grid-nine"> </div>

        <div className="grid-ten" id="contact">
          <img className="enroll-image" src={imageUrl('/Images/Childernsphotos/enroll-image-01.png')} alt="" />
          <div>
            <p className="enroll-title">Inspire. Educate. Grow.</p>
            <p className="enroll-description">Join a school that nurtures talent, builds confidence, and inspires success.</p>
            <Link to="/enroll">
              <button type="button" className="enroll-now-button">
                Enroll Now
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Chatbot />
    </>
  );
}
