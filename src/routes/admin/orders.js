const orderController = require("../../controllers/admin/orders");
const authjwt = require("../../middleware/authenticate_token");
const { authPage } = require("../../middleware/authorization");

const router = require("express").Router();

router.get(
  "/orders-1",
  authjwt,
  authPage(["ADM", "MOD"]),
  orderController.index
);
router.get(
  "/orders-2",
  authjwt,
  authPage(["ADM", "MOD"]),
  orderController.indexTwo
);

router.get(
  "/detail/:id",
  authjwt,
  authPage(["ADM", "MOD"]),
  orderController.orderDetail
);
router.put(
  "/update/:id",
  authjwt,
  authPage(["ADM", "MOD"]),
  orderController.update
);

module.exports = router;
