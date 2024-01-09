const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const { orderModel } = require("../models/order");
const { orderStatusModel } = require("../models/orderStatus");
const { cartModel } = require("../models/cart");
const mongoose = require("mongoose");
const {
  VNP_TMNCODE,
  VNP_HASHSECRET,
  VNP_API,
  VNP_RETURNURL,
  VNP_URL,
  CLIENT_URL,
} = require("../config");
const { productModel } = require("../models/product");
const { rateModel } = require("../models/rate");

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

const orderController = {
  create: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const { products, totalPrice, paymentMethod } = req.body;

      const orderStatus = await orderStatusModel.findOne({ slug: "da-huy" });

      const order = new orderModel({
        user: uid,
        products,
        totalPrice,
        paymentMethod,
        orderStatus: orderStatus._id,
      });
      const cart = await cartModel.findOne({ user: uid });
      await cart.deleteOne();

      return await order.save();
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  createUrl: async (req, res) => {
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";

      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      const rs = await orderController.create(req, res);

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = VNP_TMNCODE;
      let secretKey = VNP_HASHSECRET;
      let vnpUrl = VNP_URL;
      let returnUrl = VNP_RETURNURL;

      let orderId = rs._id;

      let amount = rs.totalPrice;
      let locale = "vn";

      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      return res.status(200).json({ status: true, vnpUrl: vnpUrl });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },

  vnpRs: async (req, res) => {
    try {
      let vnp_Params = req.query;

      let secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      let tmnCode = VNP_TMNCODE;
      let secretKey = VNP_HASHSECRET;

      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");

      if (secureHash === signed) {
        const rsCode = vnp_Params["vnp_ResponseCode"];
        if (rsCode == "00") {
          const pid = vnp_Params["vnp_TxnRef"];

          const orderStatus = await orderStatusModel.findOne({
            slug: "da-thanh-toan",
          });

          const order = await orderModel.findById(pid);

          await order.updateOne({
            $set: { orderStatus: orderStatus._id },
          });

          return res.redirect(`${CLIENT_URL}/checkout/success`);
        }
        return res.redirect(`${CLIENT_URL}/checkout/error`);
      } else {
        return res.redirect(`${CLIENT_URL}/checkout/error`);
      }
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  showOrderByUser: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const orders = await orderModel
        .find({ user: uid })
        .populate({ path: "products.product", select: "-description" })
        .populate({
          path: "orderStatus",
          select: "-createdAt -updatedAt",
        })
        .sort({ createdAt: -1 });
      const orderStatus = await orderStatusModel.find();
      return res.status(200).json({ status: true, orderStatus, orders });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const ost = await orderStatusModel.findOne({
        slug: req.body.orderStatus,
      });

      const order = await orderModel.findById(id);

      if (ost.slug == "da-nhan-hang") {
        for (const pro of order.products) {
          const quantity = pro.quantity;
          await productModel.findByIdAndUpdate(pro.product._id, {
            $inc: { quantity: -quantity, purchases: +quantity },
          });
        }
      }
      await order.updateOne({
        $set: { orderStatus: ost._id },
      });
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
    }
  },
  vote: async (req, res) => {
    try {
      const { productId, itemId, content, star } = req.body.data;
      const uid = req.user.sub.id;
      orderModel
        .updateOne(
          { "products._id": itemId },
          { $set: { "products.$.status": 1 } }
        )
        .exec()
        .then(async (result) => {
          const rate = await rateModel.create({
            user: uid,
            content,
            star,
            product: productId,
          });

          const rs = await rateModel.aggregate([
            {
              $match: {
                product: new mongoose.Types.ObjectId(productId),
              },
            },
            {
              $group: {
                _id: null,
                avgStar: { $avg: "$star" },
              },
            },
          ]);

          const averageStar = rs.length > 0 ? rs[0].avgStar : null;

          await productModel.updateOne(
            { _id: productId },
            {
              $push: { rates: rate._id },
              $set: { star: averageStar }
            }
          );
          
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật:", error);
        });
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
    }
  },
 
};

module.exports = orderController;
