const orderStatusController = require("../../controllers/admin/orderStatus");

const router = require("express").Router();

// //create
router.post("/create", orderStatusController.create);

// //edit
// router.get("/edit/:id", orderStatusController.edit);

// //update
// router.put("/edit/:id", orderStatusController.update);

// //delete
// router.delete("/delete/:id", orderStatusController.delete);

module.exports = router;
