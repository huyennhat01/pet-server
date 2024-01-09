const authAdminController = require("../../controllers/admin/auth");

const router = require("express").Router();
router.post("/login", authAdminController.login);

module.exports = router;
