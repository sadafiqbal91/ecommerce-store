import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMenu(false);

  return (
    <header className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="container nav-inner">
        <Link to="/" className="logo">AURELLE</Link>
        <nav id="primary-navigation" className={"nav-links" + (menu ? " open" : "")}>
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/shop" onClick={close}>Shop</Link>
          {user && user.role === "admin" && <Link to="/admin" onClick={close}>Admin</Link>}
          {user && <Link to="/orders" onClick={close}>My Orders</Link>}
          {user ? (
            <button className="link-btn" onClick={() => { logout(); close(); }}>
              localStorage.removeItem("user"); location.reload();
            </button>
          ) : (
            <Link to="/login" onClick={close}>Login</Link>
          )}
          <button className="cart-btn" onClick={() => { setOpen(true); close(); }} aria-label="Cart">
            <FiShoppingBag />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </nav>
        <button
          className="menu-btn"
          onClick={() => setMenu((isOpen) => !isOpen)}
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="primary-navigation"
        >
          {menu ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
