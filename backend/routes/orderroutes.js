const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Place an order (mock payment)
router.post("/", protect, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!address || !address.fullName || !address.phone || !address.city || !address.line) {
      return res.status(400).json({ message: "Please fill in the full address" });
    }

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const qty = parseInt(it.qty);
      if (!qty || qty < 1) return res.status(400).json({ message: "Invalid quantity" });
      const p = await Product.findById(it.product);
      if (!p) return res.status(404).json({ message: "A product in your cart no longer exists" });
      if (p.stock < qty) {
        return res.status(400).json({ message: p.name + " has only " + p.stock + " left in stock" });
      }
      orderItems.push({ product: p._id, name: p.name, price: p.price, image: p.image, qty });
      total += p.price * qty;
    }

    for (const it of orderItems) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const method = paymentMethod || "Mock Card";
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      address,
      paymentMethod: method,
      isPaid: method !== "Cash on Delivery",
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// My orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// All orders (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const filter = status && status !== "All" ? { status } : {};
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update status (admin)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
