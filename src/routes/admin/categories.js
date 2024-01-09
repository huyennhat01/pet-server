const categoriesController = require("../../controllers/categories");
const { authPage } = require("../../middleware/authorization");
const authjwt = require("../../middleware/authenticate_token");
const router = require("express").Router();



router.get("/", authjwt, authPage(["ADM","MOD"]),categoriesController.index);

//create
router.get("/create",authjwt, authPage(["ADM","MOD"]), categoriesController.add);
router.post("/create", authjwt, authPage(["ADM","MOD"]),categoriesController.create);

//edit
router.get("/edit/:id", authjwt, authPage(["ADM","MOD"]),categoriesController.edit);
router.put("/edit/:id", authjwt, authPage(["ADM","MOD"]),categoriesController.update);

//delete
router.delete("/delete/:id",authjwt, authPage(["ADM","MOD"]), categoriesController.delete);

module.exports = router;
