const statusController = require("../../controllers/admin/status");
const router = require("express").Router();

// //create
router.post("/create", statusController.create);

// //edit
// router.get("/edit/:id", statusController.edit);

// //update
// router.put("/edit/:id", statusController.update);

// //delete
// router.delete("/delete/:id", statusController.delete);

module.exports = router;
