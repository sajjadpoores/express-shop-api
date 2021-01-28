const { model: UserModel, validate: validateUser } = require("../models/user");
const jwt = require("jsonwebtoken");
const { model: PermissionModel } = require("../models/permission");
const {
  createDefaultPermission,
  removeFieldFromDocument,
  extractFieldsFromObject,
} = require("../utilities/helpers");

const path = require("path");
const fs = require("fs");
const multer = require("multer");

function uploadForUser(field, req, res) {
  const upload = multer({ dest: "temp/" }).single(field);
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send(err);
    } else if (err) {
      return res.status(500).send(err);
    }

    let pluralField = field + "s";
    if (field[field.length - 1] === "y") {
      pluralField = field.substr(0, field.length - 1) + "ies";
    }

    const tempPath = req.file.path;
    const imageName = `${new Date()
      .toISOString()
      .replace(/:/g, "-")}${path.extname(req.file.originalname)}`;
    const targetPath = path.join(
      __dirname,
      `../uploads/${pluralField}/${imageName}`
    );
    if (
      path.extname(req.file.originalname).toLowerCase() === ".png" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpeg"
    ) {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send({ status: "error", message: err });
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return res.status(500).send({ status: "error", message: err });

        return res
          .status(500)
          .send({ status: "error", message: "file extention not supported!" });
      });
    }

    const user = await UserModel.findById(req.user);
    if (user[field]) {
      const fieldPathArray = user[field].split("/");
      const fieldFileName = fieldPathArray[fieldPathArray.length - 1];
      fs.unlink(`uploads/${pluralField}/${fieldFileName}`, (err) => {
        if (err) {
          return res.status(500).send("Internal error, contact Admin.");
        }
      });
    }

    user[field] = `/public/${field}/${imageName}`;
    await user.save();
    res.status(200).send(_.pick(user, ["_id", field]));
  });
}

module.exports = {
  register: async function (req, res) {
    const data = extractFieldsFromObject(req.body, [
      "name",
      "password",
      "email",
      "phone",
    ]);

    const userValidation = validateUser(data);
    if (userValidation.error) {
      return res
        .status(400)
        .send(userValidation.error.details.map((detail) => detail.message));
    }

    if (data.email) {
      const userExists = await UserModel.findOne({ email: data.email });
      if (userExists) {
        return res
          .status(409)
          .send(["An account with such email is already registered"]);
      }
    }

    if (data.phone) {
      const userExists = await UserModel.findOne({ phone: data.phone });
      if (userExists) {
        return res
          .status(409)
          .send(["An account with such phone is already registered"]);
      }
    }

    let normalUserPermission = await PermissionModel.findOne({
      name: "normal user",
    });
    if (!normalUserPermission) {
      normalUserPermission = await createDefaultPermission();
    }
    data.permission = normalUserPermission._id;
    const newUser = new UserModel(data);
    try {
      await newUser.save();
      return res.send(removeFieldFromDocument(newUser, ["password"]));
    } catch (error) {
      console.log(error);
      res.status(500).send(["something went wrong!"]);
    }
  },
  login: async function (req, res) {
    const { email, phone, password } = req.body;
    const foundUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (foundUser) {
      const passwordIsCorrect = await foundUser.checkPassword(password);
      if (passwordIsCorrect) {
        const token = jwt.sign(
          { _id: foundUser._id, name: foundUser.name },
          process.env.PASSWORD_HASH_KEY
        );
        return res.send(token);
      } else {
        return res.send(["wrong password"]);
      }
    }
    return res.send(["user not found"]);
  },
  detail: async function (req, res) {
    const foundUser = await UserModel.findById(req.params.id);
    if (foundUser) {
      return res.send(removeFieldFromDocument(foundUser, ["password"]));
    }
    return res.status(404).send(["Could not find user with given ID"]);
  },
  getAll: async function (req, res) {
    const users = await UserModel.find();
    if (users) {
      return res.send(
        users.map((user) => removeFieldFromDocument(user, ["password"]))
      );
    }
    return res.status(500).send(["something went wrong!"]);
  },
  ban: async function (req, res) {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/))
      res.status(400).send("The given ID is not valid!");

    const user = await UserModel.findById(userId);
    if (!user) res.status(404).send(`User with given ID couldn't be found.`);
    user.isActive = false;
    await user.save();
    res
      .status(200)
      .send(
        _.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "isActive",
          "email",
          "phone",
        ])
      );
  },
  unban: async function (req, res) {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/))
      res.status(400).send("The given ID is not valid!");

    const user = await UserModel.findById(userId);
    if (!user) res.status(404).send(`User with given ID couldn't be found.`);

    user.isActive = true;
    await user.save();
    res
      .status(200)
      .send(
        _.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "isActive",
          "email",
          "phone",
        ])
      );
  },
  uploadAvatar: async function (req, res) {
    uploadForUser("avatar", req, res);
  },
  uploadOptometry: async function (req, res) {
    uploadForUser("optometry", req, res);
  },
  uploadInsurance: async function (req, res) {
    uploadForUser("insurance", req, res);
  },
};
