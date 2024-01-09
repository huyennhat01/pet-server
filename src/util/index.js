const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

const publicId = (imageURL) => {
  return imageURL.split("/").pop().split(".")[0];
};

const endcodedToken = (data) => {
  return jwt.sign(
    {
      iss: "huyennhat.dev",
      sub: data,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 7),
    },
    JWT_SECRET
  );
};

module.exports = { publicId, endcodedToken };
