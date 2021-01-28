const path = require("path");

module.exports = {
  // serve images
  get: async function (req, res) {
    res.sendFile(path.join(__dirname, "../uploads/" + req.params.name));
  },
  // serve avatar images
  getAvatar: async function (req, res) {
    res.sendFile(path.join(__dirname, "../uploads/avatars/" + req.params.name));
  },
  // serve optometry images
  getOptometry: async function (req, res) {
    res.sendFile(
      path.join(__dirname, "../uploads/optometries/" + req.params.name)
    );
  },
  // serve insurance images
  getInsurance: async function (req, res) {
    res.sendFile(
      path.join(__dirname, "../uploads/insurances/" + req.params.name)
    );
  },
};
