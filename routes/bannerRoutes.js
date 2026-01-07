const express = require("express");
const router = express.Router();
const {
  getAllBanners,
  getAllBannersAdmin,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} = require("../controller/bannerController");
const { isAuth } = require("../config/auth");

// Public endpoint - get all active banners
router.get("/", getAllBanners);

// Admin endpoints (protected)
// IMPORTANT: Specific routes must come before parameterized routes
router.get("/admin", isAuth, getAllBannersAdmin);
router.post("/admin", isAuth, addBanner);
router.put("/admin/reorder", isAuth, reorderBanners); // Must come before /admin/:id
router.put("/admin/:id", isAuth, updateBanner);
router.delete("/admin/:id", isAuth, deleteBanner);

module.exports = router;

