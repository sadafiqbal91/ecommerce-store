import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [data, setData] = useState({ products: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/categories/list").then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { search: q, category, sort, maxPrice, page, limit: 8 } })
      .then((r) => setData(r.data))
      .catch(() => setData({ products: [], total: 0, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [q, category, sort, maxPrice, page]);

  const pick = (c) => {
    setCategory(c);
    setPage(1);
  };

  return (
    <div className="page container">
      <p className="eyebrow">The Collection</p>
      <h2 className="title">Shop Fragrances</h2>

      <button
        className="filter-toggle"
        type="button"
        aria-expanded={filtersOpen}
        aria-controls="shop-filters"
        onClick={() => setFiltersOpen((open) => !open)}
      >
        {filtersOpen ? "Hide filters" : "Show filters"}
      </button>
      <div id="shop-filters" className={"filter-panel" + (filtersOpen ? " open" : "")}>
        <div className="filters">
          <input
            className="input"
            placeholder="Search by name, brand or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <select className="input" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}>
            <option value="">Any price</option>
            <option value="10000">Under Rs 10,000</option>
            <option value="14000">Under Rs 14,000</option>
            <option value="18000">Under Rs 18,000</option>
          </select>
        </div>

        <div className="chips">
          {["All", ...cats].map((c) => (
            <button key={c} className={"chip" + (category === c ? " active" : "")} onClick={() => pick(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="muted" style={{ margin: "10px 0 22px" }}>
        {loading ? "Loading..." : data.total + " products found"}
      </p>

      <div className="grid">
        {data.products.map((p, i) => (
          <ProductCard key={p._id} p={p} index={i} />
        ))}
      </div>

      {!loading && data.products.length === 0 && <p className="muted">No products match your search.</p>}

      {data.totalPages > 1 && (
        <div className="pager">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {data.totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
