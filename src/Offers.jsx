import "./Offers.css";


function Offers() {
  return (
    <div className="offers-page">

      <section className="offers-content">

  <h2>Affordable Shopping for Every Home</h2>

  <p>
    Get your everyday grocery essentials at budget-friendly
    prices. We aim to make shopping simple, convenient and
    affordable for every family.
  </p>

  <h2>Choose Your Grocery Packages</h2>

  <div className="package-info">

    <div className="package-card">
      <h3>Weekly Grocery Packages</h3>
      <p>
        Convenient grocery essentials for your family's
        weekly needs at affordable prices.
      </p>
    </div>

    <div className="package-card">
      <h3>Monthly Grocery Packages</h3>
      <p>
        Complete everyday grocery essentials for your
        monthly household requirements.
      </p>
    </div>

  </div>

  <div className="order-policy">
    <h3>Online Order Information</h3>

    <p>
      Minimum order value: <strong>₹500</strong>
    </p>

    <p>
      Online orders below ₹500 will not be accepted.
      We focus on grocery orders that offer better
      value and convenience for our customers.
    </p>

    <p>
      <strong>Delivery Location:</strong> Currently,
      online orders are accepted only in Madurai areas.
    </p>
  </div>

</section>

      <section className="offers-contact">
        <h2>Contact Us</h2>

        <p>
          📍 174, South Perumal Mestri Street, South Gate,
          Madurai - 625001, Tamil Nadu
        </p>

        <p>
          📞 +91 8220959648
        </p>
      </section>

    </div>
  );
}

export default Offers;