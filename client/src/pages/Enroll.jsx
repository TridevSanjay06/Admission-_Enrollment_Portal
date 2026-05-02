import Navbar from '../components/Navbar.jsx';
import Chatbot from '../components/Chatbot.jsx';
import EnrollmentForm from '../components/EnrollmentForm.jsx';

export default function Enroll() {
  return (
    <>
      <Navbar variant="enroll" />
      <main>
        <div className="grid-zero-enroll"> </div>
        <div className="grid-one-enroll">
          <div className="address-details">
            <div className="contact-box">
              <p className="contact-details"> Contact Details</p>
              <table>
                <tbody>
                  <tr>
                    <td>📍 Location</td>
                    <td className="description-details">
                      Alpha Model&apos;s International School <br />
                      Plot no : 395,Road no:06,Raghavendra Colony <br />
                      Beeramguda, Telangana 502032 <br />
                      <a
                        href="https://www.google.com/maps/place/Alpha+Model+School+Beeramguda/@17.5268637,78.2988005,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb9381c2cf793b:0x4cf4e6310fd39286!8m2!3d17.5268586!4d78.3013754!16s%2Fg%2F11sc79n_96?entry=ttu"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>✉ For Admission</td>
                    <td className="description-details">admissions@alphamodels.in</td>
                  </tr>
                  <tr>
                    <td>✉ For All Enquiries</td>
                    <td className="description-details">enquiry@alphamodels.in</td>
                  </tr>
                  <tr>
                    <td>✉ For Jobs</td>
                    <td className="description-details">hr@alphamodels.in</td>
                  </tr>
                  <tr>
                    <td>📞 Contact Us</td>
                    <td className="description-details">9949128732</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <EnrollmentForm />
        </div>
        <div className="enroll-grid-four"> </div>
      </main>
      <Chatbot />
    </>
  );
}
