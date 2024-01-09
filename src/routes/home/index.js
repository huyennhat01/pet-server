const indexController = require("../../controllers/home/index");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.get("/categories", indexController.categories);
router.get("/recommend-product", indexController.recommendProduct);
router.get("/new-products", indexController.newProducts);
router.get("/sale-products", indexController.saleProducts);
router.get("/same-author-products/:author", indexController.sameAuthorProducts);

module.exports = router;
