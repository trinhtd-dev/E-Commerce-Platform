const express = require("express");
const router = express.Router();
const addressService = require("../../services/address.service");

// [GET] /api/address/districts/:provinceCode
router.get("/districts/:provinceCode", async (req, res) => {
  try {
    const districts = await addressService.getDistricts(
      req.params.provinceCode
    );
    res.json(districts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

// [GET] /api/address/wards/:districtCode
router.get("/wards/:districtCode", async (req, res) => {
  try {
    const wards = await addressService.getWards(req.params.districtCode);
    res.json(wards);
  } catch (error) {
    console.error("Error fetching wards:", error);
    res.status(500).json({ error: "Failed to fetch wards" });
  }
});

// [POST] /api/address/validate
router.post("/validate", async (req, res) => {
  try {
    const result = await addressService.validateAddress(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error validating address:", error);
    res.status(500).json({ error: "Failed to validate address" });
  }
});

// [POST] /api/address/shipping-fee
router.post("/shipping-fee", async (req, res) => {
  try {
    const fee = await addressService.getShippingFee(req.body);
    res.json(fee);
  } catch (error) {
    console.error("Error calculating shipping fee:", error);
    res.status(500).json({ error: "Failed to calculate shipping fee" });
  }
});

module.exports = router;
