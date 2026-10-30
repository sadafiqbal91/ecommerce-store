import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api";
import { money } from "../components/ProductCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const placed = location.state && location.state.placed;

  useEffect(() => {
    api.get("/orders/mine").then((r) => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <p className="eyebrow">Account</p>
      <h2 className="title">My Orders</h2>
      {placed && <div className="success">Thank you! Your order has been placed.</div>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && orders.length === 0 && (
        <>
          <p className="muted">You have no orders yet.</p>
          <Link to="/shop" className="btn" style={{ marginTop: 20 }}>Start shopping</Link>
        </>
      )}
      {orders.map((o) => (
        <div className="panel order" key={o._id}>
          <div className="order-head">
            <div>
              <div className="card-brand">Order #{o._id.slice(-6).toUpperCase()}</div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <span className={"status s-" + o.status}>{o.status}</span>
          </div>
          {o.items.map((i, idx) => (
            <div className="sum-row" key={idx}><span>{i.name} x {i.qty}</span><span>{money(i.price * i.qty)}</span></div>
          ))}
          <div className="sum-row total">
            <span>{o.paymentMethod}{o.isPaid ? " (paid)" : ""}</span>
            <span className="price">{money(o.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
