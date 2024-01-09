const roleController = require("../../controllers/admin/role");
const router = require("express").Router();

router.get("/", roleController.index);

// //create
router.post("/create", roleController.create);

// //edit
// router.get("/edit/:id", roleController.edit);
// router.put("/edit/:id", roleController.update);

// //delete
// router.delete("/delete/:id", roleController.delete);

module.exports = router;
