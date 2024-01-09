const authController = require("../../controllers/home/auth");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/update",authjwt, authController.update);
router.get("/get-info",authjwt, authController.getUserInfo);
router.post("/login-google", authController.loginGoogle);

module.exports = router;
