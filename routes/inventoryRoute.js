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
    .get("/", utilities.handleErrors(invController.buildManagement)) // management page
    .get("/add-classification", utilities.handleErrors(invController.buildAddClassification)) // add classification
    .get("/add-inventory", utilities.handleErrors(invController.buildAddInventory)) // add inventory
    .get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON)) // get inventory JSON
    .get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory)) // edit inventory
    .get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory)); // delete inventory

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
    "/edit",
    insertValidate.insertInvRules(),
    insertValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

router.post(
    "/delete",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;