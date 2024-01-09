const cartController = require("../../controllers/home/cart");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.post("/create", authjwt, cartController.create);
router.put("/update-quantity", authjwt, cartController.updateQuantity);
router.get("/show", authjwt, cartController.show);

router.delete("/delete/:id", authjwt, cartController.delete);

module.exports = router;
