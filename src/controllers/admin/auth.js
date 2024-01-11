const { adminModel } = require("../../models/admin");
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = require("../../config");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const { endcodedToken } = require("../../util/index");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const authAdminController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await adminModel
        .findOne({ username })
     

        console.log(user)

      if (!user) {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Tài khoản hoặc mật khẩu không đúng!",
            },
          },
        });
      }
      
      if (user ) {
        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
            role: user.role.slug,
          }),
        });
      } else {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Tài khoản hoặc mật khẩu không đúng!",
            },
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
};

module.exports = authAdminController;
