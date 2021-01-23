const { model: UserModel } = require("../models/user");
const { model: PermissionModel } = require("../models/permission");

function permission(permissionName, selfAllowed = false) {
  return async function (req, res, next) {
    const requestedUser = await UserModel.findById(req.user._id);
    const requestedUserPermission = await PermissionModel.findById(
      requestedUser.permission
    );
    if (requestedUserPermission[permissionName]) return next();

    if (selfAllowed) {
      if (req.user._id === req.params.id) return next()
      return res.status(405).send(["you are not allowed!"]);
    }
  };
}

module.exports = permission;
