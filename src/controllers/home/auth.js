const { statusModel } = require("../../models/status");
const { userModel } = require("../../models/user");
const { endcodedToken } = require("../../util/index");
const bcrypt = require("bcryptjs");

const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = require("../../config");

const cloudinary = require("cloudinary").v2;

const { publicId } = require("../../util/index");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).populate("status").exec()

      if (!user) {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Email hoặc mật khẩu không đúng!",
            },
          },
        });
      }
      // const checkPass = await bcrypt.compare(password, user.password);
      // if (user && checkPass) {
      //   if (user.status.slug == "tam-khoa") {
      //     return res.status(400).json({
      //       success: false,
      //       error: { keyPattern: { message: "Tài khoản của bạn đã bị khóa!" } },
      //     });
      //   }
        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }),
        });
      // } else {
      //   return res.status(400).json({
      //     success: false,
      //     error: {
      //       keyPattern: {
      //         message: "Email hoặc mật khẩu không đúng!",
      //       },
      //     },
      //   });
      // }
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password, photo } = req.body;

      const data = await userModel.findOne({ email }).populate("status");

      if (!data) {
        const status = await statusModel.findOne({ slug: "hoat-dong" });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        const user = await userModel.create({
          email,
          name,
          photo,
          password: hashedPassword,
          status: status._id,
        });

        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }),
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  },

  loginGoogle: async (req, res) => {
    try {
      const { email, photo, name } = req.body;
      const data = await userModel.findOne({ email }).populate("status");
      if (!data) {
        const status = await statusModel.findOne({ slug: "hoat-dong" });

        const user = await userModel.create({
          email,
          photo,
          name,
          status: status._id,
        });

        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }),
        });
      }
      return res.status(200).json({
        success: true,
        token: endcodedToken({
          id: data._id,
          name: data.name,
          photo: data.photo,
        }),
      });
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      const uid = req.user.sub.id;

      const user = await userModel.findById(uid);
      if (user) {
        if (data.photo && data.photo.length > 100) {
          if (user.photo) {
            await cloudinary.uploader.destroy(
              `images/users/${publicId(user.photo)}`
            );
          }

          const rs = await cloudinary.uploader.upload(data.photo, {
            folder: "images/users",
          });

          data.photo = rs.url;
        }

        await user.updateOne({ $set: data });
      }

      return res.status(200).json({
        status: true,
        user: {
          name: user.name,
          photo: data.photo,
          phone: user.phone,
          address: user.address,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: error });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const rs = await userModel.findById(uid);
      return res.status(200).json({
        status: true,
        user: {
          name: rs.name,
          photo: rs.photo,
          phone: rs.phone,
          address: rs.address,
          email: rs.email,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = authController;
