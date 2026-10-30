import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { money } from "./ProductCard";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  const go = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <motion.aside
          key="drawer"
          className="drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="drawer-head">
            <h3>Your Cart</h3>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
              <FiX />
            </button>
          </div>

          <div className="drawer-body">
            {items.length === 0 && <p className="muted">Your cart is empty.</p>}
            {items.map((it) => (
              <div className="cart-row" key={it._id}>
                <div className="mini">
                  {it.image ? (
                    <img src={it.image} alt="" onError={(e) => (e.target.style.display = "none")} />
                  ) : null}
                  <span>{it.name.charAt(0)}</span>
                </div>
                <div className="cart-info">
                  <div className="card-name" style={{ fontSize: "1.05rem", margin: 0 }}>{it.name}</div>
                  <div className="price">{money(it.price)}</div>
                  <div className="qty">
                    <button onClick={() => setQty(it._id, it.qty - 1)}>-</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it._id, it.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => remove(it._id)} aria-label="Remove">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="drawer-foot">
              <div className="total-row">
                <span>Total</span>
                <strong className="price">{money(total)}</strong>
              </div>
              <button className="btn" style={{ width: "100%" }} onClick={go}>Checkout</button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
