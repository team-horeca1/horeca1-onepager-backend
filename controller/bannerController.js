const Banner = require("../models/Banner");

// Get all active banners (public endpoint)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1 })
      .select("-__v");
    res.status(200).send(banners);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get all banners for admin (including inactive)
const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find({})
      .sort({ order: 1 })
      .select("-__v");
    res.status(200).send(banners);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Add a new banner
const addBanner = async (req, res) => {
  try {
    // Get the highest order value and add 1 for new banner
    const lastBanner = await Banner.findOne({}).sort({ order: -1 });
    const newOrder = lastBanner && lastBanner.order !== undefined ? lastBanner.order + 1 : 0;

    const bannerData = {
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : newOrder,
    };

    const newBanner = new Banner(bannerData);
    await newBanner.save();
    res.status(201).send({
      message: "Banner added successfully!",
      banner: newBanner,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update a banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).send({
        message: "Banner not found",
      });
    }

    res.status(200).send({
      message: "Banner updated successfully!",
      banner: updatedBanner,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete a banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).send({
        message: "Banner not found",
      });
    }

    res.status(200).send({
      message: "Banner deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Reorder banners
const reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body; // Array of { id, order }

    if (!Array.isArray(banners)) {
      return res.status(400).send({
        message: "Banners array is required",
      });
    }

    const updatePromises = banners.map(({ id, order }) =>
      Banner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).send({
      message: "Banners reordered successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllBanners,
  getAllBannersAdmin,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
};

