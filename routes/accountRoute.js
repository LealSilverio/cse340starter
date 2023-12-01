// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Route to build pages
router
    .get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement)) // management view
    .get("/login", utilities.handleErrors(accountController.buildLogin)) // login view
    .get("/register", utilities.handleErrors(accountController.buildRegister)); // registration view

    // Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.logToAccount)
)

module.exports = router;