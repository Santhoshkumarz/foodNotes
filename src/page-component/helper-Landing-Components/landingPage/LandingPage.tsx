import React, { useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS

const LandingPage = () => {
  useEffect(() => {
    // Ensure this runs only on the client-side (after the page has been rendered)
    if (typeof window !== "undefined" && window.document) {
      const bootstrap = window.bootstrap;
      const navbarCollapse = document.getElementById("navbarCollapse");

      if (navbarCollapse && bootstrap) {
        new bootstrap.Collapse(navbarCollapse); // Initialize Bootstrap Collapse
      }
    } else {
      console.error("Bootstrap is not loaded or window is not defined");
    }
  }, []); // Empty dependency array ensures it runs once, after the initial render

  return (
    <>
      <div className="container-xxl position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
          <Link href="/" className="navbar-brand p-0">
            <h1 className="text-primary m-0">
              <i className="fa fa-utensils me-3"></i>Ariki Foods Notes
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0 pe-4">
              <Link href="/" className="nav-item nav-link active">
                Home
              </Link>
        
              <Link href="/menu" className="nav-item nav-link">
                Menu
              </Link>
             
              <Link href="/addFood" className="nav-item nav-link">
                Add Food
              </Link>
            </div>
            <Link href="/list" className="btn btn-primary py-2 px-4">
              List of Foods
            </Link>
          </div>
        </nav>

        <div className="container-xxl py-5 bg-dark hero-header mb-5">
          <div className="container my-5 py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 className="display-3 text-white animated slideInLeft">
                  Enjoy Our
                  <br />
                  Delicious Meal
                </h1>
                <p className="text-white animated slideInLeft mb-4 pb-2">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>
                <Link
                  href="/addToCarts"
                  className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft"
                >
                  Book A Orders
                </Link>
              </div>
              <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                <img className="img-fluid" src="img/hero.png" alt="Hero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
