import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { money } from "../components/ProductCard";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [addr, setAddr] = useState({ fullName: "", phone: "", city: "", line: "" });
  const [method, setMethod] = useState("Mock Card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onAddr = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });
  const onCard = (e) => setCard({ ...card, [e.target.name]: e.target.value });

  if (items.length === 0) {
    return (
      <div className="page container">
        <p className="muted">Your cart is empty.</p>
        <Link to="/shop" className="btn" style={{ marginTop: 20 }}>Go to shop</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!addr.fullName.trim() || !addr.city.trim() || !addr.line.trim()) return setError("Please fill in your full address");
    if (!/^\d{10,13}$/.test(addr.phone.replace(/[\s-]/g, ""))) return setError("Enter a valid phone number");
    if (method === "Mock Card") {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) return setError("Card number must be 16 digits (use any test number)");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return setError("Expiry must look like 08/28");
      if (!/^\d{3,4}$/.test(card.cvv)) return setError("CVV must be 3 or 4 digits");
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      await api.post("/orders", {
        items: items.map((i) => ({ product: i._id, qty: i.qty })),
        address: addr,
        paymentMethod: method,
      });
      clear();
      navigate("/orders", { state: { placed: true } });
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <p className="eyebrow">Almost there</p>
      <h2 className="title">Checkout</h2>

      <form className="checkout" onSubmit={submit}>
        <div className="panel">
          <h3>Delivery details</h3>
          <div className="field"><label>Full name</label><input name="fullName" value={addr.fullName} onChange={onAddr} /></div>
          <div className="field"><label>Phone</label><input name="phone" value={addr.phone} onChange={onAddr} /></div>
          <div className="field"><label>City</label><input name="city" value={addr.city} onChange={onAddr} /></div>
          <div className="field"><label>Address</label><input name="line" value={addr.line} onChange={onAddr} /></div>

          <h3 style={{ marginTop: 26 }}>Payment</h3>
          <div className="chips">
            {["Mock Card", "Cash on Delivery"].map((m) => (
              <button type="button" key={m} className={"chip" + (method === m ? " active" : "")} onClick={() => setMethod(m)}>
                {m === "Mock Card" ? "Card (demo)" : m}
              </button>
            ))}
          </div>
          {method === "Mock Card" && (
            <>
              <p className="muted" style={{ fontSize: "0.82rem", margin: "6px 0 14px" }}>
                Demo payment only. No real money is charged. Use any test number like 4242 4242 4242 4242.
              </p>
              <div className="field"><label>Card number</label><input name="number" value={card.number} onChange={onCard} placeholder="4242 4242 4242 4242" /></div>
              <div className="two">
                <div className="field"><label>Expiry</label><input name="expiry" value={card.expiry} onChange={onCard} placeholder="08/28" /></div>
                <div className="field"><label>CVV</label><input name="cvv" value={card.cvv} onChange={onCard} placeholder="123" /></div>
              </div>
            </>
          )}
        </div>

        <div className="panel">
          <h3>Order summary</h3>
          {items.map((i) => (
            <div className="sum-row" key={i._id}>
              <span>{i.name} x {i.qty}</span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="sum-row total"><span>Total</span><span className="price">{money(total)}</span></div>
          {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}
          <button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={loading}>
            {loading ? "Processing payment..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
