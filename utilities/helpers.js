const {model: PermissionModel} = require('../models/permission')
async function createDefaultPermission() {
    const normalUserPermission = new PermissionModel({ name: 'normal user' });
    await normalUserPermission.save();
    return normalUserPermission
}

function removeFieldFromDocument(document, fields) {
    const documentJson = document.toObject()
    fields.forEach(field => {
        delete documentJson[field]
    })
    return documentJson
}

function extractFieldsFromObject(obj, fields) {
    let outputObject = {}
    fields.forEach(field => {
        outputObject[field] = obj[field]
    })
    return outputObject
}

module.exports = {
    createDefaultPermission,
    removeFieldFromDocument,
    extractFieldsFromObject
}