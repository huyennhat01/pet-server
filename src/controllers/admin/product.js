const { statusModel } = require("../../models/status");
const { categoriesModel } = require("../../models/categories");
const { productModel } = require("../../models/product");
const { publicId } = require("../../util/index");

const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = require("../../config");
const { adminModel } = require("../../models/admin");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const productController = {
  index: async (req, res) => {
    try {
      const rs = await productModel.find().populate(["categories", "status"]);
      const products = rs.map((pro) => {
        const product = pro.toObject();
        product.status = pro.status.name;
        product.statusSlug = pro.status.slug;
        product.categories = pro.categories.name;
        product.categoriesSlug = pro.categories.slug;
        return product;
      });
      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  add: async (req, res) => {
    try {
      const categories = [];
      const status = [];
      const rsStatus = await statusModel.find();
      rsStatus.forEach((v) => {
        const data = { value: v._id, label: v.name };
        status.push(data);
      });

      const rsCate = await categoriesModel.find();
      rsCate.forEach((v) => {
        const data = { value: v._id, label: v.name };
        categories.push(data);
      });
      return res.status(200).json({
        status: true,
        data: { status, categories },
      });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  create: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const data = req.body;
      const photos = [];
      if (data.photos) {
        for (const photo of data.photos) {
          const rs = await cloudinary.uploader.upload(photo, {
            folder: "images/products",
          });
          photos.push(rs.url);
        }
        data.photos = photos;
      }
      if (data.sale) {
        data.sale = data.sale / 100;
      }
      data.extraPerson = uid;
      // for (let i = 0; i <= 100; i++) {
      // data.name = req.body.name + "thứ" + i;
      const product = await productModel.create(data);
      await categoriesModel.updateOne(
        { _id: data.categories },
        { $push: { products: product._id } }
      );
      await adminModel.updateOne(
        { _id: uid },
        { $push: { products: product._id } }
      );
      // }
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await productModel
        .findById(id)
        .populate({ path: "categories", select: "-products" })
        .populate({ path: "status" });
      if (product) {
        const status = [];
        const categories = [];

        const rsStatus = await statusModel.find();
        rsStatus.forEach((s) => {
          const data = { value: s._id, label: s.name };
          status.push(data);
        });

        const rsCate = await categoriesModel.find();
        rsCate.forEach((s) => {
          const data = { value: s._id, label: s.name };
          categories.push(data);
        });

        const data = product.toObject();
        data.categories_id = product.categories._id;
        data.categories = categories;
        data.status_id = product.status._id;
        data.status = status;
        return res.status(200).json({ status: true, data });
      }
      return res
        .status(404)
        .json({ status: false, message: "Page not found!" });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;
      const photos = [];

      const product = await productModel.findById(req.params.id);

      if (product) {
        if (data.photos.length > 0) {
          for (const photo of data.photos) {
            if (photo.length < 500) {
              photos.push(photo);
            } else {
              const rs = await cloudinary.uploader.upload(photo, {
                folder: "images/products",
              });
              photos.push(rs.url);
            }
          }
          data.photos = photos;

          const del_photos = product.photos.filter(
            (item) => !photos.includes(item)
          );

          if (del_photos.length > 0) {
            for (const photo of del_photos) {
              await cloudinary.uploader.destroy(
                `images/products/${publicId(photo)}`
              );
            }
          }
        }
        if (data.sale) {
          data.sale = data.sale / 100;
        }
        if (data.categories) {
          await categoriesModel.updateMany(
            { products: req.params.id },
            { $pull: { products: req.params.id } }
          );
          await categoriesModel.updateOne(
            { _id: data.categories },
            { $push: { products: product._id } }
          );
        }
        await product.updateOne({ $set: data });
      }
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  delete: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const id = req.params.id;
      await categoriesModel.updateMany(
        { products: id },
        { $pull: { products: id } }
      );

      await adminModel.updateMany(
        { products: id },
        { $pull: { products: id } }
      );
      const product = await productModel.findById(id);

      if (product.photos.length > 0) {
        for (const photo of product.photos) {
          await cloudinary.uploader.destroy(
            `images/products/${publicId(photo)}`
          );
        }
      }

      await product.deleteOne();

      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = productController;
