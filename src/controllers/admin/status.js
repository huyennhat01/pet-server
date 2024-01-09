const { statusModel } = require("../../models/status");
const slug = require("slug");
const statusController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const nameSlug = slug(name);

      const user = await statusModel.create({ name, slug: nameSlug });
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await statusModel.findById(id).populate("users");
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
      await statusModel.findByIdAndUpdate(req.params.id, {
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
      const user_status = await statusModel.findById(id).populate("users");
      if (user_status.users.length > 0) {
        return res.status(401).json({
          status: false,
          message: "Dữ liệu này đang liên kết với bảng khác!",
        });
      }
      await statusModel.findByIdAndDelete(id);
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = statusController;
