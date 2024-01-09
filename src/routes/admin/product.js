const productController = require("../../controllers/admin/product");
const { authPage } = require("../../middleware/authorization");
const authjwt = require("../../middleware/authenticate_token");
const router = require("express").Router();

router.get("/",authjwt, authPage(["ADM","MOD"]), productController.index);
router.get("/create",authjwt, authPage(["ADM","MOD"]), productController.add);
router.post("/create",authjwt, authPage(["ADM","MOD"]), productController.create);

router.get("/edit/:id",authjwt, authPage(["ADM","MOD"]), productController.edit);
router.put("/edit/:id",authjwt, authPage(["ADM","MOD"]), productController.update);

router.delete("/delete/:id",authjwt, authPage(["ADM","MOD"]), productController.delete);

module.exports = router;
