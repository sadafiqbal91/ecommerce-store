const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalProducts, totalUsers, totalOrders, lowStock, revenueAgg, recentOrders, byStatus, daily] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Product.find({ stock: { $lte: 5 } }).select("name stock").sort({ stock: 1 }).limit(5),
        Order.aggregate([
          { $match: { status: { $ne: "Cancelled" } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
        Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Order.aggregate([
          { $match: { createdAt: { $gte: weekAgo }, status: { $ne: "Cancelled" } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              sales: { $sum: "$total" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      revenue: revenueAgg[0] ? revenueAgg[0].total : 0,
      lowStock,
      recentOrders,
      byStatus,
      daily,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
