import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { money } from "../components/ProductCard";

const emptyForm = { name: "", brand: "", category: "Men", price: "", stock: "", image: "", description: "", featured: false };
const msg = (e, d) => (e.response && e.response.data && e.response.data.message) || d;

function Overview() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/stats").then((r) => setS(r.data)).catch((e) => setErr(msg(e, "Could not load stats")));
  }, []);

  if (err) return <div className="error">{err}</div>;
  if (!s) return <p className="muted">Loading...</p>;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const sales = days.map((d) => {
    const f = s.daily.find((x) => x._id === d);
    return f ? f.sales : 0;
  });
  const max = Math.max(...sales, 1);

  return (
    <>
      <div className="stats-grid">
        <div className="stat"><span>Revenue</span><strong>{money(s.revenue)}</strong></div>
        <div className="stat"><span>Orders</span><strong>{s.totalOrders}</strong></div>
        <div className="stat"><span>Products</span><strong>{s.totalProducts}</strong></div>
        <div className="stat"><span>Users</span><strong>{s.totalUsers}</strong></div>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>Sales, last 7 days</h3>
          <div className="bars">
            {sales.map((v, i) => (
              <div className="bar-col" key={i}>
                <div className="bar-val">{v ? Math.round(v / 1000) + "k" : ""}</div>
                <div className="bar" style={{ height: (v / max) * 100 + "%" }} />
                <div className="bar-lbl">{days[i].slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Low stock</h3>
          {s.lowStock.length === 0 && <p className="muted">All products are well stocked.</p>}
          {s.lowStock.map((p) => (
            <div className="sum-row" key={p._id}>
              <span>{p.name}</span>
              <span style={{ color: "var(--danger)" }}>{p.stock} left</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3>Recent orders</h3>
        {s.recentOrders.length === 0 && <p className="muted">No orders yet.</p>}
        <div className="table-wrap">
          {s.recentOrders.length > 0 && (
            <table className="table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {s.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>{o.user ? o.user.name : "Deleted user"}</td>
                    <td>{money(o.total)}</td>
                    <td><span className={"status s-" + o.status}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

function ProductsTab() {
  const [data, setData] = useState({ products: [], total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    api
      .get("/products", { params: { search: q, page, limit: 8 } })
      .then((r) => setData(r.data))
      .catch(() => {});
  }, [q, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => { setQ(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openNew = () => { setForm({ ...emptyForm }); setEditId(null); setErr(""); };
  const openEdit = (p) => {
    setForm({ name: p.name, brand: p.brand, category: p.category, price: p.price, stock: p.stock, image: p.image, description: p.description, featured: p.featured });
    setEditId(p._id);
    setErr("");
  };
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !form.category.trim()) return setErr("Name and category are required");
    if (form.price === "" || Number(form.price) < 0) return setErr("Enter a valid price");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };
    try {
      if (editId) await api.put("/products/" + editId, body);
      else await api.post("/products", body);
      setForm(null);
      load();
    } catch (er) {
      setErr(msg(er, "Could not save product"));
    }
  };

  const del = async (p) => {
    if (!window.confirm("Delete " + p.name + "?")) return;
    try {
      await api.delete("/products/" + p._id);
      load();
    } catch (er) {
      alert(msg(er, "Could not delete"));
    }
  };

  return (
    <>
      <div className="toolbar">
        <input className="input" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-sm" onClick={openNew}>+ Add product</button>
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead><tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th></th></tr></thead>
          <tbody>
            {data.products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td style={{ color: p.stock <= 5 ? "var(--danger)" : "inherit" }}>{p.stock}</td>
                <td>{p.featured ? "Yes" : "No"}</td>
                <td className="actions">
                  <button className="link-btn" onClick={() => openEdit(p)}>Edit</button>
                  <button className="link-btn" style={{ color: "var(--danger)" }} onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.products.length === 0 && <p className="muted" style={{ padding: 14 }}>No products found.</p>}
      </div>

      {data.totalPages > 1 && (
        <div className="pager">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {data.totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {form && (
        <div className="modal-back" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editId ? "Edit product" : "Add product"}</h3>
            {err && <div className="error">{err}</div>}
            <div className="field"><label>Name</label><input name="name" value={form.name} onChange={change} /></div>
            <div className="two">
              <div className="field"><label>Brand</label><input name="brand" value={form.brand} onChange={change} /></div>
              <div className="field"><label>Category</label><input name="category" value={form.category} onChange={change} /></div>
            </div>
            <div className="two">
              <div className="field"><label>Price (Rs)</label><input name="price" type="number" value={form.price} onChange={change} /></div>
              <div className="field"><label>Stock</label><input name="stock" type="number" value={form.stock} onChange={change} /></div>
            </div>
            <div className="field"><label>Image path or URL</label><input name="image" value={form.image} onChange={change} placeholder="/products/p1.jpg" /></div>
            <div className="field"><label>Description</label><input name="description" value={form.description} onChange={change} /></div>
            <label className="check"><input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Featured on home page</label>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button className="btn">Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function OrdersTab() {
  const [data, setData] = useState({ orders: [], total: 0, totalPages: 1 });
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    api
      .get("/orders", { params: { status, page, limit: 8 } })
      .then((r) => setData(r.data))
      .catch(() => {});
  }, [status, page]);

  useEffect(() => { load(); }, [load]);

  const change = async (id, st) => {
    try {
      await api.put("/orders/" + id + "/status", { status: st });
      load();
    } catch (e) {
      alert(msg(e, "Could not update"));
    }
  };

  return (
    <>
      <div className="chips" style={{ marginBottom: 18 }}>
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <button key={s} className={"chip" + (status === s ? " active" : "")} onClick={() => { setStatus(s); setPage(1); }}>
            {s}
          </button>
        ))}
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user ? o.user.name : "Deleted user"}<div className="muted" style={{ fontSize: "0.75rem" }}>{o.user ? o.user.email : ""}</div></td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>{money(o.total)}</td>
                <td>{o.paymentMethod}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select className="input sel" value={o.status} onChange={(e) => change(o._id, e.target.value)}>
                    {["Pending", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.orders.length === 0 && <p className="muted" style={{ padding: 14 }}>No orders found.</p>}
      </div>

      {data.totalPages > 1 && (
        <div className="pager">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {data.totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}

export default function Admin() {
  const [tab, setTab] = useState("overview");
  return (
    <div className="page container">
      <p className="eyebrow">Control room</p>
      <h2 className="title">Admin Dashboard</h2>
      <div className="chips" style={{ marginBottom: 26 }}>
        {[["overview", "Overview"], ["products", "Products"], ["orders", "Orders"]].map(([k, l]) => (
          <button key={k} className={"chip" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === "overview" && <Overview />}
      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
    </div>
  );
}
