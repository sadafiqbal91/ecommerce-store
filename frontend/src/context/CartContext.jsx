import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (p, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === p._id);
      if (found) {
        return prev.map((i) =>
          i._id === p._id ? { ...i, qty: Math.min(i.qty + qty, p.stock || 99) } : i
        );
      }
      return [
        ...prev,
        { _id: p._id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty },
      ];
    });
    setOpen(true);
  };

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock || 99)) } : i))
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}
