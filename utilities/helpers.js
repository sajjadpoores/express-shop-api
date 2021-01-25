const { model: PermissionModel } = require("../models/permission");
async function createDefaultPermission() {
  const normalUserPermission = new PermissionModel({ name: "normal user" });
  await normalUserPermission.save();
  return normalUserPermission;
}

function removeFieldFromDocument(document, fields) {
  const documentJson = document.toObject();
  fields.forEach((field) => {
    delete documentJson[field];
  });
  return documentJson;
}

function extractFieldsFromObject(obj, fields) {
  let outputObject = {};
  fields.forEach((field) => {
    outputObject[field] = obj[field];
  });
  return outputObject;
}

function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  createDefaultPermission,
  removeFieldFromDocument,
  extractFieldsFromObject,
  randomString
};
