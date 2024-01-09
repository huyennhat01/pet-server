const { orderModel } = require("../../models/order");
const slug = require("slug");
const { orderStatusModel } = require("../../models/orderStatus");
const { productModel } = require("../../models/product");
const orderController = {
  index: async (req, res) => {
    try {
      const orders = await orderModel
        .find()
        .populate({ path: "orderStatus" })
        .populate({ path: "user", select: "-password" });
      const datas = orders
        .map((order) => {
          const data = order.toObject();
          if (data.orderStatus.slug === "da-huy") return null;
          if (data.orderStatus.slug === "da-thanh-toan") return null;
          if (data.orderStatus.slug === "chua-thanh-toan") return null;
          return data;
        })
        .filter((data) => data !== null);

      return res.status(200).json({ status: false, orders: datas });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  indexTwo: async (req, res) => {
    try {
      const orders = await orderModel
        .find()
        .populate({ path: "orderStatus" })
        .populate({ path: "user", select: "-password" });
      const datas = orders
        .map((order) => {
          const data = order.toObject();
          if (data.orderStatus.slug == "da-nhan-hang") return null;
          if (data.orderStatus.slug == "dang-van-chuyen") return null;
          return data;
        })
        .filter((data) => data !== null);

      return res.status(200).json({ status: false, orders: datas });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  orderDetail: async (req, res) => {
    try {
      const id = req.params.id;
      const orderStatus = [];
      const order = await orderModel
        .findById(id)
        .populate("orderStatus")
        .populate({ path: "user", select: "-password" })
        .populate({ path: "products.product", select: "-description" });
      const rsOrderStatus = await orderStatusModel.find();
      rsOrderStatus.forEach((v) => {
        const data = { value: v._id, label: v.name };
        orderStatus.push(data);
      });
      // order.map((v)=>{
      //   const data = v.toObject()

      // })
      return res.status(200).json({ status: true, orderStatus, order });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;

      let orderStatus = req.body.orderStatus;
      const order = await orderModel.findById(id);

      if (orderStatus == "da-nhan-hang") {
        const ost = await orderStatusModel.findOne({ slug: orderStatus });
        orderStatus = ost._id;

        for (const pro of order.products) {
          const quantity = pro.quantity;
          await productModel.findByIdAndUpdate(pro.product, {
            $inc: { quantity: -quantity, purchases: +quantity },
          });
        }
      }
      await order.updateOne({
        $set: { orderStatus: orderStatus },
      });

      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = orderController;
