const userAdminController = require("../../controllers/admin/admin");
const authjwt = require("../../middleware/authenticate_token");
const { authPage } = require("../../middleware/authorization");

const router = require("express").Router();

router.get("/", authjwt, authPage(["ADM"]), userAdminController.index);
router.get(
  "/users",
  authjwt,
  authPage(["ADM", "MOD"]),
  userAdminController.userIndex
);
//create
router.get("/create", authjwt, authPage(["ADM"]), userAdminController.add);
router.post("/create", authjwt, authPage(["ADM"]), userAdminController.create);
router.post("/create-admin", userAdminController.createAdmin);

//edit & update
router.get("/edit/:id", authjwt, authPage(["ADM"]), userAdminController.edit);
router.put("/edit/:id", authjwt, authPage(["ADM"]), userAdminController.update);
router.put(
  "/lock/:id",
  authjwt,
  authPage(["ADM", "MOD"]),
  userAdminController.lock
);

//delete
router.delete(
  "/delete/:id",
  authPage(["ADM"]),
  authjwt,
  userAdminController.delete
);

module.exports = router;
