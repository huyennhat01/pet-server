const express = require("express");
const adminAuthRoute = require("./admin/auth");
const adminRoleRoute = require("./admin/role");
const adminStatusRoute = require("./admin/status");
const adminOrderStatusRoute = require("./admin/orderStatus");
const adminProductRoute = require("./admin/product");
const adminRoute = require("./admin/admin");
const adminCategoriesRoute = require("./admin/categories");
const adminOrdersRoute = require("./admin/orders");
const homeAuthRoute = require("./home/auth");
const homeIndexRoute = require("./home/index");
const homeCartRoute = require("./home/cart");
const homeProductRoute = require("./home/product");
const orderRoute = require("./home/order");

const crawlDataRoute = require("./craw_data");


const router = express.Router();

// Admin routes
router.use("/api/v1/admin/auth", adminAuthRoute);
router.use("/api/v1/admin/role", adminRoleRoute);
router.use("/api/v1/admin/status", adminStatusRoute);
router.use("/api/v1/admin/order-status", adminOrderStatusRoute);
router.use("/api/v1/admin/product", adminProductRoute);
router.use("/api/v1/admin/user", adminRoute);
router.use("/api/v1/admin/categories", adminCategoriesRoute);
router.use("/api/v1/admin/orders", adminOrdersRoute);

// Home routes
router.use("/api/v1/home/auth", homeAuthRoute);
router.use("/api/v1/home/index", homeIndexRoute);
router.use("/api/v1/home/cart", homeCartRoute);
router.use("/api/v1/home/product", homeProductRoute);

// Payment route
router.use("/api/v1/home/order", orderRoute);

router.use("/api/v1/crawl-data", crawlDataRoute);


module.exports = router;
