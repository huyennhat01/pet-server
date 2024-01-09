const { roleModel } = require("../../models/role");
const slug = require("slug");
const roleController = {
  index: async (req, res) => {
    try {
      const roles = await roleModel.find();
      return res.status(200).json({ status: true, roles });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  create: async (req, res) => {
    try {
      const { name, slug } = req.body;
      // const nameSlug = slug(name);
      await roleModel.create({ name, slug });
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await roleModel.findById(id).populate("users");
      if (!data) {
        return res.status(401).json({ status: false });
      }
      return res.status(200).json({ status: true, data });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  update: async (req, res) => {
    try {
      const { name } = req.body;
      const nameSlug = slug(name);
      await roleModel.findByIdAndUpdate(req.params.id, {
        $set: { name, slug: nameSlug },
      });

      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await roleModel.findById(id).populate("users");
      if (data.users.length > 0) {
        return res.status(401).json({
          status: false,
          message: "Dữ liệu này đang liên kết với bảng khác!",
        });
      }
      await roleModel.findByIdAndDelete(id);
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = roleController;
