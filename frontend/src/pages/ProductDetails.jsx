import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import { useCart } from "../context/CartContext";
import { money } from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [broken, setBroken] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.get("/products/" + id).then((r) => setP(r.data)).catch(() => setMissing(true));
  }, [id]);

  if (missing) {
    return (
      <div className="page container">
        <p className="muted">Product not found.</p>
        <Link to="/shop" className="btn btn-ghost" style={{ marginTop: 20 }}>Back to shop</Link>
      </div>
    );
  }
  if (!p) return <div className="page container"><p className="muted">Loading...</p></div>;

  return (
    <div className="page container detail">
      <motion.div
        className="detail-img"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {p.image && !broken ? (
          <img src={p.image} alt={p.name} onError={() => setBroken(true)} />
        ) : (
          <span className="ph">{p.name.charAt(0)}</span>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
        <p className="eyebrow">{p.brand} / {p.category}</p>
        <h2 className="title">{p.name}</h2>
        <p className="price" style={{ fontSize: "1.6rem", marginBottom: 18 }}>{money(p.price)}</p>
        <p className="muted" style={{ marginBottom: 22 }}>{p.description}</p>
        <p style={{ marginBottom: 22, fontSize: "0.9rem" }}>
          Rating: {p.rating} / 5 &nbsp;|&nbsp;{" "}
          {p.stock > 0 ? (p.stock <= 5 ? "Only " + p.stock + " left" : "In stock") : "Sold out"}
        </p>

        {p.stock > 0 && (
          <div className="detail-actions">
            <div className="qty big">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button>
            </div>
            <button className="btn" onClick={() => add(p, qty)}>Add to cart</button>
          </div>
        )}
        <div style={{ marginTop: 30 }}>
          <Link to="/shop" className="link-btn">Back to shop</Link>
        </div>
      </motion.div>
    </div>
  );
}
