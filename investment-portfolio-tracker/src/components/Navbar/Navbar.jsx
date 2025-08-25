import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/—Pngtree—business investment logo design template_3607612.png";
import arrow_icon from "../../assets/arrow_icon.png";
import { CoinContext } from "../../context/CoinContext";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust relative path if needed

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const [open, setOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "inr":
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
        break;
    }
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand" onClick={closeMobile}>
          <img src={logo} alt="" className="brand__logo" />
          <span className="brand__name">Investment Portfolio Tracker</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/" className="nav__link" onClick={closeMobile} end>
            Home
          </NavLink>
          {user && <NavLink to="/portfolio" className="nav__link" onClick={closeMobile}>Portfolio</NavLink>}

          <a href="#features" className="nav__link">Features</a>
          <a href="#pricing" className="nav__link">Pricing</a>
          <a href="#blog" className="nav__link">Blog</a>
        </nav>

        <div className="nav__actions">
          <label className="select">
            <span className="sr-only">Currency</span>
            <select onChange={currencyHandler} defaultValue="usd">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="inr">INR</option>
            </select>
          </label>

          {!user ? (
             <button className="btn btn--primary" onClick={login}>Sign in <img src={arrow_icon} alt="" /></button>
           ) : (
             <button className="btn btn--primary" onClick={logout}>
               Sign out
             </button>
           )}

          <button
            className="hamburger"
            aria-label="Open menu"
            aria-controls="mobileMenu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobileMenu" className={`drawer ${open ? "is-open" : ""}`}>
        <NavLink to="/" className="drawer__link" onClick={closeMobile} end>
          Home
        </NavLink>
        <a href="#features" className="drawer__link" onClick={closeMobile}>Features</a>
        <a href="#pricing" className="drawer__link" onClick={closeMobile}>Pricing</a>
        <a href="#blog" className="drawer__link" onClick={closeMobile}>Blog</a>
      </div>
    </header>
  );
};

export default Navbar;
