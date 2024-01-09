const { adminModel } = require("../../models/admin");
const { statusModel } = require("../../models/status");
const { roleModel } = require("../../models/role");
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = require("../../config");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");
const cloudinary = require("cloudinary").v2;

const { publicId } = require("../../util/index");
const { userModel } = require("../../models/user");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const userAdminController = {
  index: async (req, res) => {
    try {
      const users = await adminModel
        .find()
        .select("-password")
        .populate(["role", "status"]);
      const datas = users
        .map((user) => {
          const data = user.toObject();
          const roleSlug = user.role.slug;
          const statusSlug = user.status.slug;
          data.role = user.role.name;
          data.roleSlug = roleSlug;
          data.status = user.status.name;
          data.statusSlug = statusSlug;
          if (data.roleSlug === "ADM") return null;
          return data;
        })
        .filter((data) => data !== null);
      console.log(datas);
      return res.status(200).json({ status: true, users: datas });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
  userIndex: async (req, res) => {
    try {
      const users = await userModel
        .find()
        .select("-password")
        .populate(["status"]);
      const datas = users
        .map((user) => {
          const data = user.toObject();
          const statusSlug = user.status.slug;
          data.status = user.status.name;
          data.statusSlug = statusSlug;
          return data;
        })
        .filter((data) => data !== null);
      console.log(datas);
      return res.status(200).json({ status: true, users: datas });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
  add: async (req, res) => {
    try {
      const roles = [];
      const status = [];

      const rsStatus = await statusModel.find();
      rsStatus.forEach((v) => {
        const data = { value: v._id, label: v.name };
        status.push(data);
      });

      const rsRole = await roleModel.find();
      rsRole.forEach((v) => {
        if (v.slug != "ADM") {
          const data = { value: v._id, label: v.name };
          roles.push(data);
        }
      });
      return res.status(200).json({
        status: true,
        data: { status, roles },
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
  create: async (req, res) => {
    try {
      const data = req.body;

      if (validator.validate(data.email)) {
        if (data.photo) {
          const rs = await cloudinary.uploader.upload(data.photo, {
            folder: "images/users",
          });
          data.photo = rs.url;
        }

        data.password = await bcrypt.hash(data.password, 10);
        const user = await adminModel.create(data);
        await roleModel.updateOne(
          { _id: data.role },
          { $push: { admins: user._id } }
        );

        return res.status(200).json({ status: true });
      }
      return res.status(401).json({
        status: false,
        error: {
          keyPattern: {
            message: "Email không đúng định dạng!",
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  createAdmin: async (req, res) => {
    try {
      const data = req.body;

      if (validator.validate(data.email)) {
        if (data.photo) {
          const rs = await cloudinary.uploader.upload(data.photo, {
            folder: "images/users",
          });
          data.photo = rs.url;
        }

        data.password = await bcrypt.hash(data.password, 10);
        const user = await adminModel.create(data);
        await roleModel.updateOne(
          { _id: data.role },
          { $push: { admins: user._id } }
        );

        return res.status(200).json({ status: true });
      }
      return res.status(401).json({
        status: false,
        error: {
          keyPattern: {
            message: "Email không đúng định dạng!",
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await adminModel
        .findById(id)
        .populate({ path: "role", select: "-admins" })
        .populate({ path: "status" });
      if (user) {
        const roles = [];
        const status = [];
        const rsStatus = await statusModel.find();
        rsStatus.forEach((s) => {
          const data = { value: s._id, label: s.name };
          status.push(data);
        });

        const rsRole = await roleModel.find();
        rsRole.forEach((v) => {
          if (v.slug != "ADM") {
            const data = { value: v._id, label: v.name };
            roles.push(data);
          }
        });

        const data = user.toObject();
        data.role_id = user.role._id;
        data.role = roles;
        data.status_id = user.status._id;
        data.status = status;
        return res.status(200).json({ status: true, data });
      }
      return res
        .status(404)
        .json({ status: false, message: "Page not found!" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      const id = req.params.id;

      if (data.email && !validator.validate(data.email)) {
        return res.status(401).json({
          status: false,
          error: {
            keyPattern: {
              message: "Email không đúng định dạng!",
            },
          },
        });
      }

      const user = await adminModel.findById(id);
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

        if (data.change_password) {
          data.password = await bcrypt.hash(data.password, 10);
        }
        if (data.role) {
          await roleModel.updateMany({ admins: id }, { $pull: { admins: id } });
          await roleModel.updateOne(
            { _id: data.role },
            { $push: { admins: user._id } }
          );
        }
        await user.updateOne({ $set: data });
      }
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      await roleModel.updateMany({ admins: id }, { $pull: { admins: id } });
      const user = await adminModel.findById(id);

      if (user.photo) {
        await cloudinary.uploader.destroy(
          `images/users/${publicId(user.photo)}`
        );
      }
      await user.deleteOne();

      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  lock: async (req, res) => {
    try {
      const id = req.params.id;
      let status;
      const user = await userModel.findById(id).populate({ path: "status" });
      if (user.status.slug == "hoat-dong") {
        status = await statusModel.findOne({ slug: "tam-khoa" });
      } else {
        status = await statusModel.findOne({ slug: "hoat-dong" });
      }
      await user.updateOne({ $set: { status: status._id } });

      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = userAdminController;
