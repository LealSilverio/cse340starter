// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const insertValidate = require('../utilities/adding-validation')

// Routes to build
router
    .get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)) // inventory by classification view
    .get("/detail/:inv_id", utilities.handleErrors(invController.buildById)) // product page
    .get("/", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.buildManagement)) // management page
    .get("/add-classification", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification)) // add classification
    .get("/add-inventory", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventory)) // add inventory
    .get("/getInventory/:classification_id", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.getInventoryJSON)) // get inventory JSON
    .get("/edit/:inv_id", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventory)) // edit inventory
    .get("/delete/:inv_id", utilities.checkAccess, utilities.checkAuthorization, utilities.handleErrors(invController.buildDeleteInventory)); // delete inventory

// Process data
router.post(
    "/add-classification",
    insertValidate.insertClassificationRules(),
    insertValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
router.post(
    "/add-inventory",
    insertValidate.insertInvRules(),
    insertValidate.checkInvData,
    utilities.handleErrors(invController.addToInventory)
)

router.post(
    "/update/",
    insertValidate.insertInvRules(),
    insertValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

router.post(
    "/delete/",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;