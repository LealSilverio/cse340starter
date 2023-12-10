const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req , res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req , res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}
 
/* ****************************************
*  Deliver management view
* *************************************** */
accountCont.buildManagement = async function (req , res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req , res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
accountCont.logToAccount = async function (req , res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
      }
      else{
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
        return
      }
    } catch (error) {
      return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process LogOut
* *************************************** */
accountCont.logOut = async function (req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

/* ****************************************
*  Deliver Update account view
* *************************************** */
accountCont.buildUpdateAccount = async function (req , res, next) {
  let nav = await utilities.getNav()
  const { account_id } = req.params
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

/* ****************************************
*  Update account data
* *************************************** */
accountCont.updateAccount = async function (req , res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = res.locals.accountData.account_id;

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  if (updateResult) {
    try {
    res.clearCookie("jwt")
    const accessToken = jwt.sign(
      {
        account_id: account_id, 
        account_firstname: account_firstname, 
        account_lastname: account_lastname, 
        account_email: account_email
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `The account was successfully updated.`)
    res.redirect("/account")
    } catch (error) {
      console.error("Error updateAccount ", error)
    }
  } else {
    req.flash("notice", "Sorry, something failed.")
    res.status(500).render("/account/update/", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email
    })
  }
}

/* ****************************************
*  Update password
* *************************************** */
accountCont.updatePassword = async function (req , res) {
  let nav = await utilities.getNav()
  const { account_password } = req.body
  const account_id = res.locals.accountData.account_id;
  const account = res.locals.accountData

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the updated password.')
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email
    })
  }

  const updateResult = await accountModel.updatePassword( hashedPassword, account_id)
  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(500).render("/account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email
    })
  }
}

module.exports = accountCont