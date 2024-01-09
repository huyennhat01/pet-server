const { statusModel } = require("../models/status");
const { categoriesModel } = require("../models/categories");
const slug = require("slug");
const categoriesController = {
  index: async (req, res) => {
    try {
      const categories = await categoriesModel
        .find()
        .populate(["products", "status"]);
      const datas = categories.map((cate) => {
        const data = cate.toObject();
        data.status = cate.status.name;
        data.statusSlug = cate.status.slug;
        return data;
      });
      return res.status(200).json({ status: true, categories: datas });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  add: async (req, res) => {
    try {
      const status = [];
      const rs = await statusModel.find();
      rs.forEach((s) => {
        const data = { value: s._id, label: s.name };
        status.push(data);
      });

      return res.status(200).json({ status: true, data: { status } });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
  create: async (req, res) => {
    try {
      const { name, status } = req.body;
      const nameSlug = slug(name);
      await categoriesModel.create({ name, slug: nameSlug, status });
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const cate = await categoriesModel.findById(id).populate("products");
      if (!cate) {
        return res.status(401).json({ status: false });
      }
      const status = [];
      const rsStatus = await statusModel.find();
      rsStatus.forEach((s) => {
        const data = { value: s._id, label: s.name };
        status.push(data);
      });
      const data = cate.toObject();
      data.status = status;
      data.status_id = cate.status;
      return res.status(200).json({ status: true, data });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  update: async (req, res) => {
    try {
      const { name, status } = req.body;
      const nameSlug = slug(name);
      await categoriesModel.findByIdAndUpdate(req.params.id, {
        $set: { name, slug: nameSlug, status },
      });

      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, error });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await categoriesModel.findById(id).populate("products");
      if (data.products.length > 0) {
        return res.status(401).json({
          status: false,
          message: "Dữ liệu này đang liên kết với bảng khác!",
        });
      }
      await categoriesModel.findByIdAndDelete(id);
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = categoriesController;
