const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildLogin()
    req.flash("notice", "This is a flash message.")
    res.render("./account/login", {
      title: "Login",
      nav,
      form,
    })
  }
  
  module.exports = { buildLogin }